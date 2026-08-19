export default function JobDetailSkeleton() {
  return (
    <div
      className="min-h-screen bg-(--surface) animate-pulse"
      role="status"
      aria-label="Loading job details"
    >
      {/* Hero Section Skeleton */}
      <div className="bg-(--ink) relative overflow-hidden pt-12 pb-16 md:py-20 border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button skeleton */}
          <div className="w-28 h-4 bg-white/10 rounded mb-6" />

          <div className="flex flex-col md:flex-row gap-5 md:items-center justify-between">
            <div className="flex items-start gap-5 w-full">
              {/* Company Logo Avatar */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-(--radius-md) bg-white/10 shrink-0" />

              <div className="space-y-3 w-full max-w-xl">
                {/* Job Title */}
                <div className="h-8 md:h-10 bg-white/10 rounded-md w-3/4" />
                {/* Company Name */}
                <div className="h-5 bg-white/10 rounded w-1/3" />

                {/* Badges / Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="w-24 h-7 bg-white/10 rounded-full" />
                  <div className="w-32 h-7 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Description Body Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-(--surface-elevated) border border-(--border) rounded-(--radius-md) shadow-(--shadow-sm) p-6 sm:p-8 space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 bg-(--border-strong) rounded-full" />
                <div className="h-6 w-36 bg-(--border)/60 rounded" />
              </div>

              {/* Paragraph Line Skeletons */}
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-(--border)/50 rounded w-full" />
                <div className="h-4 bg-(--border)/50 rounded w-[94%]" />
                <div className="h-4 bg-(--border)/50 rounded w-[88%]" />
                <div className="h-4 bg-(--border)/50 rounded w-[60%]" />
              </div>

              <div className="space-y-3 pt-4">
                <div className="h-4 bg-(--border)/50 rounded w-[96%]" />
                <div className="h-4 bg-(--border)/50 rounded w-[90%]" />
                <div className="h-4 bg-(--border)/50 rounded w-[75%]" />
              </div>

              <div className="space-y-3 pt-4">
                <div className="h-4 bg-(--border)/50 rounded w-[92%]" />
                <div className="h-4 bg-(--border)/50 rounded w-[85%]" />
                <div className="h-4 bg-(--border)/50 rounded w-[40%]" />
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Skeleton */}
          <aside className="lg:sticky lg:top-28">
            <div className="bg-(--surface-elevated) border border-(--border) rounded-(--radius-md) shadow-(--shadow-sm) p-6 space-y-4">
              <div className="h-3 w-28 bg-(--border)/60 rounded" />
              <div className="h-6 w-3/4 bg-(--border)/70 rounded" />
              <div className="h-4 w-1/2 bg-(--border)/50 rounded mb-4" />

              {/* CTA Button Skeleton */}
              <div className="h-12 w-full bg-(--border)/70 rounded-(--radius-sm) mt-6" />

              <div className="pt-4 border-t border-(--border) flex justify-between">
                <div className="h-3 w-24 bg-(--border)/50 rounded" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
