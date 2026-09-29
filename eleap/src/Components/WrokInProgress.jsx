import { Construction } from "lucide-react";

export default function WorkInProgress({ title = "Work in Progress" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-xl">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <Construction
              size={40}
              className="text-yellow-600"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {title}
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Work in Progress
        </h2>

        <p className="text-gray-500 text-lg leading-relaxed">
          This page is currently under development.
          We are working to bring you new content and features.
          Please check back soon.
        </p>

        <div className="mt-8">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-yellow-500 rounded-full animate-pulse" />
          </div>

          <p className="text-sm text-gray-400 mt-3">
            Coming soon...
          </p>
        </div>

      </div>
    </div>
  );
}