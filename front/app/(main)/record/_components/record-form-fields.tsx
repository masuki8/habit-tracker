import { addDays, format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const DATE_FORMAT = "yyyy-MM-dd";
export const DEFAULT_LEVEL = 3;

const LEVELS = [1, 2, 3, 4, 5];

type RecordFormFieldsProps = {
  recordDate: string;
  minDate: string;
  maxDate: string;
  content: string;
  level: number;
  onRecordDateChange: (date: string) => void;
  onContentChange: (content: string) => void;
  onLevelChange: (level: number) => void;
};

export function RecordFormFields({
  recordDate, minDate, maxDate, content, level,
  onRecordDateChange, onContentChange, onLevelChange,
}: RecordFormFieldsProps) {
  return (
    <>
      <RecordDatePicker value={recordDate} min={minDate} max={maxDate} onChange={onRecordDateChange} />
      <LevelPicker value={level} onChange={onLevelChange} />
      <Textarea
        id="content"
        aria-label="記録内容"
        placeholder="今日の記録を書いてください"
        className="h-100"
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
      />
    </>
  );
}

function RecordDatePicker({ value, min, max, onChange }: {
  value: string; min: string; max: string; onChange: (date: string) => void;
}) {
  function updateDate(date: string) {
    if (date >= min && date <= max) onChange(date);
  }

  function moveDate(days: number) {
    updateDate(format(addDays(parseISO(value), days), DATE_FORMAT));
  }

  return (
    <div className="float-right flex items-center gap-1">
      <button type="button" aria-label="前の日" onClick={() => moveDate(-1)} disabled={value <= min} className="p-2">
        <ChevronLeft aria-hidden="true" />
      </button>
      <Input
        id="record-date"
        aria-label="記録日"
        className="w-fit appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        type="date"
        required
        value={value}
        min={min}
        max={max}
        onChange={(event) => updateDate(event.target.value)}
      />
      <button type="button" aria-label="次の日" onClick={() => moveDate(1)} disabled={value >= max} className="p-2">
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}

function LevelPicker({ value, onChange }: { value: number; onChange: (level: number) => void }) {
  return (
    <fieldset>
      <legend className="sr-only">達成レベル</legend>
      <div className="flex gap-2">
        {LEVELS.map((level) => (
          <label key={level} className="cursor-pointer rounded p-1">
            <input
              className="sr-only"
              type="radio"
              name="level"
              value={level}
              checked={value === level}
              onChange={() => onChange(level)}
            />
            <span className="sr-only">レベル{level}</span>
            <Flame
              className={level <= value ? "fill-orange-400 text-orange-400" : "text-gray-300"}
              aria-hidden="true"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
