import Document from "@atjson/document";
import ReactRenderer from "@atjson/renderer-react";
import * as React from "react";
import { FC, ComponentType, useRef, useEffect, useState } from "react";
import { useAutoFocus, useSelection } from "../../hooks";
import { DocumentContext } from "../DocumentContext";
import { SelectionContext } from "../SelectionContext";

export const Offset: FC<{
  autoFocus?: boolean;
  debug?: boolean;
  document: Document;
  components: {
    [key: string]: ComponentType;
  };
}> = props => {
  let editor = useRef<HTMLDivElement>(null);
  useAutoFocus(editor, !!props.autoFocus);
  let selection = useSelection(editor);

  let [contents, setContents] = useState(
    ReactRenderer.render(props.document, props.components)
  );

  useEffect(() => {
    props.document.addEventListener("change", () => {
      setContents(ReactRenderer.render(props.document, props.components));
    });
  }, [props.document, props.components]);

  return (
    <DocumentContext.Provider value={props.document}>
      <SelectionContext.Provider value={selection}>
        {props.children}
        <div contentEditable={true} ref={editor}>
          {contents}
        </div>
      </SelectionContext.Provider>
    </DocumentContext.Provider>
  );
};
