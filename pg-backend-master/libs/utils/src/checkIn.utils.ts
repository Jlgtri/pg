import { SECONDS_BETWEEN_CHECK_IN, TOTAL_CHECK_INS } from '@libs/constants';
import CONFIG from 'config';

export const getStageOfCheckIn = () => {
  const diffSeconds = (Date.now() - Date.parse(CONFIG.PROJECT.START_DATE)) / 1000;
  const stage = Math.floor(diffSeconds / SECONDS_BETWEEN_CHECK_IN);
  return (stage % TOTAL_CHECK_INS) + 1;
};

export const getLastProjectStartDate = () => {
  const diffSeconds = (Date.now() - Date.parse(CONFIG.PROJECT.START_DATE)) / 1000;
  const rounds = Math.floor(diffSeconds / (TOTAL_CHECK_INS * SECONDS_BETWEEN_CHECK_IN));
  return Date.parse(CONFIG.PROJECT.START_DATE) / 1000 + (TOTAL_CHECK_INS * SECONDS_BETWEEN_CHECK_IN) * rounds;
};

// TODO change to diff days
// export const getStageOfCheckIn = () => {
//   const diffDays = differenceInMinutes(new Date(), '2025-06-30T18:00:00.000Z');
//   const stage = Math.floor(diffDays / DAYS_BETWEEN_CHECK_IN) + 1;
//   return Math.min(stage, MAX_AMOUNT_CHECK_IN);
// };
