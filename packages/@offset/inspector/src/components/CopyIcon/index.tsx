import * as React from "react";
import { FC } from "react";

export const CopyIcon: FC<{}> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fillRule="evenodd" transform="translateX(5)">
        <path
          fill="none"
          transform="matrix(0.87153,0,0,0.87153,4.071,4.568)"
          d="M 0,0 H 18 V 18 H 0 z"
        />
        <path
          fill="currentColor"
          transform="matrix(0.87153,0,0,0.87153,4.071,4.568)"
          d="M 12,3.5 A 1.505,1.505 0 0 0 10.494,2 H 4.506 C 3.676,2 3,2.674 3,3.506 v 7.988 C 3,12.326 3.671,12.997 4.5,13 V 3.5 H 12 z M 6,6.506 C 6,5.674 6.676,5 7.506,5 h 5.988 C 14.326,5 15,5.672 15,6.506 v 7.988 C 15,15.326 14.324,16 13.494,16 H 7.506 A 1.505,1.505 0 0 1 6,14.494 V 6.506 z M 7.5,6.5 h 6 v 8 h -6 v -8 z"
        />
      </g>
    </svg>
  );
};
