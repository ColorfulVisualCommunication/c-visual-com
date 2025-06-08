import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

type Product = {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  price: number;
  in_stock: boolean;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <SEO title="Products" />
      <h1 className="text-3xl font-bold text-primary mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card
            key={product.id}
            title={product.name}
            description={product.description}
            imageUrl={product.image_url}
          >
            <div className="flex justify-between items-center mt-2">
              <span className="text-warning font-bold">${product.price}</span>
              <span className={product.in_stock ? "text-primary" : "text-danger"}>
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}