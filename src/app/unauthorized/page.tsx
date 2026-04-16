export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 text-sm">
          You do not have permission to access this resource.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
