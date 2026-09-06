import { DailyRecordResponse } from "@/types/api";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DayCell({ recordDate, level }: DailyRecordResponse, isOutside: boolean) {
  const LEVEL_CLASSES: Record<number, string> = {
    0: "bg-gray-100",
    1: "bg-gray-300",
    2: "bg-gray-400",
    3: "bg-gray-500",
    4: "bg-gray-600",
    5: "bg-gray-700",
  };

  return (
    <div
      title={recordDate}
      aria-label={recordDate}
      className={`mx-auto w-3.5 aspect-square rounded-xs ${LEVEL_CLASSES[Math.min(level ?? 0, 5)]} ${isOutside ? "bg-white" : ""}`}
    ></div>
  );
}
