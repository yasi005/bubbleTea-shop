import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-14 text-center sm:px-6 sm:py-20">
      <h1 className="font-[family-name:var(--font-bubble)] text-2xl font-bold text-[#4a3f35] sm:text-3xl">
        Cup not found
      </h1>
      <p className="mt-2 text-sm text-[#6b5d4f] sm:mt-3 sm:text-base">
        That flavor seems to have wandered off.
      </p>
      <Link
        href="/menu"
        className="mt-6 inline-flex rounded-full bg-[#c4842f] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a86f25] sm:mt-8 sm:px-8 sm:py-3 sm:text-base"
      >
        Back to The Fridge
      </Link>
    </div>
  );
}
