import { DailyRecordResponse } from "@/types/api";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayCellProps = DailyRecordResponse & {
  isOutside?: boolean;
};

export function DayCell({
  recordDate,
  level,
  isOutside = false,
}: DayCellProps) {
  const LEVEL_CLASSES: Record<number, string> = {
    0: "bg-gray-100",
    1: "bg-gray-300",
    2: "bg-gray-400",
    3: "bg-gray-500",
    4: "bg-gray-600",
    5: "bg-gray-700",
  };

  const normalizedLevel = Math.min(level ?? 0, 5);
  const formattedDate = format(parseISO(recordDate), "yyyy-M-d", {
    locale: ja,
  });
  const recordLabel = normalizedLevel === 0 ? "" : `Level : ${normalizedLevel}`;

  return (
    <div className="group/day relative mx-auto">
      <div
        tabIndex={0}
        aria-label={`${formattedDate}、${recordLabel}`}
        className={`aspect-square w-4 cursor-default rounded-sm outline-none ring-primary-light transition duration-150 hover:scale-125 focus-visible:scale-125 focus-visible:ring-2 ${LEVEL_CLASSES[normalizedLevel]} ${isOutside ? "bg-white" : ""}`}
      />
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max -translate-x-1/2 translate-y-1 rounded-lg bg-ink-brown px-3 py-2 text-center text-[11px] leading-4 text-white opacity-0 shadow-lg transition group-hover/day:translate-y-0 group-hover/day:opacity-100 group-focus-within/day:translate-y-0 group-focus-within/day:opacity-100"
      >
        <span className="block font-semibold">{formattedDate}</span>
        <span className="text-white/70">{recordLabel}</span>
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink-brown" />
      </div>
    </div>
  );
}
