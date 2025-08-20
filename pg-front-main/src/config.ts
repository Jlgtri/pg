import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";

const publicRPCurls = [
  "https://eth.llamarpc.com",
  "https://rpc.payload.de",
  "https://eth.drpc.org",
  "https://ethereum-rpc.publicnode.com",
];

export const wagmiConfig = createConfig({
  chains: [
    {
      ...mainnet,
      iconBackground: "#000",
      iconUrl: "https://example.com/icons/ethereum.png",
    },
  ],
  transports: {
    [mainnet.id]: http(
      publicRPCurls[Math.floor(Math.random() * publicRPCurls.length)]
    ),
  },
});
