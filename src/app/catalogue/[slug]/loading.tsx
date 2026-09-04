export default function ProductLoading() {
  return (
    <div className="container loading-product" aria-label="Loading product" aria-busy="true">
      <div className="skeleton skeleton-product-visual" />
      <div>
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-control" />
      </div>
    </div>
  );
}
