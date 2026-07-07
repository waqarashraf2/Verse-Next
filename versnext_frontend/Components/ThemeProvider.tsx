"use client";

import { ReactNode, useEffect } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = "blue";
    window.localStorage.setItem("versenext-theme", "blue");
  }, []);

  return <div data-current-theme="blue">{children}</div>;
}
