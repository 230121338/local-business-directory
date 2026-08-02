import SubmitForm from "./SubmitForm";
import { getCategories } from "@/lib/data";

export const metadata = {
  title: "List your business — LocalLink"
};

export default function SubmitPage() {
  const categories = getCategories();

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">
        List your business
      </p>
      <h1 className="font-display text-3xl font-semibold mb-2">
        Tell neighbours what you do
      </h1>
      <p className="text-ink/70 mb-8">
        Fill in the details below. An administrator reviews every submission
        before it appears in the directory, usually within a couple of days.
      </p>

      <SubmitForm categories={categories} />
    </section>
  );
}
