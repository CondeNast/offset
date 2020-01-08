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
    <Inspector>
      {HTMLSource.fromRaw(
        `<p>One fish, <em>two</em> fish, red fish, <strong>blue</strong> fish</p>`
      ).convertTo(OffsetSource)}
    </Inspector>
  </>,
  document.querySelector("#app")
);
