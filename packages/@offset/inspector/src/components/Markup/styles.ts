import styled, { css } from "styled-components";

export const Styles = styled.div<{
  showFormattingMarks: boolean;
  showParseTokens: boolean;
}>`
  overflow-y: auto;

  pre {
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

  pre > span:before {
    opacity: ${props => (props.showFormattingMarks ? "1" : "0")};
  }

  ${props => {
    if (!props.showParseTokens) {
      return css`
        .parse-token {
          display: inline-flex;
          width: 0;
          height: 0;
          overflow: hidden;
        }
      `;
    }
    return "";
  }}
`;
