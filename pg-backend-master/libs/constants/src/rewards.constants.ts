export const HOLDING_DAYS = {
  '7_days': 7,
  '14_days': 14,
  '30_days': 30,
  '90_days': 90,
};

export const TOKENS_ON_EACH_CHECK_IN = {
  1: 0,
  2: 777,
  3: 1888,
  4: 3888,
  5: 7777,
};

export const MAX_AMOUNT_CHECK_IN = Math.max(
  ...Object.keys(TOKENS_ON_EACH_CHECK_IN).map((i) => +i),
);

export const TOTAL_CHECK_INS = 5;
export const SECONDS_BETWEEN_CHECK_IN = 2 * 60 * 60;

export const MIN_BALANCE_USD = 1;
