import { useLayoutEffect, useState, RefObject } from "react";

function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

enum DocumentPosition {
  disconnected = 1,
  preceding = 2,
  following = 4,
  contains = 8,
  containedBy = 16,
  implementationSpecific = 32
}

export const useSelection = (ref: RefObject<HTMLDivElement>) => {
  let [cursors, setCursors] = useState<{ start: number; end: number }[]>([]);

  useLayoutEffect(() => {
    function selectionChanged() {
      let editor = ref.current;
      assert(
        editor,
        "The `useSelection` hook must be called from a component mounted inside of <Offset>"
      );
      let selection = document.getSelection();
      let ranges: Range[] = [];
      for (let i = 0, len = selection?.rangeCount || 0; i < len; i++) {
        assert(selection, "Expected selection.rangeCount to be zero.");

        // Before adding the range, check if it's inside of this editor instance
        let range = selection.getRangeAt(i);
        let startPosition = editor.compareDocumentPosition(
          range.startContainer
        );
        let endPosition = editor.compareDocumentPosition(range.endContainer);

        if (
          startPosition === DocumentPosition.contains ||
          startPosition === DocumentPosition.containedBy ||
          endPosition === DocumentPosition.contains ||
          endPosition === DocumentPosition.containedBy ||
          (startPosition === DocumentPosition.preceding &&
            endPosition === DocumentPosition.following)
        ) {
          ranges.push(range);
        }
      }
    }

    window.addEventListener("selectionchange", selectionChanged);

    return () => {
      window.removeEventListener("selectionchange", selectionChanged);
    };
  }, []);

  return cursors;
};
