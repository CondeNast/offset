import styled from "styled-components";

export const Styles = styled.span<{ "aria-hidden": boolean }>`
  position: absolute;
  background: #111;
  color: #fff;
  border-radius: 4px;
  padding: 6px 12px;
  font-weight: bold;
  user-select: none;
  z-index: 2;
  top: 14px;
  white-space: nowrap;
  opacity: ${props => (props["aria-hidden"] ? "0" : "1")};

  ::selection {
    background: transparent;
  }
`;
