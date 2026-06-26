export default function LoadingSpinner({ size = "md", label }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-indigo-200 border-t-indigo-600`}
        aria-hidden="true"
      />
      {label && <p className="text-sm font-medium text-slate-600">{label}</p>}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}
