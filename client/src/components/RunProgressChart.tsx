import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RunProgressChartProps {
  data: Array<{ id: string; date: string; distance: number }>;
}

export default function RunProgressChart({ data }: RunProgressChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 px-2">
      <h3 className="text-card-foreground mb-4 px-2">Weekly Progress</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ left: -10, right: 10 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" key="grid" />
          <XAxis
            dataKey="date"
            stroke="var(--muted-foreground)"
            tick={{ fill: "var(--muted-foreground)" }}
            interval={0}
            key="xaxis"
          />
          <YAxis
            stroke="var(--muted-foreground)"
            tick={{ fill: "var(--muted-foreground)" }}
            key="yaxis"
          />
          <Tooltip
            key="tooltip"
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem"
            }}
          />
          <Bar
            key="bar"
            dataKey="distance"
            fill="var(--chart_color)"
            radius={[4, 4, 0, 0]}
            barSize={25}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}