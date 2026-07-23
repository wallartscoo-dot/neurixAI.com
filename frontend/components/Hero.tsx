export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center">

      {/* Logo */}
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 text-4xl text-white shadow-xl">
        ✨
      </div>

      {/* Heading */}
      <h1 className="text-6xl font-serif font-semibold text-gray-900">
        Hello, Night Owl
      </h1>

      {/* Subtitle */}
      <p className="mt-5 max-w-xl text-lg text-gray-500">
        Your intelligent AI assistant for writing, coding,
        research and creative ideas.
      </p>

    </div>
  );
}
