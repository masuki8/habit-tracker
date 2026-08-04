import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex justify-between px-6 py-4 border-b border-b-gray-200">
      <div>Habit Tracker</div>
      <div>
        <nav>
          <ul>
            <li>
              <Link href="/logout">
                logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
