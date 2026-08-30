import ProductCard from "./ProductCard";

export default function ProductGrid({ products, className = "" }) {
  return (
    <div className={`product-grid ${className}`.trim()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
