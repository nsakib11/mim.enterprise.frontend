// app/bank-branches/[id]/not-found.tsx
import Link from "next/link";

export default function BankBranchNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bank Branch Not Found</h1>
        <p className="text-gray-600 mb-8">
          The bank branch you're looking for doesn't exist or has been removed.
        </p>
        <div className="space-y-3">
          <Link
            href="/bank-branches"
            className="inline-block w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Bank Branches
          </Link>
          <Link
            href="/"
            className="inline-block w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}