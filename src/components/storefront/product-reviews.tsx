import type { Dictionary } from '@/lib/dictionaries';

export function ProductReviews({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-extrabold">{dict.product.reviewsTitle}</h2>
        <span className="text-[12.8px] font-semibold text-text-faint">
          {dict.product.reviewsSampleNote}
        </span>
      </div>
      {dict.product.reviews.map((r, i) => (
        <div
          key={i}
          className="flex flex-col gap-1 border-b border-[#f0f4f8] pb-4 last:border-b-0 last:pb-0"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold">{r.name}</span>
          </div>
          <span className="text-sm text-brand-red tracking-wide">
            {'★'.repeat(r.rating)}
            {'☆'.repeat(5 - r.rating)}
          </span>
          <span className="text-sm font-semibold leading-relaxed text-text-muted">{r.text}</span>
        </div>
      ))}
    </section>
  );
}
