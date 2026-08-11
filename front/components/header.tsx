import { LogoutButton } from "./logout-button";

type HeaderProps = {
  showLogout?: boolean;
};

export default function Header({ showLogout = false }: HeaderProps) {
  return (
    <header className="w-full h-fit flex justify-between items-center align-middle px-6 py-3 border-b border-b-gray-400">
      <div>Habit Tracker</div>
      <div>
        <nav>
          <ul>
            {showLogout && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
