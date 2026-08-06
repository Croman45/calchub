"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { evaluateExpression } from "@/lib/calculators/expression-evaluator";
import { cn } from "@/lib/utils";

const BUTTON_ROWS: { label: string; insert: string; variant?: "default" | "operator" | "function" }[][] = [
  [
    { label: "sin", insert: "sin(", variant: "function" },
    { label: "cos", insert: "cos(", variant: "function" },
    { label: "tan", insert: "tan(", variant: "function" },
    { label: "(", insert: "(", variant: "function" },
    { label: ")", insert: ")", variant: "function" },
  ],
  [
    { label: "log", insert: "log(", variant: "function" },
    { label: "ln", insert: "ln(", variant: "function" },
    { label: "√", insert: "sqrt(", variant: "function" },
    { label: "x^y", insert: "^", variant: "operator" },
    { label: "%", insert: "%", variant: "operator" },
  ],
  [
    { label: "7", insert: "7" },
    { label: "8", insert: "8" },
    { label: "9", insert: "9" },
    { label: "÷", insert: "/", variant: "operator" },
    { label: "π", insert: "pi", variant: "function" },
  ],
  [
    { label: "4", insert: "4" },
    { label: "5", insert: "5" },
    { label: "6", insert: "6" },
    { label: "×", insert: "*", variant: "operator" },
    { label: "e", insert: "e", variant: "function" },
  ],
  [
    { label: "1", insert: "1" },
    { label: "2", insert: "2" },
    { label: "3", insert: "3" },
    { label: "−", insert: "-", variant: "operator" },
    { label: "!", insert: "!", variant: "operator" },
  ],
  [
    { label: "0", insert: "0" },
    { label: ".", insert: "." },
    { label: "=", insert: "=", variant: "operator" },
    { label: "+", insert: "+", variant: "operator" },
  ],
];

export function ScientificCalculator() {
  const [expression, setExpression] = React.useState("");
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function handleInsert(token: string) {
    if (token === "=") {
      handleEvaluate();
      return;
    }
    setExpression((prev) => prev + token);
  }

  function handleEvaluate() {
    if (!expression.trim()) return;
    try {
      const value = evaluateExpression(expression);
      setResult(String(value));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    }
  }

  function handleClear() {
    setExpression("");
    setResult(null);
    setError(null);
  }

  function handleBackspace() {
    setExpression((prev) => prev.slice(0, -1));
  }

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-6">
        <div className="rounded-xl bg-muted p-4 text-right">
          <label htmlFor="scientific-expression" className="sr-only">
            Expression
          </label>
          <input
            id="scientific-expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEvaluate()}
            placeholder="0"
            className="w-full bg-transparent text-right font-mono text-lg outline-none"
            aria-label="Expression input"
          />
          <div className="mt-1 min-h-8 font-mono text-2xl font-bold text-primary" aria-live="polite">
            {error ? <span className="text-sm font-normal text-destructive">{error}</span> : result}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={handleBackspace} aria-label="Backspace">
            <Delete className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {BUTTON_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-2">
              {row.map((btn) => (
                <Button
                  key={btn.label}
                  variant={btn.variant === "operator" ? "secondary" : btn.variant === "function" ? "outline" : "default"}
                  className={cn("h-11", btn.variant !== "operator" && btn.variant !== "function" && "bg-card text-foreground hover:bg-muted")}
                  onClick={() => handleInsert(btn.insert)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
