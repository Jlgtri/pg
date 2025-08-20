import React, { useState, useCallback, useEffect } from "react";
import type { User } from "@/api/types";
import type { UserContextType } from "@/context/UserContext";
import { initialUser, UserContext } from "@/context/UserContext";
import { useAccount } from "wagmi";
import { useAppState } from "@/context/AppStateContext";
import { useHasTweet } from "@/api/queries";

export const UserProvider: React.FC<{
  children: React.ReactNode;
  initial?: Partial<User>; // pass mockUser here
}> = ({ children, initial }) => {
  const [user, setUserState] = useState<User>({ ...initialUser, ...initial });

  // Sync wallet connection status with wagmi
  const { isConnected, address } = useAccount();
  const { setConnectionStatus, state, setUserInfo } = useAppState();

  // Check tweet status once per session — returns twitterAccountId on success
  const { mutateAsync: hasTweet } = useHasTweet();

  useEffect(() => {
    setUserState((prev) => ({ ...prev, walletConnected: isConnected }));

    if (isConnected) {
      if (state.connectionStatus === "not_connected") {
        setConnectionStatus("wallet_connected");
      }
    } else {
      if (state.connectionStatus !== "not_connected") {
        setConnectionStatus("not_connected");
      }
    }

    // Call /api/common/has-tweet after wallet auto-connect on page load
    if (
      isConnected &&
      address &&
      // !hasCheckedTweetRef.current &&
      address.length > 0
    ) {
      // hasCheckedTweetRef.current = true;
      hasTweet(address)
        .then(({ xUserName, hasTweet }) => {
          if (xUserName) {
            setUserInfo({ twitterAccountId: xUserName });
          }

          if (
            state.connectionStatus === "twitter_connected" ||
            state.connectionStatus === "wallet_connected"
          ) {
            if (hasTweet) {
              setConnectionStatus("post_checked");
            }
          }
        })
        .catch(() => {});
    }
  }, [
    isConnected,
    address,
    hasTweet,
    state.connectionStatus,
    setConnectionStatus,
    setUserInfo,
  ]);

  const setUser = useCallback(
    (updates: Partial<User>) =>
      setUserState((prev) => ({ ...prev, ...updates })),
    []
  );

  const resetUser = useCallback(() => setUserState(initialUser), []);

  const value: UserContextType = { user, setUser, resetUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
