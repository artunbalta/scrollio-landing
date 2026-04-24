import HowItWorks from "@/components/HowItWorks";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <>
      <div className="sticky top-0 z-30 px-4 pt-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-black/10 bg-white/85 px-4 py-2 text-sm font-medium text-black/80 backdrop-blur transition hover:text-black"
        >
          ← Back
        </Link>
      </div>
      <HowItWorks />
    </>
  );
}
