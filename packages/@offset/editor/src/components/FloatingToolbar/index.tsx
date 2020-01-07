import * as React from "react";
import {
  build,
  Constraint,
  Rectangle,
  scrollParent,
  solveFor
} from "@tce/rush";
import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef
} from "react";

function getBoundingBox(element: HTMLElement | Element) {
  let styles = window.getComputedStyle(element);
  let rect = element.getBoundingClientRect();
  return new Rectangle(
    rect.left - parseInt(styles.marginLeft || "0", 10),
    rect.top - parseInt(styles.marginTop || "0", 10),
    rect.width +
      parseInt(styles.marginLeft || "0", 10) +
      parseInt(styles.marginRight || "0", 10),
    rect.height +
      parseInt(styles.marginTop || "0", 10) +
      parseInt(styles.marginBottom || "0", 10)
  );
}

export const FloatingToolbar: FC<{
  constraints?: Constraint[];
}> = props => {
  let [rect, setRect] = useState<DOMRect | ClientRect | null>(null);
  let [position, setPosition] = useState<ReturnType<typeof solveFor> | null>(
    null
  );
  let ref = useRef<HTMLDivElement>(null);
  let constraints = useMemo(() => {
    return (
      props.constraints ||
      build(function() {
        return this.orientAbove
          .then(
            this.orientAbove
              .andSlideBetween(this.center, this.rightEdge)
              .andSlideBetween(this.center, this.leftEdge)
          )
          .then(
            this.orientBelow.andSlideBetween(
              this.center,
              this.leftEdge,
              this.rightEdge
            )
          );
      })
    );
  }, [props.constraints]);

  useEffect(() => {
    let change = () => {
      let selection = document.getSelection();
      if (selection) {
        setRect(selection.getRangeAt(0).getBoundingClientRect());
      }
    };
    document.addEventListener("selectionchange", change);

    return () => {
      document.removeEventListener("selectionchange", change);
    };
  }, []);

  useLayoutEffect(() => {
    if (ref.current && rect) {
      let toolbarRect = ref.current.getClientRects()[0];
      let boundingBox = getBoundingBox(scrollParent(ref.current));
      let position = solveFor(constraints, boundingBox, rect, toolbarRect);
      setPosition(position);
    } else {
      setPosition(null);
    }
  }, [constraints, props.children, rect]);

  return (
    <div
      ref={ref}
      style={
        position
          ? {
              position: "absolute" as const,
              display: "inline-block" as const,
              left: position.popoverRect.left,
              top: position.popoverRect.top
            }
          : {
              position: "absolute" as const,
              visibility: "hidden" as const
            }
      }
    >
      {props.children}
    </div>
  );
};
