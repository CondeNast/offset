import EventComponent from "./mixins/events";

/* const supports = {
  beforeinput: InputEvent.prototype.hasOwnProperty('inputType')
};
*/

interface DOMInputEventLvl2 extends InputEvent {
  dataTransfer: DataTransfer;
  inputType: string;
  getTargetRanges: () => Range[];
}

// n.b. this is duplicated from text-selection and should be refactored to be
// included from a shared base.
const TEXT_NODE_TYPE = 3;

function getTextNodes(node: Node): Text[] {
  let nodes: Text[] = [];

  if (node.hasChildNodes()) {
    node.childNodes.forEach((child: Node) => {
      nodes = nodes.concat(getTextNodes(child));
    });
  } else if (node.nodeType === TEXT_NODE_TYPE) {
    nodes.push(node as Text);
  }

  return nodes;
}

/**
 * The keyboard mixin normalizes keyboard input across browsers.
 * This is due to varying levels of support by browser vendors
 * of different Web APIs. The Input Events API provides a fairly
 * robust set of events that we can use to correctly detect input
 * from people fluent in CJK languages (Chinese, Japanese, and Korean).
 * These languages share a feature that _most_ input methods are
 * done through a series of characters.
 *
 * For example, in Japanese, the following sequence of roman
 * characters will result in the following set of text:
 *
 * | w | wa | wat | wata | watas | watash | watashi |
 * | w | わ | わt | わた | わたs | わたsh | 私      |
 *
 * This results in text that does not map 1:1 to the keys that
 * the person typed on their keyboard.
 *
 * This is the same series of events that we receive from
 * autocorrect and predictive text keyboards.
 *
 * Our approach here is to do the best we can to get the most
 * accurate set of events from the user's keyboard. We can only
 * promise accuracy to the level of what is provided by the
 * fidelity of the web API that's available for use in the browser.
 */
class TextInput extends EventComponent {
  static events = {
    beforeinput: "beforeinput",
    compositionend: "compositionend",
    "change text-selection": "setSelection",
    "clear text-selection": "clearSelection"
  };

  private selection?: { start: number; end: number; collapsed: boolean } | null;

  clearSelection() {
    this.selection = null;
  }

  setSelection(evt: CustomEvent) {
    this.selection = evt.detail;
  }

