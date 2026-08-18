"use client";

interface PageLoaderProps {
  label?: string;
  variant?: "compact" | "full";
}

export default function PageLoader({ label = "Loading", variant = "full" }: PageLoaderProps) {
  if (variant === "compact") {
    return (
      <span className="jj-loader jj-loader--compact inline-flex items-center gap-2 text-sm text-gray-600" role="status" aria-live="polite">
        <span className="jj-loader__ring jj-loader__ring--compact w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" aria-hidden />
        <span className="jj-loader__label">{label}</span>
      </span>
    );
  }

  return (
    <div className="jj-loader jj-loader--full min-h-[300px] py-16 flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
      <div className="jj-loader__wrap relative mb-4">
        <span className="jj-loader__ring jj-loader__ring--outer block w-14 h-14 border-4 border-emerald-100 border-t-[#00A651] rounded-full animate-spin" aria-hidden />
      </div>
      <p className="jj-loader__label text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}