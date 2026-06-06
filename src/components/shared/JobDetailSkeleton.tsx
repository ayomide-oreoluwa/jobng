export default function JobDetailSkeleton() {
  return (
    <div className="jj-detail-skeleton">
      {/* Hero */}
      <div className="jj-detail-skeleton__hero">
        <div className="container-xl">
          <div className="jj-shimmer jj-detail-skeleton__back" />
          <div className="jj-detail-skeleton__hero-row">
            <div className="jj-shimmer jj-detail-skeleton__avatar" />
            <div className="jj-detail-skeleton__hero-text">
              <div className="jj-shimmer jj-detail-skeleton__title" />
              <div className="jj-shimmer jj-detail-skeleton__company" />
              <div className="jj-detail-skeleton__pills">
                <div className="jj-shimmer jj-detail-skeleton__pill" />
                <div className="jj-shimmer jj-detail-skeleton__pill" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-xl jj-detail-skeleton__body">
        <div className="jj-detail-skeleton__grid">
          <div className="jj-detail-skeleton__main">
            <div className="jj-card jj-detail-skeleton__card">
              <div className="jj-shimmer jj-detail-skeleton__heading" />
              <div className="jj-shimmer jj-detail-skeleton__line" />
              <div className="jj-shimmer jj-detail-skeleton__line" />
              <div className="jj-shimmer jj-detail-skeleton__line jj-detail-skeleton__line--short" />
              <div className="jj-shimmer jj-detail-skeleton__line" />
              <div className="jj-shimmer jj-detail-skeleton__line" />
              <div className="jj-shimmer jj-detail-skeleton__line jj-detail-skeleton__line--medium" />
            </div>
          </div>
          <div className="jj-detail-skeleton__aside">
            <div className="jj-card jj-detail-skeleton__card">
              <div className="jj-shimmer jj-detail-skeleton__heading jj-detail-skeleton__heading--sm" />
              <div className="jj-shimmer jj-detail-skeleton__btn" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
