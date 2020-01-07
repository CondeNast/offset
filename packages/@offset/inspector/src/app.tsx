import OffsetSource from "@atjson/offset-annotations";
import HTMLSource from "@atjson/source-html";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Inspector } from "./components/Inspector";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <Inspector
      document={HTMLSource.fromRaw(
        `
<p>Hello, world</p>
      `.trim()
      )
        .convertTo(OffsetSource)
        .canonical()}
    />
  </>,
  document.querySelector("#app")
);