  compositionend(evt: CompositionEvent) {
    if (!this.selection) return;

    let { start, end } = this.selection;

    if (start === end) {
      this.dispatchEvent(
        new CustomEvent("insertText", {
          bubbles: true,
          detail: { position: start, text: evt.data }
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("replaceText", {
          bubbles: true,
          detail: { start, end, text: evt.data }
        })
      );
    }
  }

  beforeinput(evt: DOMInputEventLvl2) {
    if (evt.isComposing) return;

    let start: number;
    let end: number;
    let text: string;
    let target;

    if (this.selection) {
      start = this.selection.start;
      end = this.selection.end;
    } else {
      return;
    }

    switch (evt.inputType) {
      case "insertText":
        if (start === end) {
          this.dispatchEvent(
            new CustomEvent("insertText", {
              bubbles: true,
              detail: { position: start, text: evt.data }
            })
          );
        } else {
          this.dispatchEvent(
            new CustomEvent("replaceText", {
              bubbles: true,
              detail: { start, end, text: evt.data }
            })
          );
        }
        break;

      case "insertLineBreak":
        this.dispatchEvent(
          new CustomEvent("insertText", {
            bubbles: true,
            detail: { position: start, text: "\u2028" }
          })
        );
        this.dispatchEvent(
          new CustomEvent("addAnnotation", {
            bubbles: true,
            detail: { type: "line-break", start, end: end + 1 }
          })
        );
        break;

      case "insertFromPaste":
        text = evt.dataTransfer.getData("text/plain");

        if (start === end) {
          this.dispatchEvent(
            new CustomEvent("insertText", {
              bubbles: true,
              detail: { position: start, text }
            })
          );
        } else {
          this.dispatchEvent(
            new CustomEvent("replaceText", {
              bubbles: true,
              detail: { start, end, text }
            })
          );
        }
        break;

      case "insertFromDrop":
        text = evt.dataTransfer.getData("text/plain");

        target = evt.getTargetRanges()[0];
        start = this.nodeAndOffsetToDocumentOffset(
          target.startContainer,
          target.startOffset
        );

        this.dispatchEvent(
          new CustomEvent("insertText", {
            bubbles: true,
            detail: { position: start, text }
          })
        );

        break;

      case "deleteContentBackward":
        if (this.selection.collapsed) {
          start--;
        }
        this.dispatchEvent(
          new CustomEvent("deleteText", {
            bubbles: true,
            detail: { start, end }
          })
        );
        break;

      case "deleteWordBackward":
      case "deleteWordForward":
        if (
          evt.inputType === "deleteWordBackward" &&
          this.selection.collapsed
        ) {
          end++;
        }

        target = evt.getTargetRanges()[0];
        let deletionStart = this.nodeAndOffsetToDocumentOffset(
          target.startContainer,
          target.startOffset
        );
        let deletionEnd = this.nodeAndOffsetToDocumentOffset(
          target.endContainer,
          target.endOffset
        );

        this.dispatchEvent(
          new CustomEvent("deleteText", {
            bubbles: true,
            detail: { start: deletionStart, end: deletionEnd }
          })
        );
        break;

      case "deleteContentForward":
        if (this.selection.collapsed) {
          end++;
        }
        this.dispatchEvent(
          new CustomEvent("deleteText", {
            bubbles: true,
            detail: { start, end }
          })
        );
        break;

      case "deleteByCut":
      case "deleteContent":
      case "deleteByDrag":
        this.dispatchEvent(
          new CustomEvent("deleteText", {
            bubbles: true,
            detail: { start, end }
          })
        );
        break;

      case "insertReplacementText":
        // n.b. this assumes that there is only one target range.
        if (evt.getTargetRanges().length !== 1) {
          throw new Error(
            "Unhandled scenario. Breaking in an unelegant way. Expected exactly one target range in insertReplacementText handler, got " +
              evt.getTargetRanges().length
          );
        }

        target = evt.getTargetRanges()[0];
        let replaceStart = this.nodeAndOffsetToDocumentOffset(
          target.startContainer,
          target.startOffset
        );
        let replaceEnd = this.nodeAndOffsetToDocumentOffset(
          target.endContainer,
          target.endOffset
        );

        evt.dataTransfer.items[0].getAsString((replString: string) => {
          this.dispatchEvent(
            new CustomEvent("replaceText", {
              bubbles: true,
              detail: { start: replaceStart, end: replaceEnd, text: replString }
            })
          );
        });

        break;

      case "formatBold":
        this.dispatchEvent(
          new CustomEvent("addAnnotation", {
            bubbles: true,
            detail: { start, end, type: "bold" }
          })
        );
        break;

      case "formatItalic":
        this.dispatchEvent(
          new CustomEvent("addAnnotation", {
            bubbles: true,
            detail: { start, end, type: "italic" }
          })
        );
        break;

      case "formatUnderline":
        evt.preventDefault();
        break;

      case "insertParagraph":
        evt.preventDefault();
        this.dispatchEvent(
          new CustomEvent("insertText", {
            bubbles: true,
            detail: { position: start, text: "\n" }
          })
        );
        break;

      case "insertOrderedList":
      case "insertUnorderedList":
      case "insertHorizontalRule":
      case "insertFromYank":
      case "insertTranspose":
      case "insertCompositionText":
      case "insertFromComposition":
      case "insertLink":
      case "deleteByComposition":
      case "deleteCompositionText":
      case "deleteSoftLineBackward":
      case "deleteSoftLineForward":
      case "deleteEntireSoftLine":
      case "deleteHardLineBackward":
      case "deleteHardLineForward":
      case "deleteContentBackward":
      case "deleteContentForward":
      case "historyUndo":
      case "historyRedo":
      case "formatStrikeThrough":
      case "formatSuperscript":
      case "formatSubscript":
      case "formatJustifyFull":
      case "formatJustifyCenter":
      case "formatJustifyRight":
      case "formatJustifyLeft":
      case "formatIndent":
      case "formatOutdent":
      case "formatRemove":
      case "formatSetBlockTextDirection":
      case "formatSetInlineTextDirection":
      case "formatBackColor":
      case "formatFontColor":
      case "formatFontName":
        // console.debug('Unsupported Input Event: ', evt);
        break;

      default:
        // console.debug('Unknown Input Event: ', evt);
        break;
    }
  }

  // This could be better implemented by tagging each parent node (i.e.,
  // not-text node) with its start offset, so that we could go from text node +
  // offset to document offset directly. Not going to do it now to minimize
  // impact across the codebase, but flagging here as a potential and desirable
  // separate refactor.
  nodeAndOffsetToDocumentOffset(node: Node, offset: number): number {
    let textNodes = getTextNodes(this);

    let l = textNodes.length;
    let currOffset = 0;

    for (let i = 0; i < l; i++) {
      let currNode = textNodes[i];

      if (currNode === node) {
        return currOffset + offset;
      } else {
        currOffset += (currNode.nodeValue || "").length;
      }
    }

    // console.debug('No matching node', { node: node, textNodes: textNodes });
    throw new Error("Did not find a matching node. Was matching against");
  }
}

customElements.define("text-input", TextInput);

export default TextInput;
