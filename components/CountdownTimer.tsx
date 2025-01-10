"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  date: string; // ISO string of the target date
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, className }) => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const difference = new Date(date).getTime() - new Date().getTime();

      return {
        total: difference,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        clearInterval(timer); // Stop the timer when countdown ends
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [date]);

  if (!mounted) {
    return null;
  }

  if (timeLeft.total <= 0) {
    return <span className={className}>Time's up!</span>;
  }

  return (
    <span className={cn("will-change-contents", className)}>
      {`${timeLeft.days ? timeLeft.days + "days " : ""}${
        timeLeft.hours < 10 ? "0" + timeLeft.hours : timeLeft.hours
      }:${timeLeft.minutes < 10 ? "0" + timeLeft.minutes : timeLeft.minutes}:${
        timeLeft.seconds < 10 ? "0" + timeLeft.seconds : timeLeft.seconds
      }`}
      {/* {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s */}
    </span>
  );
};

export default CountdownTimer;
