import * as React from "react";
import { ComponentProps, FC } from "react";

export const MoreIcon: FC<ComponentProps<"svg">> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        transform="matrix(1.4142,0,0,1.4142,-278.88,-36.772)"
        d="m 209.92,31.305 a 1.0607,1.0607 0 1 1 -2.1213,0 1.0607,1.0607 0 1 1 2.1213,0 z"
        fill="currentColor"
      />
      <path
        transform="matrix(1.4142,0,0,1.4142,-278.88,-31.772)"
        d="m 209.92,31.305 a 1.0607,1.0607 0 1 1 -2.1213,0 1.0607,1.0607 0 1 1 2.1213,0 z"
        fill="currentColor"
      />
      <path
        transform="matrix(1.4142,0,0,1.4142,-278.88,-26.772)"
        d="m 209.92,31.305 a 1.0607,1.0607 0 1 1 -2.1213,0 1.0607,1.0607 0 1 1 2.1213,0 z"
        fill="currentColor"
      />
    </svg>
  );
};
