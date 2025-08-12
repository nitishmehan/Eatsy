import User from '@/models/User';
import MenuItem from '@/models/MenuItem';
import Review from '@/models/Review';
import dbConnect from './mongodb';

export async function getFilteredRestaurants(filters = {}) {
  await dbConnect();
  
  const {
    cuisine,
    priceRange,
    minRating,
    isOpen,
    dietary,
    sortBy = 'rating',
    sortOrder = 'desc',
    search
  } = filters;

  // Build query - only show open restaurants
  const query = { role: 'vendor', isOpen: true };
  
  // Add text search if search query exists
  if (search && search.trim()) {
    query.$text = { $search: search.trim() };
  }
  
  // Apply filters
  if (cuisine) query.cuisine = cuisine;
  if (priceRange) query.priceRange = priceRange;

  console.log('Filter Query:', query); // Debug log

  // Get vendors
  let vendors = await User.find(query).lean();

  console.log(`Found ${vendors.length} vendors before rating filter`); // Debug log

  // Get ratings for each vendor
  const vendorIds = vendors.map(v => v._id);
  const ratings = await Review.aggregate([
    { $match: { vendorId: { $in: vendorIds } } },
    { 
      $group: { 
        _id: '$vendorId', 
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  // Merge ratings with vendors
  const ratingMap = Object.fromEntries(
    ratings.map(r => [r._id.toString(), { avgRating: r.avgRating, reviewCount: r.reviewCount }])
  );

  vendors = vendors.map(v => ({
    ...v,
    avgRating: ratingMap[v._id.toString()]?.avgRating || 0,
    reviewCount: ratingMap[v._id.toString()]?.reviewCount || 0
  }));

  // Filter by minimum rating
  if (minRating) {
    const minRatingNum = parseFloat(minRating);
    vendors = vendors.filter(v => v.avgRating >= minRatingNum);
    console.log(`After rating filter (${minRatingNum}+): ${vendors.length} vendors`); // Debug log
  }

  // Filter by dietary preferences in menu
  if (dietary) {
    const vendorsWithDietary = await MenuItem.distinct('vendorId', { 
      dietary: dietary,
      available: true 
    });
    vendors = vendors.filter(v => 
      vendorsWithDietary.some(id => id.toString() === v._id.toString())
    );
  }

  // Sort
  vendors.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'rating':
        comparison = a.avgRating - b.avgRating;
        break;
      case 'deliveryTime':
        comparison = (a.estimatedDelivery || 999) - (b.estimatedDelivery || 999);
        break;
      case 'name':
        comparison = (a.restaurantName || '').localeCompare(b.restaurantName || '');
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  console.log(`Final sorted vendors: ${vendors.length}`); // Debug log

  return vendors;
}

export async function getFilteredMenuItems(vendorId, filters = {}) {
  const {
    category,
    dietary,
    maxPrice,
    minPrice,
    sortBy = 'name',
    sortOrder = 'asc'
  } = filters;

  const query = { vendorId, available: true };
  
  if (category) query.category = category;
  if (dietary) query.dietary = { $in: [dietary] };
  if (maxPrice || minPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const sortOption = {};
  sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return await MenuItem.find(query).sort(sortOption).lean();
}
