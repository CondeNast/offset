import { createContext } from "react";

export const SelectionContext = createContext<{ start: number; end: number }[]>(
  []
);
