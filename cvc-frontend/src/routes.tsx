import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";
import Profile from "./features/user/Profile";
import EditProfile from "./features/user/EditProfile";
import ProjectList from "./features/portfolio/ProjectList";
import ProjectDetail from "./features/portfolio/ProjectDetail";
import UserList from "./features/user/UserList";
import ProjectEditor from "./features/portfolio/ProjectEditor";
import BlogList from "./features/blog/BlogList";
import BlogDetail from "./features/blog/BlogDetail";
import ProductList from "./features/product/ProductList";
import OrderList from "./features/order/OrderList";
import BlogEditor from "./features/blog/BlogEditor";
import OrderDetail from "./features/order/OrderDetail";
import ProductEditor from "./features/product/ProductEditor";
import ProductDetail from "./features/product/ProductDetail";
import Subscribe from "./features/newsletter/Subscribe";
import MpesaPayment from "./features/mpesa/MpesaPayment";
import Checkout from "./features/order/Checkout";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminAnalytics from "./features/admin/AdminAnalytics";
import AdminNewsletter from "./features/newsletter/AdminNewsletter";
// ...import other pages

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/projects/new" element={<ProjectEditor />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/admin/blogs/new" element={<BlogEditor />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/admin/products/new" element={<ProductEditor />} />
        <Route path="/admin/products/:id/edit" element={<ProductEditor />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/newsletter/subscribe" element={<Subscribe />} />
        <Route path="/mpesa" element={<MpesaPayment />} />
        {/* For checkout, you may use a modal or a route like below */}
        <Route path="/checkout/:productId" element={<Checkout productId={""} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        {/* Add other feature routes here */}
      </Routes>
    </BrowserRouter>
  );
}