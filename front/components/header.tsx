import { LogoutButton } from "./logout-button";

type HeaderProps = {
  showLogout?: boolean;
};

export default function Header({ showLogout = false }: HeaderProps) {
  return (
    <header className="w-full flex justify-between px-6 py-4 border-b border-b-gray-200">
      <div className="align-middle">Habit Tracker</div>
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
