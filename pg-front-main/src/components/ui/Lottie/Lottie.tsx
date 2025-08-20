import styles from "./Lottie.module.scss";

import { memo, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

interface LottieOptions {
  rendererSettings?: {
    progressiveLoad?: boolean;
    clearCanvas?: boolean;
  };
  [key: string]: unknown;
}

interface LottieProps {
  lottieOptions?: LottieOptions;
  [key: string]: unknown; // Allow other lottie-react props to pass through
}

export const Lottie = memo((props: LottieProps) => {
  const [LottieComponent, setLottieComponent] = useState<ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<{ play: () => void; pause: () => void } | null>(
    null
  );

  // conditionally load the lottie component
  useEffect(() => {
    if (!isVisible) return;

    const loadLottie = async () => {
      const { default: Lottie } = await import("lottie-react");
      setLottieComponent(
        () => Lottie as ComponentType<Record<string, unknown>>
      );
    };
    loadLottie();

    // cleanup the component when it goes out of view
    return () => {
      setLottieComponent(null);
    };
  }, [isVisible]);

  //Pause animations when page is not visible for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (lottieRef.current) {
        if (document.hidden) {
          lottieRef.current.pause();
        } else {
          lottieRef.current.play();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const currentContainer = containerRef.current; // Capture the ref value

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);

        // Also pause/play based on intersection
        if (lottieRef.current) {
          if (entry.isIntersecting) {
            lottieRef.current.play();
          } else {
            lottieRef.current.pause();
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.01,
      rootMargin: "10px",
    });

    observer.observe(currentContainer);

    return () => {
      observer.unobserve(currentContainer); // Use the captured value
    };
  }, []);

  const defaultOptions = {
    rendererSettings: {
      progressiveLoad: true,
      clearCanvas: true,
    },
    ...props.lottieOptions,
  };

  return (
    <div ref={containerRef} className={styles.lottieWrapper}>
      {isVisible && LottieComponent && (
        <LottieComponent
          {...props}
          options={defaultOptions}
          lottieRef={lottieRef}
        />
      )}
    </div>
  );
});
