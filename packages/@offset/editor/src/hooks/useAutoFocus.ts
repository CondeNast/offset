import { RefObject, useLayoutEffect } from "react";

export const useAutoFocus = (
  ref: RefObject<HTMLElement>,
  autoFocus: boolean
) => {
  useLayoutEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, []);
};
