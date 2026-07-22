export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6">
      <h1 className="text-2xl font-bold">Neurix AI</h1>

      <button className="px-5 py-2 rounded-xl border hover:bg-gray-100 transition">
        Login
      </button>
    </nav>
  );
}
