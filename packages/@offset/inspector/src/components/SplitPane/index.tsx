import * as React from "react";
import {
  FC,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState
} from "react";
import styled from "styled-components";

const Styled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  grid-gap: 0;
`;

const LeftPane = styled.div`
  flex: 1;
`;

const RightPane = styled.div`
  position: relative;
  border-left: ${props => props.theme.splitPane.border};
`;

const SplitPaneHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -3px;
  width: 6px;
  background: rgba(0, 0, 0, 0);
  z-index: 2;
  cursor: ew-resize;
`;

export const SplitPane: FC<{
  children: [any, any];
}> = props => {
  let [width, setWidth] = useState(300);
  let [isResizing, setResizing] = useState(false);
  let startResizing = (evt: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    setResizing(true);
    evt.preventDefault();
    evt.stopPropagation();
  };
  let stopResizing = () => setResizing(false);
  let ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isResizing) return;

    let resize = (evt: MouseEvent) => {
      if (ref.current) {
        let width = ref.current.clientWidth;
        setWidth(Math.min(width - 300, Math.max(width - evt.clientX, 200)));
      }
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, ref]);

  return (
    <Styled ref={ref}>
      <LeftPane>{props.children[0]}</LeftPane>
      <RightPane style={{ width }}>
        <SplitPaneHandle onMouseDown={startResizing} />
        {props.children[1]}
      </RightPane>
    </Styled>
  );
};
