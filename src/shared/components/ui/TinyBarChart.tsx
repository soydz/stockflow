"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// propiedades del objeto a graficar
interface BarConfig {
    key: string;
    name: string;
    color: string;
}

interface TinyBarChartProps {
    data: any[];
    config: BarConfig[];
    xAxisKey: string;
    height?: string;
}

export function TinyBarChart({ data, config, xAxisKey, height = "h-80" }: Readonly<TinyBarChartProps>) {

    if (!data || data.length === 0) {
        return (
            <div>No hay datos disponibles para mostrar la gráfica</div>
        )
    }

    return (
        <div className={`${height} w-full`}>
            <ResponsiveContainer
                width="100%" height="100%"
            >
                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.5}
                    />

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
                        cursor={{}}
                        contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
                        }}
                    />

                    <Legend
                        verticalAlign="top"
                        align="right"
                    />

                    {/* crea la cantidad de barras definidas en config */}
                    {config.map((bar) => (
                        <Bar
                            key={bar.key}
                            dataKey={bar.key}
                            name={bar.name}
                            fill={bar.color}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}