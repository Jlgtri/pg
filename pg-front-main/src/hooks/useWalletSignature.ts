import { useState } from "react";
import { useAccount } from "wagmi";
import Web3 from "web3";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const useWalletSignature = () => {
  const { address } = useAccount();

  const [signature, setSignature] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const requestSignature = async (dataObj: {
    timestamp: number;
    wallet: string;
  }): Promise<string> => {
    if (!window.ethereum) {
      const err = new Error("Wallet provider not found");
      setError(err);
      throw err;
    }

    if (!address) {
      const err = new Error("Wallet is not connected");
      setError(err);
      throw err;
    }

    setIsLoading(true);
    try {
      const preparedHashMessage = Object.entries(dataObj)
        .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
        .map(([key, val]) => `${key}_${val}`)
        .join("__");

      // Backend signs hashMessage(preparedMessage) and then hashes once more in recover,
      const msgHash = Web3.utils.sha3(
        `\x19Ethereum Signed Message:\n${preparedHashMessage.length}${preparedHashMessage}`
      ) as string;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const web3 = new Web3(window.ethereum as any);

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const sig: string = await web3.eth.personal.sign(msgHash, address, "");

      setSignature(sig);

      if (import.meta.env.DEV)
        console.debug("Signed message via web3.personal.sign", {
          address,
          sig,
        });

      return sig;
    } catch (err) {
      setError(err);
      throw err as Error;
    } finally {
      setIsLoading(false);
    }
  };

  return { requestSignature, signature, isLoading, error };
};
