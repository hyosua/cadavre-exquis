import React from "react";

interface LoaderProps {
  size?: number;        // px
  borderWidth?: number; // px
  colorClass?: string;  
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 56,
  borderWidth = 2,
  colorClass = "border-primary", 
  className = "",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border ${colorClass} border-t-transparent ${className}`}
      style={{ width: size, height: size, borderWidth }}
      aria-label="loading"
    />
  );
};

export default Loader;
