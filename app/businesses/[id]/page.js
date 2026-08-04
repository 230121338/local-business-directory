import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBadge from "@/components/CategoryBadge";
import RatingStars from "@/components/RatingStars";
import StatusBadge from "@/components/StatusBadge";
import ReviewsSection from "./ReviewsSection";
import {
  getAllBusinesses,
  getBusinessById,
  getCategoryById,
  getAverageRating,
  getApprovedReviewsForBusiness
} from "@/lib/data";
import { getOrderedHours, formatPhoneForTel, formatWhatsAppLink } from "@/lib/utils";

export function generateStaticParams() {
  return getAllBusinesses().map((business) => ({ id: business.id }));
}

export function generateMetadata({ params }) {
  const business = getBusinessById(params.id);
  if (!business) return {};
  return {
    title: business.name + " — LocalLink",
    description: business.shortDescription
  };
}

export default function BusinessDetailPage({ params }) {
  const business = getBusinessById(params.id);

  if (!business || business.status !== "approved") {
    notFound();
  }

  const category = getCategoryById(business.category);
  const rating = getAverageRating(business.id);
  const reviews = getApprovedReviewsForBusiness(business.id);
  const hours = getOrderedHours(business.hours);
  const photoAlt = "Photo representing " + business.name;
  const telHref = "tel:" + formatPhoneForTel(business.phone);
  const mailHref = "mailto:" + business.email;
  const whatsappMessage = "Hi " + business.name + ", I found you on LocalLink.";
  const whatsappHref = business.whatsapp ? formatWhatsAppLink(business.whatsapp, whatsappMessage) : "";

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/businesses" className="text-sm text-clay hover:text-clay-dark font-medium">← Back to all businesses</Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative h-64 sm:h-80 w-full rounded-stall overflow-hidden border-2 border-ink">
            <Image src={business.image} alt={photoAlt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />
            {business.featured && (
              <span className="absolute top-3 left-3 stamp-verified bg-marigold text-ink text-xs font-mono font-semibold uppercase tracking-wide px-2.5 py-1 rounded-stall border-2 border-ink">Featured listing</span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              {category && <CategoryBadge name={category.name} />}
              <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">{business.name}</h1>
              <p className="text-ink/60 mt-1">{business.area}, {business.province}</p>
            </div>
            <StatusBadge hours={business.hours} />
          </div>

          <div className="mt-3">
            <RatingStars rating={rating} reviewCount={reviews.length} size="lg" />
          </div>

          <p className="mt-6 text-ink/80 leading-relaxed">{business.description}</p>

          <div className="pin-divider mt-8 pt-6">
            <h2 className="font-display text-xl font-semibold mb-4">Operating hours</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-1.5 max-w-sm">
              {hours.map((day) => (
                <div key={day.key} className="flex items-center justify-between text-sm sm:max-w-xs">
                  <dt className="text-ink/60">{day.label}</dt>
                  <dd className="font-mono text-ink/80">{day.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ReviewsSection businessId={business.id} initialReviews={reviews} />
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white border-2 border-ink rounded-stall p-5 space-y-4">
            <h2 className="font-display text-lg font-semibold">Get in touch</h2>

            <a href={telHref} className="block w-full text-center px-4 py-2.5 bg-ink text-paper rounded-stall font-medium hover:bg-clay transition-colors">Call {business.phone}</a>

            {business.whatsapp && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-2.5 border-2 border-teal text-teal rounded-stall font-medium hover:bg-teal hover:text-paper transition-colors">Message on WhatsApp</a>
            )}

            <a href={mailHref} className="block w-full text-center px-4 py-2.5 border-2 border-ink/20 rounded-stall font-medium hover:border-ink transition-colors">Email business</a>

            {business.website && (
              <a href={business.website} target="_blank" rel="noopener noreferrer" className="block text-center text-sm text-clay hover:text-clay-dark">Visit website ↗</a>
            )}

            <div className="pin-divider pt-4 text-sm text-ink/70 space-y-1">
              <p className="font-medium text-ink">Address</p>
              <p>{business.address}</p>
              <p>{business.area}, {business.province}</p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
