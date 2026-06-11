import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PerformanceTrendChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="name" tick={false} />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.15}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PerformanceTrendChart;
