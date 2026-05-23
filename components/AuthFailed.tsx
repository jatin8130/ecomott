"use client";

const AuthFailed = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-red-500 opacity-20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-pink-500 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center text-5xl text-red-400 mb-6">
          ⚠️
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>

        {/* Message */}
        <p className="text-gray-300 leading-relaxed mb-8">
          Authentication was unsuccessful. Your session may have expired or
          permission was denied.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-lg transition duration-300"
          >
            Retry Login
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-lg transition duration-300"
          >
            Go Back
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-8">AUTH ERROR 401</p>
      </div>
    </div>
  );
};

export default AuthFailed;
