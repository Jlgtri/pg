import { useState, useEffect } from "react";

interface UseAppLoadingOptions {
  /** Minimum loading time in milliseconds */
  minLoadingTime?: number;
  /** Whether to wait for window load event */
  waitForWindowLoad?: boolean;
  /** Whether to wait for all images to load */
  waitForImages?: boolean;
}

export const useAppLoading = (options: UseAppLoadingOptions = {}) => {
  const {
    minLoadingTime = 1500,
    waitForWindowLoad = true,
    waitForImages = false,
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let hasMinTimePassed = false;
    let hasContentLoaded = false;

    // Set minimum loading time
    const minTimer = setTimeout(() => {
      hasMinTimePassed = true;
      setLoadingProgress((prev) => Math.max(prev, 50));
      checkIfShouldHideLoader();
    }, minLoadingTime);

    const checkIfShouldHideLoader = () => {
      if (hasMinTimePassed && hasContentLoaded) {
        setLoadingProgress(100);
        setTimeout(() => setIsLoading(false), 300); // Small delay for smooth transition
      }
    };

    const handleContentLoad = () => {
      hasContentLoaded = true;
      setLoadingProgress((prev) => Math.max(prev, 80));
      checkIfShouldHideLoader();
    };

    // Check if already loaded
    if (document.readyState === "complete") {
      handleContentLoad();
    } else if (waitForWindowLoad) {
      window.addEventListener("load", handleContentLoad);
    } else {
      // Just wait for DOM content to load
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", handleContentLoad);
      } else {
        handleContentLoad();
      }
    }

    // Optional: Wait for images
    if (waitForImages) {
      const images = document.querySelectorAll("img");
      let loadedImages = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        handleContentLoad();
      } else {
        images.forEach((img) => {
          if (img.complete) {
            loadedImages++;
          } else {
            img.addEventListener("load", () => {
              loadedImages++;
              setLoadingProgress((prev) =>
                Math.max(prev, (loadedImages / totalImages) * 70)
              );
              if (loadedImages === totalImages) {
                handleContentLoad();
              }
            });
            img.addEventListener("error", () => {
              loadedImages++;
              if (loadedImages === totalImages) {
                handleContentLoad();
              }
            });
          }
        });

        if (loadedImages === totalImages) {
          handleContentLoad();
        }
      }
    }

    return () => {
      clearTimeout(minTimer);
      window.removeEventListener("load", handleContentLoad);
      document.removeEventListener("DOMContentLoaded", handleContentLoad);
    };
  }, [minLoadingTime, waitForWindowLoad, waitForImages]);

  return { isLoading, loadingProgress };
};
