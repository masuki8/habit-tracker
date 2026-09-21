import { NavigationLinks } from "@/components/navigation-links";
import type { HabitResponse } from "@/types/api";

export default function SideNav({ habits }: { habits: HabitResponse[] }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-primary px-3 py-5 text-primary-text lg:flex">
      <div className="px-3 py-5">
        <p className="brand-mark text-3xl text-primary-text">Habit Tracker</p>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-primary-text/55">
          Habit journal
        </p>
      </div>

      <div className="mt-5 min-h-0 flex-1">
        <NavigationLinks habits={habits} />
      </div>

      <div className="mt-5 rounded-2xl bg-black/10 p-4">
        <p className="text-xs font-semibold">Keep going!</p>
      </div>
    </aside>
  );
}
