import React, { useEffect, useState } from "react";

interface BeaconProps {
  value: number;
  threshold?: number;
}

export default function EntropyAlertBeacon({ value, threshold = 0.12 }: BeaconProps) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (value > threshold) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [value, threshold]);

  if (!showAlert) return null;

  return (
    <div className="text-red-600 text-sm font-bold animate-pulse mt-2">
      🔺 Entropy Spike Detected: {value.toFixed(3)}
    </div>
  );
}
