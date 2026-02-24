import Link from "next/link";
import { ProgressView } from "./ProgressView";

export default function ProgressPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md px-4 py-8">
        <Link
          href="/"
          className="text-overlay mb-6 inline-block text-sage-600 hover:text-black"
        >
          ← Back
        </Link>
        <header className="mb-8 text-center">
          <h1 className="text-overlay text-2xl font-semibold text-black">
            My progress
          </h1>
          <p className="text-overlay mt-2 text-sage-600">
            Duas you’ve marked as memorised
          </p>
        </header>
        <ProgressView />
      </div>
    </main>
  );
}
