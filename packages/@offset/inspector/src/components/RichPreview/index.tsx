import * as React from "react";
import { FC } from "react";
import Document, { AttributesOf } from "@atjson/document";
import * as schema from "@atjson/offset-annotations";
import ReactRenderer, { ReactRendererProvider } from "@atjson/renderer-react";
import styled from "styled-components";

const Blockquote = styled.blockquote<AttributesOf<schema.Blockquote>>`
  float: ${props => (props.inset ? props.inset : "none")};
`;

const Bold = styled.strong<AttributesOf<schema.Bold>>`
  font-weight: bold;
`;

const Code = styled.strong<AttributesOf<schema.Code>>`
  display: ${props => (props.style === "inline" ? "inline" : "block")};
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Heading: FC<AttributesOf<schema.Heading>> = props => {
  const H = `h${props.level}`;

  return <H>{props.children}</H>;
};

const Img = styled.img`
  display: block;
  height: auto;
  min-width: 100%;
  max-width: 100%;
`;

const Image: FC<AttributesOf<schema.Image>> = props => {
  return <Img src={props.url} alt={props.description} />;
};

const Italic = styled.em<AttributesOf<schema.Italic>>`
  font-style: italic;
  font-weight: normal;
`;

const LineBreak = styled.br``;

const Link: FC<AttributesOf<schema.Link>> = props => {
  return (
    <a
      href={props.url}
      title={props.title}
      target={props.target}
      rel={props.rel}
    >
      {props.children}
    </a>
  );
};

const List: FC<AttributesOf<schema.List>> = props => {
  if (props.type === "numbered") {
    return <ol>{props.children}</ol>;
  } else {
    return <ul>{props.children}</ul>;
  }
};

const ListItem: FC<AttributesOf<schema.ListItem>> = props => {
  return <li>{props.children}</li>;
};

const Paragraph = styled.p<AttributesOf<schema.Paragraph>>``;

const Underline = styled.p<AttributesOf<schema.Underline>>`
  text-decoration: underline;
`;

const Story = styled.div`
  overflow-y: auto;

  article {
    margin: 0 auto;
    max-width: 700px;
    padding: 42px 21px;
    white-space: pre-wrap;
    line-height: 18px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 12px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    a {
      color: ${props => props.theme.link};
      text-decoration: none;
      border-bottom: 1.5px solid;
    }
  }
`;

export const RichPreview: FC<{ children: Document }> = props => {
  return (
    <Story>
      <ReactRendererProvider
        value={{
          Blockquote,
          Bold,
          Code,
          Heading,
          Image,
          Italic,
          LineBreak,
          Link,
          List,
          ListItem,
          Paragraph,
          Underline
        }}
      >
        <article>{ReactRenderer.render(props.children)}</article>
      </ReactRendererProvider>
    </Story>
  );
};
