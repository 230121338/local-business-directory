import Image from "next/image";
import Link from "next/link";
import CategoryBadge from "@/components/CategoryBadge";
import RatingStars from "@/components/RatingStars";
import StatusBadge from "@/components/StatusBadge";
import { getAverageRating, getApprovedReviewsForBusiness, getCategoryById } from "@/lib/data";

export default function BusinessCard({ business }) {
  const category = getCategoryById(business.category);
  const rating = getAverageRating(business.id);
  const reviewCount = getApprovedReviewsForBusiness(business.id).length;

  return (
    <Link
      href={`/businesses/${business.id}`}
      className="group block bg-white border-2 border-ink rounded-stall shadow-plaque hover:shadow-plaque-sm hover:-translate-x-0.5 hover:translate-y-0.5 transition-all"
    >
      <div className="relative h-40 w-full overflow-hidden border-b-2 border-ink">
        <Image
          src={business.image}
          alt={`Photo representing ${business.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {business.featured && (
          <span className="absolute top-2 left-2 stamp-verified bg-marigold text-ink text-xs font-mono font-semibold uppercase tracking-wide px-2 py-1 rounded-stall border-2 border-ink">
            Featured
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">
            {business.name}
          </h3>
          <StatusBadge hours={business.hours} />
        </div>

        {category && <CategoryBadge name={category.name} />}

        <p className="text-sm text-ink/70 leading-relaxed">
          {business.shortDescription}
        </p>

        <div className="pin-divider pt-2 flex items-center justify-between text-sm">
          <span className="text-ink/60">{business.area}</span>
          <RatingStars rating={rating} reviewCount={reviewCount} />
        </div>
      </div>
    </Link>
  );
}
