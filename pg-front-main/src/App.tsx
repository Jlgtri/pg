import { Home } from "./components/pages/Home";
import { Header } from "./components/ui/Header";
import { Footer } from "./components/ui/Footer";
import { ModalProvider } from "./providers/ModalProvider";
import { useDisconnect } from "wagmi";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";
import { Preloader } from "./components/ui/Preloader/Preloader";
import { useAppLoading } from "./hooks/useAppLoading";
import { AppStateProvider } from "./providers/AppStateProvider";
import { UserProvider } from "./providers/UserProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { useEffect } from "react";
import { ProjectProvider } from "./providers/ProjectProvider";

function App() {
  const { isLoading } = useAppLoading({
    minLoadingTime: 1500, // Show preloader for at least 1.5 seconds
    waitForWindowLoad: true, // Wait for all resources to load
    waitForImages: false, // Set to true if you want to wait for all images
  });
  const { disconnect } = useDisconnect();

  // Disconnect wallet when the user closes or reloads the page
  useEffect(() => {
    const handlePageUnload = () => {
      disconnect();
    };

    window.addEventListener("beforeunload", handlePageUnload);
    window.addEventListener("pagehide", handlePageUnload);

    return () => {
      window.removeEventListener("beforeunload", handlePageUnload);
      window.removeEventListener("pagehide", handlePageUnload);
    };
  }, [disconnect]);

  useEffect(() => {

    const handleAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        console.log("Auth code received:", code);
      }
    };
    window.addEventListener("message", handleAuth);
    return () => window.removeEventListener("message", handleAuth);
  }, []);

  return (
    <>
      <RainbowKitProvider
        initialChain={mainnet}
        modalSize="compact"
        theme={midnightTheme({
          accentColor: "#5D3D9A",
          accentColorForeground: "#071949",
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "large",
        })}
      >
        <AppStateProvider>
          <ProjectProvider>
            <UserProvider>
              <ToastProvider>
                <ModalProvider>
                  <Preloader isVisible={isLoading} />
                  <Header />
                  <Home />
                  <Footer />
                </ModalProvider>
              </ToastProvider>
            </UserProvider>
          </ProjectProvider>
        </AppStateProvider>
      </RainbowKitProvider>
    </>
  );
}

export default App;
