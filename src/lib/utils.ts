import { clsx as mClsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(mClsx(inputs));
}
export const clsx = cn