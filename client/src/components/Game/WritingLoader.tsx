import React from "react";

export const WritingLoader = () => (
  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
    <span className="font-medium">Écrit</span>
    <span className="flex gap-0.5">
      <span
        className="animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "1s" }}
      >
        .
      </span>
      <span
        className="animate-bounce"
        style={{ animationDelay: "200ms", animationDuration: "1s" }}
      >
        .
      </span>
      <span
        className="animate-bounce"
        style={{ animationDelay: "400ms", animationDuration: "1s" }}
      >
        .
      </span>
    </span>
  </div>
);
