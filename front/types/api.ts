export type HabitResponse = {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  recordsCount: number;
  twoWeekRecords: DailyRecordResponse[];
  createdAt: string;
};

export type RecordResponse = {
  id: number;
  habitId: number;
  content: string | null;
  imageUrl: string | null;
  recordDate: string;
  level: number | null;
};

export type DailyRecordResponse = {
  recordDate: string;
  level: number;
};

export type MonthlyRecordsResponse = {
  month: string;
  records: DailyRecordResponse[];
};

export type TemplateResponse = {
  id: number;
  habitId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type UserResponse = {
  id: number;
  accountId: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type AccountIdAvailabilityResponse = {
  available: boolean;
};
