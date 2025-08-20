import { useEffect, useRef, useState } from "react";
import { useAppState } from "@/context/AppStateContext";

export const useAnimatedBalance = (
  setButtonPressed: (value: boolean) => void,
  buttonPressed: boolean
) => {
  const { state } = useAppState();

  const [showCoinFly, setShowCoinFly] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState<number>(0);
  const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);

  const currentBalance = state.balance ?? 0;

  // Keep track of previous balance each render
  const prevBalanceRef = useRef<number>(currentBalance);

  // Are we waiting for backend update after the user pressed the button?
  const [awaitingNewBalance, setAwaitingNewBalance] = useState(false);

  // When user presses the button, begin waiting for balance change
  useEffect(() => {
    if (buttonPressed) {
      setAwaitingNewBalance(true);
    }
  }, [buttonPressed]);

  // When balance changes and we are waiting, run animation
  useEffect(() => {
    if (!awaitingNewBalance) {
      prevBalanceRef.current = currentBalance;
      return;
    }

    if (currentBalance === prevBalanceRef.current) return; // not changed yet

    const startValue = prevBalanceRef.current;
    const endValue = currentBalance;

    const duration = 5000;
    const startTs = performance.now();
    setIsBalanceAnimating(true);
    setShowCoinFly(true);

    const step = (now: number) => {
      const progress = Math.min((now - startTs) / duration, 1);
      const value = startValue + (endValue - startValue) * progress;
      setAnimatedBalance(Number(value.toFixed(2)));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsBalanceAnimating(false);
      }
    };

    requestAnimationFrame(step);

    const timer = setTimeout(() => {
      setShowCoinFly(false);
      setAwaitingNewBalance(false);
      setButtonPressed(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [awaitingNewBalance, currentBalance, setButtonPressed]);

  return { showCoinFly, animatedBalance, isBalanceAnimating } as const;
};
