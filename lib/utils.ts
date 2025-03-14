import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(inputStr: string) {
  // Parse the input string into a Date object
  const date = new Date(inputStr);

  // Format the Date object into a more readable string without the weekday
  const options = {
    year: 'numeric', // Example: "2025"
    month: 'long', // Example: "January"
    day: 'numeric', // Example: "8"
    hour: '2-digit', // Example: "06"
    minute: '2-digit', // Example: "30"
    second: '2-digit', // Example: "00"
    hour12: true, // Use 12-hour format
  };

  const formattedDate = date.toLocaleString("en-US", options);
  return formattedDate.replace(' at', '');
  
}

