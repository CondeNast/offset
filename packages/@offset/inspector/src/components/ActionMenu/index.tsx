import * as React from "react";
import { FC, useState } from "react";
import styled from "styled-components";
import { MoreIcon } from "../MoreIcon";
import { ActionMenuButton } from "../ActionMenuButton";

const Styles = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0 0.25rem;

  button {
    appearance: none;
    background: transparent;
    border: 0;
    margin: 0;
    padding: 0.2rem;
    color: currentColor;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export const ActionMenu: FC<{
  children: Array<{
    action: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    tooltip?: React.ReactChild;
    children: React.ReactChild;
  }>;
}> = props => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Styles className="action-menu" onMouseLeave={() => setExpanded(false)}>
      {isExpanded ? (
        props.children.map((action, index) => (
          <ActionMenuButton key={index}>{action}</ActionMenuButton>
        ))
      ) : (
        <button>
          <MoreIcon onMouseOver={() => setExpanded(true)} />
        </button>
      )}
    </Styles>
  );
};
