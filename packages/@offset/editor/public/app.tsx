import { AttributesOf } from "@atjson/document";
import OffsetSource, { Link } from "@atjson/offset-annotations";
import * as React from "react";
import { FC } from "react";
import * as ReactDOM from "react-dom";
import { Offset, FloatingToolbar } from "../src/components";

const Bold: FC<{}> = props => <strong>{props.children}</strong>;
const LinkComponent: FC<AttributesOf<Link>> = props => (
  <a href={props.url}>{props.children}</a>
);

ReactDOM.render(
  <div>
    <Offset
      autoFocus={true}
      components={{
        Bold,
        Link: LinkComponent
      }}
      document={
        new OffsetSource({
          content: "Hello, world",
          annotations: [
            {
              type: "-offset-bold",
              start: 7,
              end: 12,
              attributes: {}
            },
            {
              type: "-offset-link",
              start: 7,
              end: 12,
              attributes: {
                "-offset-url": "https://condenast.com"
              }
            },
            {
              type: "-atjson-parse-token",
              start: 12,
              end: 13,
              attributes: {}
            }
          ]
        })
      }
    >
      <FloatingToolbar>
        <button>Bold</button>
        <button>Italic</button>
        <button>Link</button>
      </FloatingToolbar>
    </Offset>
    <Offset
      debug={true}
      components={{
        Bold,
        Link: LinkComponent
      }}
      document={
        new OffsetSource({
          content: "This is a second one",
          annotations: [
            {
              type: "-offset-link",
              start: 0,
              end: 4,
              attributes: {
                "-offset-url": "https://atjson.condenast.io"
              }
            }
          ]
        })
      }
    />
  </div>,
  document.querySelector("#app")
);
