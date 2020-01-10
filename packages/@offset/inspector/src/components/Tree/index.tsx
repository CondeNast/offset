import * as React from "react";
import { FC } from "react";
import { HIR, HIRNode } from "@atjson/hir";
import Document, { Annotation } from "@atjson/document";
import styled from "styled-components";
import FormattingSource from "../Markup/source";
import ReactRenderer from "@atjson/renderer-react";

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

const Style = styled.div`
  overflow-y: auto;

  div {
    white-space: pre-wrap;
    line-height: 20px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    font-size: 12px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &:hover {
      background: ${props => props.theme.tab.active.background};
    }

    &[aria-selected="true"] {
      background: #1a73e8;
    }
  }
`;

export const Node: FC<{
  children: HIRNode;
  depth: number;
  showFormattingMarks: boolean;
  highlightedAnnotation: Annotation<any> | null;
}> = props => {
  return (
    <div
      aria-selected={props.highlightedAnnotation?.id === props.children.id}
      style={{
        paddingLeft: `${props.depth + 0.5}rem`
      }}
    >
      {props.children.type === "text"
        ? props.showFormattingMarks
          ? ReactRenderer.render(
              FormattingSource.fromRaw(props.children.text),
              {
                WhiteSpace,
                CarriageReturn
              }
            )
          : props.children.text
        : props.children.type}
    </div>
  );
};

function hirToList(node: HIRNode, includeParseTokens: boolean, depth = 0) {
  let result = [{ node, depth }];
  node.children({ includeParseTokens }).map(child => {
    result.push(...hirToList(child, includeParseTokens, depth + 1));
  });
  return result;
}

export const Tree: FC<{
  children: Document;
  showParseTokens: boolean;
  showFormattingMarks: boolean;
  highlightedAnnotation: Annotation<any> | null;
}> = props => {
  let children = hirToList(
    new HIR(props.children).rootNode,
    props.showParseTokens
  );
  return (
    <Style>
      {children.map(({ node, depth }) => (
        <Node
          depth={depth}
          highlightedAnnotation={props.highlightedAnnotation}
          showFormattingMarks={props.showFormattingMarks}
        >
          {node}
        </Node>
      ))}
    </Style>
  );
};
