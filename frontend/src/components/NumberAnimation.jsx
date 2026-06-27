import { useEffect, useState, useRef } from "react";

export default function NumberAnimation({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const targetValue = typeof value === "number" ? value : 0;
    const prevValue = prevValueRef.current;
    
    if (targetValue === prevValue) return;
    
    setIsAnimating(true);
    const startTime = performance.now();
    const startValue = prevValue;
    const change = targetValue - startValue;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + change * easeOutQuart);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        prevValueRef.current = targetValue;
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={isAnimating ? "transition-all duration-75" : ""}>
      {displayValue}
    </span>
  );
}
