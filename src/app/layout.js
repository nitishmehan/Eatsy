import "./globals.css";

export const metadata = {
  title: "Eatsy - Food Ordering Platform",
  description: "Order food from your favorite restaurants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
