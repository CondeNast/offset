import ReactRenderer, { ReactRendererProvider } from "@atjson/renderer-react";
import * as React from "react";
import { FC, useMemo, useEffect, useRef } from "react";
import FormattingSource from "./source";
import { Styles } from "./styles";
import styled from "styled-components";
import Document, { Annotation } from "@atjson/document";
import Renderer, { Context } from "@atjson/renderer-hir";

const WhiteSpace = styled.span`
  position: relative;

  &:before {
    content: "\\000b7";
    font-weight: bold;
    position: absolute;
    top: -1px;
    left: 0px;
    color: #999;
  }
`;

const CarriageReturn = styled.span`
  position: relative;

  &:before {
    content: "\\021b5";
    font-weight: bold;
    position: absolute;
    top: -3px;
    padding: 0 2px;
    color: #999;
  }
`;

const ParseTokenWrapper = styled.span`
  color: #999;
`;

const AnnotationMarker: FC<{ id: string }> = props => {
  return (
    <>
      <span className="annotation-marker-start" data-id={props.id}></span>
      {props.children}
      <span className="annotation-marker-end" data-id={props.id}></span>
    </>
  );
};

const ParseToken: FC<{ reason: string }> = props => {
  return (
    <ParseTokenWrapper className="parse-token">
      {props.children}
    </ParseTokenWrapper>
  );
};

export const Markup: FC<{
  children: Document;
  renderer?: {
    render(document: Document): string;
    new (document: Document): Renderer;
  };
  highlightedAnnotation: Annotation<any> | null;
  showFormattingMarks: boolean;
  showParseTokens: boolean;
}> = props => {
  let ref = useRef<HTMLPreformattedElement>(null);
  let renderer = useMemo(() => {
    if (props.renderer == null) return props.renderer;

    // Allows for doing a reverse lookup of annotations by
    // adding in literal markers into the text that we can then
    // extract back into annotations.
    //
    // This allows us to do some nice things like filter annotations
    // by highlighting the markup.
    class RendererWithHighlightedAnnotation extends props.renderer {
      *renderAnnotation(annotation: Annotation<any>, context: Context) {
        let result = yield* super.renderAnnotation(annotation, context);
        return `\uFFF9${annotation.id}\uFFFA${result}\uFFFA${annotation.id}\uFFFB`;
      }
    }
    return RendererWithHighlightedAnnotation;
  }, [props.renderer]);

  let content = useMemo(() => {
    if (renderer) {
      let markup = renderer.render(props.children);
      return (
        <ReactRendererProvider
          value={{ CarriageReturn, ParseToken, AnnotationMarker, WhiteSpace }}
        >
          {ReactRenderer.render(FormattingSource.fromRaw(markup))}
        </ReactRendererProvider>
      );
    } else {
      return (
        <ReactRendererProvider
          value={{ CarriageReturn, ParseToken, WhiteSpace }}
        >
          {ReactRenderer.render(
            FormattingSource.fromRaw(props.children.content, [
              ...props.children.where({ type: "-atjson-parse-token" })
            ])
          )}
        </ReactRendererProvider>
      );
    }
  }, [props.children, renderer]);

  useEffect(() => {
    if (props.highlightedAnnotation) {
      let range = document.createRange();
      if (props.renderer) {
        range.setStart(
          document.querySelector(
            `.annotation-marker-start[data-id="${props.highlightedAnnotation.id}"]`
          ),
          0
        );
        range.setEnd(
          document.querySelector(
            `.annotation-marker-end[data-id="${props.highlightedAnnotation.id}"]`
          ),
          0
        );
      } else {
        range.setStart(ref.current, props.highlightedAnnotation.start);
        range.setEnd(ref.current, props.highlightedAnnotation.end);
      }
      let selection = document.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [props.highlightedAnnotation]);

  return (
    <Styles
      showFormattingMarks={props.showFormattingMarks}
      showParseTokens={props.showParseTokens}
    >
      <pre ref={ref}>{content}</pre>
    </Styles>
  );
};
