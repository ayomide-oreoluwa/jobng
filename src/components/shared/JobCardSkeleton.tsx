interface JobCardSkeletonProps {
  variant?: "list" | "grid";
}

const shimmer: React.CSSProperties = {
  background:
    "linear-gradient(100deg, #eef2f7 30%, #f8fafc 50%, #eef2f7 70%)",
  backgroundSize: "200% 100%",
  animation: "jjShimmer 1.3s ease-in-out infinite",
  borderRadius: 6,
};

function Bar({ w, h = 12, style }: { w: number | string; h?: number; style?: React.CSSProperties }) {
  return <div style={{ ...shimmer, width: w, height: h, ...style }} />;
}

export default function JobCardSkeleton({ variant = "grid" }: JobCardSkeletonProps) {
  if (variant === "list") {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          padding: "18px 20px",
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div style={{ ...shimmer, width: 56, height: 56, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          <Bar w="60%" h={15} />
          <Bar w="35%" h={12} />
          <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
            <Bar w={70} h={11} />
            <Bar w={90} h={11} />
          </div>
          <Bar w="90%" h={11} style={{ marginTop: 4 }} />
        </div>
        <div style={{ ...shimmer, width: 60, height: 28, borderRadius: 8, flexShrink: 0 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ ...shimmer, width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
          <Bar w="80%" h={13} />
          <Bar w="50%" h={11} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Bar w={70} h={11} />
        <Bar w={90} h={11} />
      </div>
      <div style={{ ...shimmer, width: "100%", height: 34, borderRadius: 8, marginTop: "auto" }} />
    </div>
  );
}
