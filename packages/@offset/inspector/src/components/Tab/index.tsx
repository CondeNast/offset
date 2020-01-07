import * as React from "react";
import { FC } from "react";
import { Button } from "./styles";

export const Tab: FC<{
  children: string;
  value: string;
  onChange(tabName: string): void;
}> = props => {
  return (
    <Button
      onClick={() => props.onChange(props.children)}
      aria-selected={props.children === props.value}
    >
      {props.children}
    </Button>
  );
};
