import { createContext } from "react";
import Document from "@atjson/document";

export const DocumentContext = createContext<Document>(
  new Document({ content: "", annotations: [] })
);
