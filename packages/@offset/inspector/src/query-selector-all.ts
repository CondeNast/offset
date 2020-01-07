const reName = /^(?:\\.|[\w\-\u00b0-\uFFFF])+/;
// modified version of https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L87
const reAttr = /^\s*((?:\\.|[\w\u00b0-\uFFFF\-])+)\s*(?:(\S?)=\s*(?:([''])([^]*?)\3|(#?(?:\\.|[\w\u00b0-\uFFFF\-])*)|)|)\s*(i)?\]/;

export type MatchCondition =
  'exists' |     // `[key]`
  'equals' |     // `[key=value]`
  'element' |    // `[key~=value]`
  'startsWith' | // `[key^=value]`
  'endsWith' |   // `[key$=value]`
  'hasAny' |     // `[key*=value]`
  'not' |        // `[key!=value]`
  'hyphen';      // `[key|=value]`

export interface Match {
  key: string;
  value: string | number | null;
  condition: MatchCondition;
  ignoreCase: boolean;
}

export type JoinCondition =
  'overlaps' |    // `&`
  'isInside';     // ` `

export type QueryCondition =
  'and' |  // h1.title
  'not' |  // :not(h1, h2)
  'any';   // :is(h1, h2) / h1, h2

export interface Query {
  condition: QueryCondition;
  matches: Array<Match | Query | Join>;
}

export interface Join {
  condition: JoinCondition;
  left: Match | Query | Join;
  right: Match | Query | Join | null;
}

function isWhitespace(letter: string) {
  return letter === ' ' ||
    letter === '\n' ||
    letter === '\t' ||
    letter === '\f' ||
    letter === '\r';
}

export function parse(selector: string) {
  let [result, rest] = parseSelector(selector + '');

  if (rest !== '') {
    throw new SyntaxError(`Unmatched selector: ${rest}`);
  }

  return result;
}

function isMatch(match: Match | Query | Join): match is Match {
  return (match as Match).key != null;
}

function isQuery(query: Match | Query | Join): query is Query {
  return (query as Query).matches != null;
}

function isJoin(join: Match | Query | Join): join is Join {
  return (join as Join).left != null;
}

function addMatches(result: Match | Query | Join | null, matches: Match[], condition: QueryCondition): Match | Query | Join {
  if (result == null) {
    if (matches.length === 1) {
      return matches[0];
    }
    return {
      condition,
      matches
    };
  } else if (isMatch(result)) {
    return {
      condition,
      matches: [result, ...matches]
    };
  } else if (isQuery(result)) {
    if (result.condition === condition) {
      return {
        condition,
        matches: [...result.matches, ...matches]
      };
    } else {
      return {
        condition,
        matches: [{
          ...result
        }, ...matches]
      };
    }
  } else {
    return {
      condition: result.condition,
      left: result.left,
      right: addMatches(result.right, matches, condition)
    };
  }
}

function addJoin(result: Match | Query | Join | null, matches: Match[], condition: JoinCondition): Join | never {
  if (result == null) {
    return {
      condition,
      left: addMatches(null, matches, 'and'),
      right: null
    };
  } else {
    return {
      condition,
      left: result,
      right: addMatches(null, matches, 'and')
    };
  }
}

function parseSelector(selector: string): [Match | Query | Join, string] {
  let result: Match | Query | Join | null = null;
  let matches: Match[] = [];
  let sawWhitespace = false;
  let peek = '';

  function getName() {
    let sub = selector.match(reName)![0];
    selector = selector.substr(sub.length);
    return sub;
  }

  function stripWhitespace(start: number) {
    while (isWhitespace(selector.charAt(start))) start++;
    selector = selector.substr(start);
  }

  stripWhitespace(0);

  while (selector !== '') {
    peek = selector.charAt(0);

    if (isWhitespace(peek)) {
      sawWhitespace = true;
      stripWhitespace(1);
    } else if (peek === '&') {
      result = addJoin(result, matches, 'overlaps');
      matches = [];
      sawWhitespace = false;
      stripWhitespace(1);
    } else if (peek === ',') {
      result = addMatches(result, matches, 'any');
      matches = [];
      sawWhitespace = false;
      stripWhitespace(1);
    } else {
      if (sawWhitespace) {
        if (matches.length > 0) {
          result = addJoin(result, matches, 'isInside');
          matches = [];
        }
        sawWhitespace = false;
      }

      if (peek === '#' || peek === '.') {
        selector = selector.substr(1);

        matches.push({
          key: peek === '#' ? 'id' : 'class',
          value: getName(),
          condition: peek === '#' ? 'equals' : 'element',
          ignoreCase: false
        });
      } else if (peek === '[') {
        selector = selector.substr(1);
        let attribute = selector.match(reAttr);
        if (!attribute) {
          throw new SyntaxError(`Malformed attribute selector: ${selector}`);
        }
        selector = selector.substr(attribute[0].length);
        let equality = attribute[2];
        let condition: MatchCondition = 'equals';
        if (equality === '') {
          condition = 'equals';
        } else if (equality === '~') {
          condition = 'element';
        } else if (equality === '^') {
          condition = 'startsWith';
        } else if (equality === '$') {
          condition = 'endsWith';
        } else if (equality === '*') {
          condition = 'hasAny';
        } else if (equality === '!') {
          condition = 'not';
        } else if (equality === '|') {
          condition = 'hyphen';
        }
        console.log(equality, attribute);

        matches.push({
          key: attribute[1],
          condition,
          value: attribute[4] || attribute[5] || null,
          ignoreCase: !!attribute[6]
        });

      } else if (peek === ':') {
        if (selector.charAt(1) === ':') {
          throw new Error(`Malformed selector ${selector}\nPseudo elements are not supported.`);
        }

        selector = selector.substr(1);

        let functionName = getName().toLowerCase();
        if (selector.charAt(0) === '(') {
          if (functionName === 'is' || functionName === 'not') {
            let condition: 'any' | 'not' = functionName === 'is' ? 'any' : 'not';
            let [internalResult, remainingSelector] = parseSelector(selector.slice(1));

            result = {
              condition,
              matches: [internalResult]
            };
            selector = remainingSelector;
            if (selector.charAt(0) !== ')') {
              throw new SyntaxError(`Missing closing parenthesis in "${name}": ${selector}`);
            }

            selector = selector.substr(1);
          } else {
            throw new Error(`${functionName} is not supported by querySelectorAll.`);
          }
        }
      } else if (reName.test(selector)) {
        matches.push({
          key: 'type',
          condition: 'equals',
          value: getName(),
          ignoreCase: false
        });
      } else {
        if (result == null) {
          result = addMatches(result, matches, 'and');
        } else if (isJoin(result) && result.right == null) {
          result = result.left;
        }

        return [result!, selector];
      }
    }
  }

  result = addMatches(result, matches, 'and');

  return [result!, selector];
}
