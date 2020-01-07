import { Annotation, AnnotationCollection } from "@atjson/document";
import * as React from "react";
import { FC } from "react";
import styled from "styled-components";
import { AnnotationItem } from "./AnnotationItem";

const List = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
  background: ${props => props.theme.pane.background};
  color: ${props => props.theme.pane.color};
`;

export const AnnotationList: FC<{
  annotations: AnnotationCollection;
  selectedAnnotation: Annotation | null;
  onSelect: (annotation: Annotation | null) => void;
  onDelete: (annotation: Annotation) => void;
}> = props => {
  return (
    <List>
      {props.annotations.map(annotation => {
        return (
          <AnnotationItem
            key={annotation.id}
            annotation={annotation}
            selected={props.selectedAnnotation === annotation}
            onDelete={() => props.onDelete(annotation)}
            onSelect={() => {
              if (props.selectedAnnotation === annotation) {
                props.onSelect(null);
              } else {
                props.onSelect(annotation);
              }
            }}
          />
        );
      })}
    </List>
  );
};
