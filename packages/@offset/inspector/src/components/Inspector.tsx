import Document, { Annotation } from "@atjson/document";
import * as React from "react";
import { FC, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { AnnotationList } from "./AnnotationList";
import { Markup } from "./Markup";
import { SplitPane } from "./SplitPane";
import { Tab } from "./Tab";
import CommonmarkRenderer from "@atjson/renderer-commonmark";
import HTMLRenderer from "@atjson/renderer-html";
import { useTheme } from "../hooks/useTheme";
import { RichPreview } from "./RichPreview";
import { Tree } from "./Tree";

const dark = {
  color: "#A5A5A5",
  background: "#242424",
  keyword: "#35D5C8",
  link: "#5DB0D7",
  type: "#d0d0d0",
  value: "#BEC6CF",
  position: "#8F8F8F",
  document: {
    color: "#EFEFEF",
    background: "#242424"
  },
  tab: {
    color: "#A5A5A5",
    background: "#333333",
    border: "1px solid #3D3D3D",
    boxShadow: "none",
    active: {
      color: "#EAEAEA",
      background: "#000000",
      boxShadow: "none",
      border: "1px solid #3D3D3D"
    }
  },
  splitPane: {
    border: "1px solid #3D3D3D"
  },
  pane: {
    color: "#EFEFEF",
    background: "#242424",
    border: "1px solid #3D3D3D"
  }
};

const light = {
  color: "#111111",
  background: "#ffffff",
  keyword: "#d30200",
  link: "#1255CC",
  type: "#222222",
  value: "#303942",
  position: "#707070",
  document: {
    color: "#111111",
    background: "#f7f7f7"
  },
  tab: {
    color: "#5A5A5A",
    background: "#F3F3F3",
    border: "1px solid #CCCCCC",
    boxShadow: "none",
    active: {
      color: "#333333",
      background: "#F3F3F3",
      boxShadow: "inset 0px -1px 0 0px #1A73E8",
      border: "1px solid #1A73E8"
    }
  },
  splitPane: {
    border: "1px solid #CCCCCC"
  },
  pane: {
    color: "#111111",
    background: "#F3F3F3",
    border: "1px solid #CCCCCC"
  }
};

const themes = { dark, light };

let formats = {
  Markdown: CommonmarkRenderer,
  HTML: HTMLRenderer
};

const Header = styled.header`
  padding: 0;
  margin: 0;
  width: 100%;
  line-height: 28px;
  background: ${props => props.theme.tab.background};
  color: ${props => props.theme.tab.color};
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: subpixel-antialiased;
  z-index: 10;
  overflow-x: auto;
`;

const Toggle = styled.label`
  padding: 0 6px;
  margin: 0;
  line-height: 0;
  background: inherit;
  border-radius: 0;
  height: 28px;
  line-height: 28px;
  appearance: none;
  border: 0;
  border-bottom: ${props => props.theme.tab.border};
  box-shadow: none;
  font-size: 12px;
  white-space: nowrap;

  input {
    padding-right: 6px;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  background: ${props => props.theme.document.background};
  color: ${props => props.theme.document.color};
`;

const Styles = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  * {
    box-sizing: border-box;
  }
`;

const Spacer = styled.div`
  flex: 1;
  border-bottom: ${props => props.theme.tab.border};
`;

export const Inspector: FC<{
  children: Document;
  theme?: "light" | "dark";
}> = props => {
  let [tab, setTab] = useState("Text");
  let [showFormattingMarks, setShowFormattingMarks] = useState(false);
  let [showParseTokens, setShowParseTokens] = useState(false);
  let [annotation, setAnnotation] = useState<Annotation<any> | null>(null);
  let theme = useTheme();

  let annotations = props.children.all();

  return (
    <ThemeProvider theme={themes[props.theme || theme]}>
      <Styles>
        <SplitPane>
          <Container>
            <Header>
              <Tab value={tab} onChange={setTab}>
                Text
              </Tab>
              <Tab value={tab} onChange={setTab}>
                Markdown
              </Tab>
              <Tab value={tab} onChange={setTab}>
                HTML
              </Tab>
              <Tab value={tab} onChange={setTab}>
                Tree
              </Tab>
              <Tab value={tab} onChange={setTab}>
                Preview
              </Tab>
              <Toggle>
                <input
                  type="checkbox"
                  checked={showFormattingMarks}
                  onChange={evt => setShowFormattingMarks(evt.target.checked)}
                />
                Show Formatting Marks
              </Toggle>
              <Toggle>
                <input
                  type="checkbox"
                  checked={showParseTokens}
                  onChange={evt => setShowParseTokens(evt.target.checked)}
                />
                Show Parse Tokens
              </Toggle>
              <Spacer></Spacer>
            </Header>
            {tab === "Preview" ? (
              <RichPreview>{props.children}</RichPreview>
            ) : tab === "Tree" ? (
              <Tree
                showFormattingMarks={showFormattingMarks}
                showParseTokens={showParseTokens}
              >
                {props.children}
              </Tree>
            ) : (
              <Markup
                renderer={formats[tab as keyof typeof formats]}
                highlightedAnnotation={annotation}
                showFormattingMarks={showFormattingMarks}
                showParseTokens={showParseTokens}
              >
                {props.children}
              </Markup>
            )}
          </Container>
          <AnnotationList
            selectedAnnotation={annotation}
            onSelect={setAnnotation}
            onDelete={annotation => props.children.removeAnnotation(annotation)}
            annotations={
              showParseTokens
                ? annotations
                : annotations.where(a => a.type !== "parse-token")
            }
          />
        </SplitPane>
      </Styles>
    </ThemeProvider>
  );
};
