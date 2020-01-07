import * as React from "react";
import { FC, MutableRefObject, RefObject, useRef } from "react";
import { Constraint, solveFor, scrollParent, Rectangle } from "@tce/rush";
import { Styles } from "./styles";

export const Tooltip: FC<{
  target: MutableRefObject<HTMLElement> | RefObject<HTMLElement>;
  constraints: Constraint[];
  visible: boolean;
}> = props => {
  let ref = useRef<HTMLSpanElement>(null);
  let solution: ReturnType<typeof solveFor> | null = null;

  if (props.visible && props.target.current && ref.current) {
    let targetElement = props.target.current;
    let boundingElement = scrollParent(targetElement);
    let popoverElement = ref.current;
    solution = solveFor(
      props.constraints,
      Rectangle.fromDOMRect(boundingElement.getBoundingClientRect()),
      Rectangle.fromDOMRect(targetElement.getBoundingClientRect()),
      Rectangle.fromDOMRect(popoverElement.getBoundingClientRect())
    );
    solution.popoverRect.top += boundingElement.scrollTop;
  }

  return (
    <Styles
      ref={ref}
      role="tooltip"
      aria-hidden={!props.visible}
      style={
        solution
          ? {
              left: solution.popoverRect.left,
              top: solution.popoverRect.top
            }
          : {}
      }
    >
      {props.children}
    </Styles>
  );
};
