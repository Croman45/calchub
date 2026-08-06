"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { CalculatorChartPoint } from "@/lib/calculators/types";

const PALETTE = ["#4f46e5", "#06b6d4", "#f59e0b", "#ec4899", "#22c55e"];

export function ChartBlock({
  chartType,
  data,
  keys,
}: {
  chartType: "bar" | "line" | "pie" | "area";
  data: CalculatorChartPoint[];
  keys: string[];
}) {
  if (!data.length || !keys.length) return null;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "pie" ? (
          <PieChart>
            <Pie data={data} dataKey={keys[0]} nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.map((_, index) => (
                <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {keys.length > 1 && <Legend />}
            {keys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={PALETTE[index % PALETTE.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        ) : chartType === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {keys.length > 1 && <Legend />}
            {keys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={PALETTE[index % PALETTE.length]}
                fill={PALETTE[index % PALETTE.length]}
                fillOpacity={0.15}
              />
            ))}
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {keys.length > 1 && <Legend />}
            {keys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={PALETTE[index % PALETTE.length]} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
