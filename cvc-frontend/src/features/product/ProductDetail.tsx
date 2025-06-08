import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data.product)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-danger">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <SEO title={product.name} />
      <img src={product.image_url} alt={product.name} className="w-full rounded-lg mb-4" />
      <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
      <p className="text-gray-300 mb-4">{product.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-warning font-bold">${product.price}</span>
        <span className={product.in_stock ? "text-primary" : "text-danger"}>
          {product.in_stock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <Button variant="primary" className="w-full" disabled={!product.in_stock}>
        Add to Cart
      </Button>
    </div>
  );
}