import * as React from "react";
import { FC } from "react";

export const DeleteIcon: FC<{}> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        transform="translate(-132,-24)"
        d="m 139.5,33 h 9 L 147,43 h -6"
        fill="currentColor"
      />
      <path
        transform="translate(-132,-24)"
        d="m 147.5,30 h -2 v -1 h -3 v 1 h -2 c -0.55,0 -1,0.48 -1,1 v 1 h 1 7 1 v -1 c 0,-0.52 -0.45,-1 -1,-1"
        fill="currentColor"
      />
    </svg>
  );
};
