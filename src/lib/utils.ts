import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string) {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    return undefined;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const last = parts.pop();
    if (last) return last.split(";").shift();
  }

  return undefined;
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof window === "undefined") return;
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  } catch {
    // swallow any cookie write errors in environments with restricted cookie access
    // calling code should not crash because of this
  }
}
