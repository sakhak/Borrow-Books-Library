export default function LoadingComponent() {
  return (
    <div className=" absolute inset-0 bg-black/70 flex items-center justify-center min-h-screen ">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* Loading text */}
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}
