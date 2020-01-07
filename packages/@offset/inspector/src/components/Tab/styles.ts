import styled from "styled-components";

export const Button = styled.button.attrs({
  role: "tab"
})`
  padding: 0 12px;
  margin: 0;
  line-height: 0;
  background: inherit;
  border-radius: 0;
  height: 28px;
  appearance: none;
  border: 0;
  box-shadow: none;

  &:focus {
    outline: none;
  }

  &[aria-selected="true"] {
    background: ${props => props.theme.tab.active.background};
    color: ${props => props.theme.tab.active.color};
    box-shadow: ${props => props.theme.tab.active.boxShadow};
    border-bottom: ${props => props.theme.tab.active.border};
  }
  &[aria-selected="false"] {
    background: ${props => props.theme.tab.background};
    color: ${props => props.theme.tab.color};
    box-shadow: ${props => props.theme.tab.boxShadow};
    border-bottom: ${props => props.theme.tab.border};
  }
`;
