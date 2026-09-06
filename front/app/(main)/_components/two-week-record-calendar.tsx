import { addDays, format, startOfWeek, subWeeks } from "date-fns";

import type { DailyRecordResponse } from "@/types/api";
import { DayCell, WEEKDAYS } from "./day-cell";

type TwoWeekRecordCalendarProps = {
  records: DailyRecordResponse[];
};

function createWeek(startDate: Date, recordsByDate: Map<string, number>) {
  return Array.from({ length: 7 }, (_, index): DailyRecordResponse => {
    const date = addDays(startDate, index);
    const formattedDate = format(date, "yyyy-MM-dd");

    return {
      recordDate: formattedDate,
      level: recordsByDate.get(formattedDate) ?? 0,
    };
  });
}

export function TwoWeekRecordCalendar({ records }: TwoWeekRecordCalendarProps) {
  const recordsByDate = new Map(
    records.map((record) => [record.recordDate, record.level]),
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
              <DayCell key={day.recordDate} recordDate={day.recordDate} level={day.level} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
