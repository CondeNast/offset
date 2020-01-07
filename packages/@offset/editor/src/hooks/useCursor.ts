import { SelectionContext } from "../components";
import { useContext } from "react";

export const useCursor = () => {
  return useContext(SelectionContext)[0];
};
