export function ProductImagePlaceholder({
  className = '',
  label = 'No image yet',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`grid place-items-center bg-[repeating-linear-gradient(135deg,#f2f5f9_0_10px,#e9eef5_10px_20px)] ${className}`}
    >
      <span className="text-[12.8px] font-mono text-text-faint px-4 text-center">{label}</span>
    </div>
  );
}
