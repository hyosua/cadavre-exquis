import React from "react";

interface LoaderProps {
  size?: number; // taille en pixels
  borderWidth?: number; 
  colorClass?: string; 
  className?: string; 
}

const Loader: React.FC<LoaderProps> = ({
  size = 48,
  borderWidth = 2,
  colorClass = "border-primary",
  className = "",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-b-${borderWidth} ${colorClass} mx-auto mb-4 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Loader;