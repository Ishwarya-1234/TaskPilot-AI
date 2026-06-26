export default function SkeletonLoader({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
