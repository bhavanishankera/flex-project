import { notFound } from "next/navigation";
import { loadHostawayReviews } from "@/lib/hostaway";
import { PropertyDetailPage } from "@/components/property/PropertyDetailPage";

type PropertyPageProps = {
  params: Promise<{ listingId: string }>;
};

const shouldUseMock = process.env.NEXT_PUBLIC_HOSTAWAY_USE_MOCK !== "false";

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { listingId } = await params;
  const data = await loadHostawayReviews({ useMock: shouldUseMock });
  const numericId = Number(listingId);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const listing = data.listings.find((item) => item.listingId === numericId);
  if (!listing) {
    notFound();
  }

  const listingReviews = data.reviews.filter((review) => review.listingId === numericId);

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 pb-16 pt-10">
      <PropertyDetailPage listing={listing} reviews={listingReviews} allListings={data.listings} />
    </main>
  );
}

