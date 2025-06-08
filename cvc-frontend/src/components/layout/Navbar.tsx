import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-brand-dark border-b border-primary px-4 py-2 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo192.png" alt="CVC Logo" className="h-8 w-8" />
        <span className="text-primary font-bold text-xl">CVC Agency</span>
      </Link>
      <div className="flex gap-4">
        <Link to="/blogs" className="hover:text-primary">Blog</Link>
        <Link to="/projects" className="hover:text-primary">Portfolio</Link>
        <Link to="/products" className="hover:text-primary">Shop</Link>
        <Link to="/orders" className="hover:text-primary">Orders</Link>
        <Link to="/login" className="hover:text-primary">Login</Link>
      </div>
    </nav>
  );
}