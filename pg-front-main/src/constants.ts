// Environment variables with fallbacks to original values
const START_DATE_INPUT = import.meta.env.VITE_START_DATE_INPUT;

// Time between snapshots in seconds, default is 10 minutes (10 * 60), to set it to 6 days change it to 6 * 24 * 60 * 60
export const TIME_BETWEEN_SNAPSHOTS_SEC =
  import.meta.env.VITE_TIME_BETWEEN_SNAPSHOTS_DAYS > 0
    ? import.meta.env.VITE_TIME_BETWEEN_SNAPSHOTS_DAYS * 24 * 60 * 60
    : import.meta.env.VITE_TIME_BETWEEN_SNAPSHOTS_MINUTES * 60;

// Donation address
export const DONATION_ADDRESS = import.meta.env.VITE_DONATION_ADDRESS;

// TG link
export const TG_LINK = import.meta.env.VITE_TG_LINK;

// X.com link
export const X_LINK = import.meta.env.VITE_X_LINK;

// Links to another PEGE website for navigation
export const HOME_LINK = import.meta.env.VITE_HOME_LINK;
export const WHO_IS_PEGE_LINK = import.meta.env.VITE_WHO_IS_PEGE_LINK;
export const WHY_PEGE_LINK = import.meta.env.VITE_WHY_PEGE_LINK;
export const ROADMAP_LINK = import.meta.env.VITE_ROADMAP_LINK;
export const TOKENOMICS_LINK = import.meta.env.VITE_TOKENOMICS_LINK;

// --------------------------------------------------------------------- //

export const BONUS_ON_EACH_CHECK_IN: Record<number, number> = {
  1: 0,
  2: 777,
  3: 1_888,
  4: 3_888,
  5: 7_777,
};

export const TOTAL_SNAPSHOTS = 5;

export const PROJECT_START_DATE = Math.floor(Date.parse(START_DATE_INPUT) / 1000);
export const PROJECT_DONATION_CHECK_IN_AFTER = 1;
