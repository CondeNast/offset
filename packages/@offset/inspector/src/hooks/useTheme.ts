import { useEffect, useState, useMemo } from "react";

export const useTheme = () => {
  let dark = useMemo(() => {
    return window.matchMedia("(prefers-color-scheme: dark)");
  }, []);
  const [theme, setTheme] = useState<"light" | "dark">(
    dark.matches ? "dark" : "light"
  );

  useEffect(() => {
    let listener = () => setTheme(dark.matches ? "dark" : "light");
    dark.addEventListener("change", listener);
    return () => {
      dark.removeEventListener("change", listener);
    };
  }, []);

  return theme;
};
