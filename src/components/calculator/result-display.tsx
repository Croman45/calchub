"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import type { CalculatorComputeResult } from "@/lib/calculators/types";

export function ResultDisplay({ result }: { result: CalculatorComputeResult }) {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground">{result.primary.label}</p>
          <motion.p
            key={result.primary.value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-3xl font-bold tracking-tight text-primary sm:text-4xl"
          >
            {result.primary.value}
          </motion.p>
        </CardContent>
      </Card>

      {result.secondary && result.secondary.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {result.secondary.map((item) => (
            <Card key={item.label} className="border-border/60">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-lg font-semibold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {result.warnings?.map((warning) => (
        <Alert key={warning} variant="destructive" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription className="text-amber-700 dark:text-amber-400">{warning}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
