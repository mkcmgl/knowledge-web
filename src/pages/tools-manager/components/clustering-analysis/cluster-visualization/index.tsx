import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);


const COLORS = ['#FF6384', '#36A2EB', '#FFC85E'];
const POINT_STYLES = ['circle', 'triangle', 'rect'];


const ClusterVisualization = ({ data }: { data: { x: number; y: number; cluster: number; label?: string; value?: string|number }[] }) => {

    const chartData = {
        datasets: COLORS.map((color, i) => ({
            label: `分类 ${i + 1}`,
            data: data.filter((d: any) => d.cluster === i),
            backgroundColor: color,
            pointStyle: POINT_STYLES[i],
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 1
        }))
    };

    return (
        <div style={{ width: '800px', height: '600px' }}>
            <Scatter
                data={chartData}
                options={{
                    responsive: true,
                    scales: {
                        x: { min: 0, max: 20, ticks: { stepSize: 2 } },
                        y: { min: 0, max: 20, ticks: { stepSize: 2 } }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context: any) {
                                    const point = context.raw;
                                    // 显示label和value字段
                                    return `label: ${point.label ?? ''}, value: ${point.value ?? ''}`;
                                }
                            }
                        }
                    }
                }}
            />
        </div>
    );
};

export default ClusterVisualization;
