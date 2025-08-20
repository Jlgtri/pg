import { useEffect, useRef, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseCountdownProps {
  targetDate: Date;
  onComplete?: () => void;
}

export const useCountdown = ({ targetDate, onComplete }: UseCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const hasStarted = useRef(false);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const timer: number = window.setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        // Вызываем onComplete только если таймер был активен ранее
        if (hasStarted.current && !hasCompleted.current && onComplete) {
          hasCompleted.current = true;
          onComplete();
        }

        clearInterval(timer);
        return;
      }

      // Отмечаем, что таймер начал отсчет
      hasStarted.current = true;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
      console.error("Invalid date provided to useCountdown hook");
      return;
    }

    // Initial calculation
    const difference = targetDate.getTime() - new Date().getTime();
    if (difference > 0) {
      hasStarted.current = true;
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return timeLeft;
};
