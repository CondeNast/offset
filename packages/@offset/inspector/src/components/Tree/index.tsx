import * as React from "react";
import { FC } from "react";
import { HIR, HIRNode } from "@atjson/hir";
import Document from "@atjson/document";
import styled from "styled-components";

const Style = styled.div`
  overflow-y: auto;

  div {
    margin: 0 auto;
    max-width: 700px;
    padding: 42px 21px;
    white-space: pre-wrap;
    line-height: 18px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    font-size: 12px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  details details {
    padding-left: 1rem;
  }
`;

export const Node: FC<{
  children: HIRNode;
}> = props => {
  return (
    <>
      {props.children.type === "text" ? (
        props.children.text
      ) : (
        <details>
          <summary>{props.children.type}</summary>
          {props.children.children().map(child => (
            <Node>{child}</Node>
          ))}
        </details>
      )}
    </>
  );
};

export const Tree: FC<{
  children: Document;
}> = props => {
  return (
    <Style>
      <div>
        <Node>{new HIR(props.children).rootNode}</Node>
      </div>
    </Style>
  );
};
