import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex space-x-4 p-4 bg-gray-100 rounded">
      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Home
      </Link>
      <Link href="/zonedashboard" className="text-blue-600 hover:text-blue-800">
        Zone Dashboard
      </Link>
      <Link href="/zonesubdashboard" className="text-blue-600 hover:text-blue-800">
        Zone Sub Dashboard
      </Link>
    </nav>
  );
}
