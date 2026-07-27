import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Advertise" };

export default function AdvertisePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-sm-primary dark:text-white">Advertise</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Reach travelers and local customers with sponsored locations, category placements, and tourism promotions on Smart Map.
      </p>
      <Link href="/business" className="mt-5 inline-block font-bold text-sm-primary">
        Open Business Platform →
      </Link>
    </div>
  );
}
