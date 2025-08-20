import { SECONDS_BETWEEN_CHECK_IN, TOTAL_CHECK_INS } from '@libs/constants';
import CONFIG from 'config';
import { differenceInSeconds } from 'date-fns';

export const getStageOfCheckIn = () => {
  const diffSeconds = differenceInSeconds(new Date(), CONFIG.PROJECT.START_DATE);
  const stage = Math.floor(diffSeconds / SECONDS_BETWEEN_CHECK_IN) + 1;
  return stage % TOTAL_CHECK_INS;
};

// TODO change to diff days
// export const getStageOfCheckIn = () => {
//   const diffDays = differenceInMinutes(new Date(), '2025-06-30T18:00:00.000Z');
//   const stage = Math.floor(diffDays / DAYS_BETWEEN_CHECK_IN) + 1;
//   return Math.min(stage, MAX_AMOUNT_CHECK_IN);
// };
