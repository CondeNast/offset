import * as React from "react";
import { FC, useRef, useState } from "react";
import styled from "styled-components";
import { Tooltip } from "../Tooltip";
import { build } from "@tce/rush";

const constraints = build(function() {
  return this.orientBelow
    .andSlideBetween(this.rightEdge, this.leftEdge)
    .then(this.orientAbove.andSlideBetween(this.rightEdge, this.leftEdge));
});

const Styles = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  margin: 0;
  padding: 0.2rem;
  color: currentColor;
  opacity: 0.8;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 1;
  }
`;

export const ActionMenuButton: FC<{
  children: {
    action: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    tooltip?: React.ReactChild;
    children: React.ReactChild;
  };
}> = props => {
  let ref = useRef<HTMLButtonElement>(null);
  let [isVisible, setVisible] = useState(false);

  return (
    <>
      <Styles
        ref={ref}
        onClick={props.children.action}
        onMouseOver={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {props.children.children}
      </Styles>
      {/*<Tooltip target={ref} constraints={constraints} visible={isVisible}>
        {props.children.tooltip}
  </Tooltip>*/}
    </>
  );
};
