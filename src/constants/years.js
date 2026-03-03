// src/constants/years.js

const currentYear = new Date().getFullYear();

// Generate a list of 51 years (current year down to currentYear - 50)
export const years = Array.from({ length: 51 }, (_, i) => currentYear - i);

export const CURRENT_YEAR = currentYear;