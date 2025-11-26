export const getTomorrow = (): Date => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 86400000 в читаемом виде
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleString("ru-RU", { month: "long", year: "numeric" });
};

export const getPreviousMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

export const getNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};
