import { HOLDING_DAYS } from '@libs/constants';
import { SnapshotUserInfoEntity } from '@libs/db';

export function getRewardCoeff(holdingDays: number): number {
  if (holdingDays >= HOLDING_DAYS['90_days']) return 3;
  if (holdingDays >= HOLDING_DAYS['30_days']) return 2.5;
  if (holdingDays >= HOLDING_DAYS['14_days']) return 2;
  if (holdingDays >= HOLDING_DAYS['7_days']) return 1.5;
  return 1;
}

export function getTotalPepeBalance(snapshot: SnapshotUserInfoEntity) {
  return snapshot.holdingDistribution.reduce((acc, curr) => {
    const parsed = JSON.parse(curr);
    return acc + parsed.amount;
  }, 0);
}
