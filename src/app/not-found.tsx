import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[500px] h-full flex flex-col items-center justify-center px-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <h1 className="text-9xl mb-5 font-extrabold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-lg">
        404
      </h1>

      {/* Message */}
      <div className="rounded-xl w-full text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Looks like you&apos;ve wandered off the map. This page doesn&apos;t exist or has been moved.
        </p>

        {/* Go Back Home Button */}
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
