import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";
import { auth as authEndpoints, axiosAuthConfig } from "../endpoints";

interface SignaturePayload {
  signature: string;
  xUserName: string;
  data: {
    timestamp: number;
    wallet: string;
  };
}

// POST /api/auth/signature
const postSignature = async (payload: SignaturePayload): Promise<void> => {
  await apiClient.post(authEndpoints.signature, payload, axiosAuthConfig);
};

export const useSendSignature = () => {
  return useMutation({ mutationFn: postSignature });
};
