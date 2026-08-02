export default function RatingStars({ rating, reviewCount, size = "sm" }) {
  const textSize = size === "lg" ? "text-lg" : "text-sm";

  if (rating === null || rating === undefined) {
    return (
      <span className={`font-mono text-ink/40 ${textSize}`}>
        No reviews yet
      </span>
    );
  }

  const fullStars = Math.round(rating);

  return (
    <span className={`inline-flex items-center gap-1.5 ${textSize}`}>
      <span className="text-marigold tracking-tighter" aria-hidden="true">
        {"★".repeat(fullStars)}
        <span className="text-ink/20">{"★".repeat(5 - fullStars)}</span>
      </span>
      <span className="font-mono text-ink/70">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && (
          <span className="text-ink/40"> ({reviewCount})</span>
        )}
      </span>
    </span>
  );
}
