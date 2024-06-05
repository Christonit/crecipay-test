import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDate = (
  timestamp: string,
  formatDate = "MMM d, yyyy h:mm a"
) => {
  const date = new Date(timestamp);
  const formattedDate = format(date, formatDate);
  return formattedDate;
};
