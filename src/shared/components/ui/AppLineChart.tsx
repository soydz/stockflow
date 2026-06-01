import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data2 = [
    { name: 'Ene', uv: 4000 },
    { name: 'Feb', uv: 3000 },
    { name: 'Mar', uv: 5000 },
    { name: 'Abr', uv: 2780 },
    { name: 'May', uv: 1890 },
    { name: 'Jun', uv: 2390 },
    { name: 'Jul', uv: 3490 },
];

// propiedades del objeto a graficar
interface AreaConfig {
    key: string;
    name: string;
    color: string;
    type?: "monotone" | "linear" | "step"; // tipo de ilnea
}

interface AreaBarChartProps {
    data: Record<string, any>[];
    config: AreaConfig[];
    xAxisKey: string;
    height?: string;
}

export function AppLineChart({ data, config, xAxisKey, height = "h-80" }: Readonly<AreaBarChartProps>) {
    if (!data || data.length === 0) {
        return <div>No hay datos disponibles para mostrar la gráfica</div>
    }

    return (
        <div className={`${height} w-full flex flex-col items-center justify-center`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.5} />
                    <XAxis
                        dataKey={xAxisKey}
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
                        }}
                    />
                    {config.length > 1 && <Legend verticalAlign="top" align="right" height={36} />}
                    {config.map((lineConfig) => (
                        <Line
                            key={lineConfig.key}
                            type={lineConfig.type || "monotone"}
                            dataKey={lineConfig.key}
                            name={lineConfig.name}
                            stroke={lineConfig.color}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}