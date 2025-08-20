export const COMMON_API_CACHE_KEY = 'API_CACHE';

export enum CacheTypes {
  RewardsSnapshotsTimes = 'rewards-snapshots-times',
  RewardsSnapshotsInfo = 'rewards-snapshots-info',
  RewardsFinalResult = 'rewards-final-result',
  RewardsNextResult = 'rewards-next-result',
  RewardsSnapshotsList = 'rewards-snapshots-list',
  ProjectInfo = 'project-info',
}

export const CACHE_TTL = {
  [CacheTypes.RewardsSnapshotsTimes]: 6 * 60 * 60,
  [CacheTypes.RewardsSnapshotsInfo]: 6 * 60 * 60,
  [CacheTypes.RewardsFinalResult]: 6 * 60 * 60,
  [CacheTypes.RewardsNextResult]: 6 * 60 * 60,
  [CacheTypes.RewardsSnapshotsList]: 6 * 60 * 60,
  [CacheTypes.ProjectInfo]: 6 * 60 * 60,
} as { [key in CacheTypes]: number };
