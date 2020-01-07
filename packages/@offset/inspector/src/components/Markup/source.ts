import Document, {
  Annotation,
  InlineAnnotation,
  ParseAnnotation
} from "@atjson/document";

class CarriageReturn extends InlineAnnotation {
  static vendorPrefix = "inspector";
  static type = "carriage-return";
}

class AnnotationMarker extends InlineAnnotation<{ id: string }> {
  static vendorPrefix = "inspector";
  static type = "annotation-marker";
}

class WhiteSpace extends InlineAnnotation {
  static vendorPrefix = "inspector";
  static type = "white-space";
}

class ParseToken extends InlineAnnotation<{ reason?: string }> {
  static vendorPrefix = "inspector";
  static type = "parse-token";
}

export default class FormattingMarks extends Document {
  static schema = [CarriageReturn, AnnotationMarker, WhiteSpace, ParseToken];
  static fromRaw(text: string, parseTokens?: Annotation[]) {
    let doc = new this({
      content: text,
      annotations: []
    });
    let newlines = doc.match(/\n/g);
    for (let newline of newlines) {
      doc.addAnnotations(new CarriageReturn(newline));
    }
    let spaces = doc.match(/ /g);
    for (let space of spaces) {
      doc.addAnnotations(new WhiteSpace(space));
    }

    let references = doc.match(/\uFFF9([^\uFFFA]+)\uFFFA/g);
    for (let reference of references) {
      let id = reference.matches[1];
      let end = doc.content.indexOf(`\uFFFA${id}\uFFFB`);
      doc.addAnnotations(
        new ParseAnnotation({
          start: reference.start,
          end: reference.start + id.length + 2,
          attributes: {
            reason: `annotation marker start for ${id}`
          }
        }),
        new AnnotationMarker({
          start: reference.start,
          end: end + id.length + 2,
          attributes: {
            id
          }
        }),
        new ParseAnnotation({
          start: end,
          end: end + id.length + 2,
          attributes: {
            reason: `annotation marker end for ${id}`
          }
        })
      );
    }

    for (let parseToken of parseTokens || []) {
      doc.addAnnotations(
        new ParseToken({
          start: parseToken.start,
          end: parseToken.end,
          attributes: parseToken.attributes
        })
      );
    }
    return doc;
  }
}
