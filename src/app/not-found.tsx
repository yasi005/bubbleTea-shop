import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="font-[family-name:var(--font-quicksand)] text-3xl font-bold text-[#4a3f35]">
        Cup not found
      </h1>
      <p className="mt-3 text-[#6b5d4f]">
        That flavor seems to have wandered off.
      </p>
      <Link
        href="/menu"
        className="mt-8 inline-flex rounded-full bg-[#c4842f] px-8 py-3 font-semibold text-white transition hover:bg-[#a86f25]"
      >
        Back to menu
      </Link>
    </div>
  );
}
