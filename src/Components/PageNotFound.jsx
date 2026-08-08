import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-8xl font-extrabold text-blue-700">404</h1>

      <h2 className="mt-4 text-3xl font-bold text-gray-800">
        Page Not Found
      </h2>

      <p className="mt-3 text-gray-600 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;