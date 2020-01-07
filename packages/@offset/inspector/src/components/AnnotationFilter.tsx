import * as React from "react";
import { FC } from "react";

export const AnnotationFilter: FC<{
  value: string;
  onChange(query: string): void;
}> = props => {
  return (
    <input
      type="text"
      value={props.value}
      onChange={evt => props.onChange(evt.target.value)}
    />
  );
};
