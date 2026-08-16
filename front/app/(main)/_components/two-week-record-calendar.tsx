import { Label } from "@/components/ui/label";
import { addDays, format, startOfWeek, subWeeks } from "date-fns";

export type DailyRecord = {
  recordDate: string;
  count: number;
};

type TwoWeekRecordCalendarProps = {
  records: DailyRecord[];
};

type CalendarDay = {
  date: string;
  count: number | null;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function createWeek(startDate: Date, recordsByDate: Map<string, number>) {
  return Array.from({ length: 7 }, (_, index): CalendarDay => {
    const date = addDays(startDate, index);
    const formattedDate = format(date, "yyyy-MM-dd");

    return {
      date: formattedDate,
      count: recordsByDate.get(formattedDate) ?? null,
    };
  });
}

export function TwoWeekRecordCalendar({ records }: TwoWeekRecordCalendarProps) {
  const recordsByDate = new Map(
    records.map((record) => [record.recordDate, record.count]),
  );
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const previousWeekStart = subWeeks(currentWeekStart, 1);

  const weeks = [
    createWeek(previousWeekStart, recordsByDate),
    createWeek(currentWeekStart, recordsByDate),
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-x-2 gap-y-2">
        {WEEKDAYS.map((val, index) => (
          <p key={index} className="text-[10px] text-gray-500 text-center">
            {val}
          </p>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index}>
          <div className="grid grid-cols-7 gap-x-2 gap-y-2">
            {week.map((day) => (
              <DayCell key={day.date} date={day.date} count={day.count} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DayCell({ date, count }: CalendarDay) {
  const LEVEL_CLASSES: Record<number, string> = {
    0: "bg-gray-100",
    1: "bg-gray-300",
    2: "bg-gray-400",
    3: "bg-gray-500",
    4: "bg-gray-600",
    5: "bg-gray-700",
  };

  const level = Math.min(count ?? 0, 5);

  return (
    <div
      title={date}
      aria-label={date}
      className={`mx-auto w-3.5 aspect-square rounded-xs ${LEVEL_CLASSES[level]}`}
    ></div>
  );
}
