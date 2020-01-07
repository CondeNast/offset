import { DocumentContext } from "../components";
import { useContext } from "react";

export const useDocument = () => {
  return useContext(DocumentContext);
};
