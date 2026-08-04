import Link from 'next/link';

export default function SideNav() {
  return (
    <aside className="w-60 px-2 py-3 bg-[#42585E] rounded-r-md text-[#eaedef]">
      <h1 className="text-2xl px-4 py-6">
        Habit
        <br />
        Tracker
      </h1>
      <nav className="my-3">
        <ul className="flex flex-col w-full gap-2">
          <li className="bg-[#53747B] rounded-md px-3 py-2">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:bg-[#53747B] rounded-md px-3 py-2">
            <Link href="/">Habits</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
