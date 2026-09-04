export default function CatalogueLoading() {
  return (
    <div className="container loading-page" aria-label="Loading catalogue" aria-busy="true">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-control" />
      <div className="loading-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        ))}
      </div>
    </div>
  );
}
