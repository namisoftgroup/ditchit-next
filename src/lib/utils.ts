import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCookie(name: string) {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const last = parts.pop();
    if (last) return last.split(';').shift();
  }
  
  return undefined;
}