/**
 * Safe math expression evaluator for the Scientific Calculator.
 * Deliberately hand-rolled (tokenizer + recursive-descent parser) instead of
 * eval()/new Function() so user keystrokes can never reach JS execution.
 */

type TokenType = "number" | "operator" | "lparen" | "rparen" | "identifier" | "comma";

interface Token {
  type: TokenType;
  value: string;
}

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  sqrt: (x) => Math.sqrt(x),
  cbrt: (x) => Math.cbrt(x),
  abs: (x) => Math.abs(x),
  exp: (x) => Math.exp(x),
  round: (x) => Math.round(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let numStr = ch;
      i++;
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: "number", value: numStr });
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let ident = ch;
      i++;
      while (i < input.length && /[a-zA-Z0-9]/.test(input[i])) {
        ident += input[i];
        i++;
      }
      tokens.push({ type: "identifier", value: ident });
      continue;
    }
    if ("+-*/^%!".includes(ch)) {
      tokens.push({ type: "operator", value: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen", value: ch });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen", value: ch });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "comma", value: ch });
      i++;
      continue;
    }
    throw new Error(`Unexpected character "${ch}" in expression.`);
  }
  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    const token = this.tokens[this.pos];
    if (!token) throw new Error("Unexpected end of expression.");
    this.pos++;
    return token;
  }

  parse(): number {
    if (this.tokens.length === 0) return 0;
    const result = this.parseAddSub();
    if (this.pos < this.tokens.length) {
      throw new Error(`Unexpected token "${this.peek()?.value}".`);
    }
    return result;
  }

  private parseAddSub(): number {
    let left = this.parseMulDiv();
    while (this.peek()?.type === "operator" && (this.peek()?.value === "+" || this.peek()?.value === "-")) {
      const op = this.consume().value;
      const right = this.parseMulDiv();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private parseMulDiv(): number {
    let left = this.parsePow();
    while (
      this.peek()?.type === "operator" &&
      (this.peek()?.value === "*" || this.peek()?.value === "/" || this.peek()?.value === "%")
    ) {
      const op = this.consume().value;
      const right = this.parsePow();
      if (op === "*") left *= right;
      else if (op === "/") left /= right;
      else left %= right;
    }
    return left;
  }

  private parsePow(): number {
    const left = this.parseUnary();
    if (this.peek()?.type === "operator" && this.peek()?.value === "^") {
      this.consume();
      const right = this.parsePow();
      return Math.pow(left, right);
    }
    return left;
  }

  private parseUnary(): number {
    if (this.peek()?.type === "operator" && this.peek()?.value === "-") {
      this.consume();
      return -this.parseUnary();
    }
    if (this.peek()?.type === "operator" && this.peek()?.value === "+") {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePostfix();
  }

  private parsePostfix(): number {
    let value = this.parsePrimary();
    while (this.peek()?.type === "operator" && this.peek()?.value === "!") {
      this.consume();
      value = factorial(value);
    }
    return value;
  }

  private parsePrimary(): number {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of expression.");

    if (token.type === "number") {
      this.consume();
      return parseFloat(token.value);
    }

    if (token.type === "lparen") {
      this.consume();
      const value = this.parseAddSub();
      if (this.peek()?.type !== "rparen") throw new Error("Missing closing parenthesis.");
      this.consume();
      return value;
    }

    if (token.type === "identifier") {
      this.consume();
      const name = token.value.toLowerCase();

      if (this.peek()?.type === "lparen") {
        this.consume();
        const args: number[] = [];
        if (this.peek()?.type !== "rparen") {
          args.push(this.parseAddSub());
          while (this.peek()?.type === "comma") {
            this.consume();
            args.push(this.parseAddSub());
          }
        }
        if (this.peek()?.type !== "rparen") throw new Error("Missing closing parenthesis.");
        this.consume();

        const fn = FUNCTIONS[name];
        if (!fn) throw new Error(`Unknown function "${name}".`);
        return fn(...args);
      }

      if (name in CONSTANTS) return CONSTANTS[name];
      throw new Error(`Unknown identifier "${name}".`);
    }

    throw new Error(`Unexpected token "${token.value}".`);
  }
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("Factorial requires a non-negative integer.");
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function evaluateExpression(expression: string): number {
  const tokens = tokenize(expression);
  const parser = new Parser(tokens);
  const result = parser.parse();
  if (!Number.isFinite(result)) throw new Error("Result is not a finite number (check for division by zero).");
  return result;
}
