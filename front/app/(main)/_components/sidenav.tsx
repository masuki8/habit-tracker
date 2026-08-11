import Link from "next/link";

export default function SideNav() {
  return (
    <aside className="w-60 px-2 py-3 bg-primary rounded-r-md text-primary-text">
      <h1 className="px-4 py-6">
        Habit
        <br />
        Tracker
      </h1>
      <nav className="my-3">
        <ul className="flex flex-col w-full gap-2">
          <MenuItem name={'Home'} link={'/'} />
          <MenuItem name={'Habits'} link={'/'} />
        </ul>
      </nav>
    </aside>
  );
}


type MenuItemProps = {
  name: string;
  link: string;
};

function MenuItem({name, link}: MenuItemProps) {
  return (
    <li className="hover:bg-primary-hover rounded-md px-3 py-2">
      <Link href={link}>{name}</Link>
    </li>
  );
}
