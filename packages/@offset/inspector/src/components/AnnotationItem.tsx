import { Annotation } from "@atjson/document";
import * as React from "react";
import { FC } from "react";
import styled from "styled-components";
import { ActionMenu } from "./ActionMenu";
import { CopyIcon } from "./CopyIcon";
import { DeleteIcon } from "./DeleteIcon";
import { LogIcon } from "./LogIcon";

const Item = styled.li`
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 12px;
  position: relative;
  border-bottom: ${props => props.theme.pane.border};
  font-size: 12px;
  line-height: 18px;
  padding: 12px 6px;
  max-width: 100%;
  white-space: pre-wrap;

  .action-menu {
    transition: all 120ms;
    opacity: 0;
  }

  &:hover .action-menu {
    opacity: 1;
  }
`;

const Attribute = styled.span`
  display: block;
  margin-left: 1rem;
`;

const Brace = styled.span`
  color: #8a8a8a;
`;

const Type = styled.span`
  color: ${props => props.theme.type};
`;

const Key = styled.span`
  color: ${props => props.theme.keyword};
`;

const Value = styled.span`
  color: ${props => props.theme.value};
  word-wrap: break-all;
  overflow-wrap: break-word;
`;

const Position = styled.span`
  position: absolute;
  text-decoration: underline;
  cursor: pointer;
  color: ${props => props.theme.position};
  right: 0.25rem;
  top: 1rem;
  line-height: 1;
`;

const AnnotationAttribute: FC<{ name: string; value: any }> = props => {
  if (typeof props.value === "object") {
    return (
      <Attribute>
        <Key>{props.name}</Key>: <Brace>{"{"}</Brace>
        <Value>
          {Object.entries(props.value).map(([key, value], index) => (
            <AnnotationAttribute key={index} name={key} value={value} />
          ))}
        </Value>
        <Brace>{"}"}</Brace>
      </Attribute>
    );
  }
  return (
    <Attribute>
      <Key>{props.name}</Key>: <Value>{props.value}</Value>
    </Attribute>
  );
};

export const AnnotationItem: FC<{
  annotation: Annotation<any>;
  selected: boolean;
  onSelect: () => {};
  onDelete: () => {};
}> = props => {
  return (
    <Item>
      <Type>{props.annotation.type}</Type> <Brace>{"{"}</Brace>
      <br />
      {Object.entries(props.annotation.attributes).map(
        ([key, value], index) => {
          return <AnnotationAttribute key={index} name={key} value={value} />;
        }
      )}
      <Brace>{"}"}</Brace>
      <Position onClick={props.onSelect}>
        [{props.annotation.start}, {props.annotation.end}]
      </Position>
      <ActionMenu>
        {[
          {
            action: props.onDelete,
            children: <DeleteIcon />,
            tooltip: "Delete annotation"
          },
          {
            action() {
              console.log(props.annotation);
            },
            children: <LogIcon />,
            tooltip: "Log to Console"
          },
          {
            action(evt) {
              let scratchpad = document.createElement("textarea");
              scratchpad.value = JSON.stringify(
                props.annotation.toJSON(),
                null,
                2
              );
              document.body.appendChild(scratchpad);
              scratchpad.select();
              document.execCommand("copy");
              document.body.removeChild(scratchpad);
              evt.preventDefault();
            },
            children: <CopyIcon />,
            tooltip: "Copy annotation to clipboard"
          }
        ]}
      </ActionMenu>
    </Item>
  );
};
