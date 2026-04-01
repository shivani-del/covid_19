import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import { CovidCountry } from "@/hooks/useCovidData";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  data: CovidCountry[];
}

const CovidChart = ({ data }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<'first10' | 'next20'>('first10');
  
  const colors = {
    Cases: {
      main: "#3b82f6",
      gradient: ["#60a5fa", "#3b82f6", "#2563eb"],
      hover: "#2563eb"
    },
    Deaths: {
      main: "#ef4444", 
      gradient: ["#f87171", "#ef4444", "#dc2626"],
      hover: "#dc2626"
    },
    Recovered: {
      main: "#10b981",
      gradient: ["#34d399", "#10b981", "#059669"],
      hover: "#059669"
    },
    Active: {
      main: "#f59e0b",
      gradient: ["#fbbf24", "#f59e0b", "#d97706"],
      hover: "#d97706"
    }
  };

  const getChartData = () => {
    if (selectedRange === 'first10') {
      return data.slice(0, 10).map((c) => ({
        country: c.country,
        Cases: c.cases,
        Deaths: c.deaths,
        Recovered: c.recovered,
        Active: c.active,
      }));
    } else {
      return data.slice(10, 30).map((c) => ({
        country: c.country,
        Cases: c.cases,
        Deaths: c.deaths,
        Recovered: c.recovered,
        Active: c.active,
      }));
    }
  };

  const chartData = getChartData();

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {selectedRange === 'first10' ? 'Top 10 Countries by Cases' : 'Countries 11-30 by Cases'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Comparative view of cases, deaths, recovered, and active counts
          </p>
        </div>
        
        {/* Custom Dropdown */}
        <div className="relative mt-4 sm:mt-0">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value as 'first10' | 'next20')}
            className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-10 text-sm font-medium text-foreground hover:bg-[#f8f9fa] hover:border-[#e9ecef] focus:outline-none focus:ring-2 focus:ring-[#f8f9fa] focus:border-[#e9ecef] transition-colors cursor-pointer"
          >
            <option value="first10">Top 10 Countries</option>
            <option value="next20">Countries 11-30</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" />
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
              height={80}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }}
              tickFormatter={(v: number) =>
                v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : `${v}`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                backdropFilter: "blur(8px)"
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "8px", color: "#1f2937" }}
              formatter={(value: number, name: string) => {
                const labels = {
                  Cases: "Total Cases",
                  Deaths: "Deaths", 
                  Recovered: "Resolved",
                  Active: "Active Cases"
                };
                
                return [
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '120px' }}>
                    <span style={{ color: colors[name as keyof typeof colors]?.main || "#666", fontWeight: "500" }}>
                      {labels[name as keyof typeof labels] || name}:
                    </span>
                    <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                      {value.toLocaleString()}
                    </span>
                  </div>
                ];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "16px" }}
              iconType="rect"
              formatter={(value) => (
                <span style={{ color: colors[value as keyof typeof colors]?.main || "#666" }}>
                  {value}
                </span>
              )}
              content={({ payload }) => (
                <div className="flex flex-wrap gap-4 justify-center">
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: colors[entry.value as keyof typeof colors]?.main || '#666',
                          borderRadius: '2px'
                        }} 
                      />
                      <span style={{ color: colors[entry.value as keyof typeof colors]?.main || "#666" }}>
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar 
              dataKey="Cases" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={0}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-cases-${index}`} 
                  fill={activeIndex === index ? colors.Cases.hover : colors.Cases.main}
                  style={{
                    filter: activeIndex === index ? 'brightness(0.9)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="Deaths" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={200}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-deaths-${index}`} 
                  fill={activeIndex === index ? colors.Deaths.hover : colors.Deaths.main}
                  style={{
                    filter: activeIndex === index ? 'brightness(0.9)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="Recovered" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={400}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-recovered-${index}`} 
                  fill={activeIndex === index ? colors.Recovered.hover : colors.Recovered.main}
                  style={{
                    filter: activeIndex === index ? 'brightness(0.9)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="Active" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={600}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-active-${index}`} 
                  fill={activeIndex === index ? colors.Active.hover : colors.Active.main}
                  style={{
                    filter: activeIndex === index ? 'brightness(0.9)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CovidChart;
