// If VITE_API_URL is set use it, otherwise default to the production backend
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://pege-api.pegeback.org";

export const endpoints = {
  auth: {
    signature: `${BASE_URL}/api/auth/signature`,
  },

  x: {
    checkParticipation: `${BASE_URL}/api/x/check-participation`,
  },

  rewards: {
    snapshots: {
      list: `${BASE_URL}/api/rewards/snapshots/list`,
    },
    canCheckIn: `${BASE_URL}/api/rewards/can-check-in`,
    checkIn: `${BASE_URL}/api/rewards/check-in`,
    finalResult: `${BASE_URL}/api/rewards/final-result`,
  },

  common: {
    hasTweet: `${BASE_URL}/api/common/has-tweet`,
    projectInfo: `${BASE_URL}/api/common/project-info`,
  },
} as const;

export const axiosAuthConfig = {
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
};

export const { auth, x } = endpoints;
