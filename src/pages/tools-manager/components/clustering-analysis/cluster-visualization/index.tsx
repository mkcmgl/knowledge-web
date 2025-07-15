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


// 动态生成颜色
function getRandomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
}
// Chart.js 支持的点样式
const ALL_POINT_STYLES = [
  'circle', 'triangle', 'rect', 'rectRounded', 'rectRot', 'cross', 'crossRot', 'star', 'line', 'dash'
];

const ClusterVisualization = ({ data }: { data: { x: number; y: number; clusteringNum: number; label?: string; textContent?: string | number }[] }) => {
    console.log(`data`, data);
    // 统计有多少个 cluster
    const clusterIds = Array.from(new Set(data.map(d => d.clusteringNum)));
    // 为每个 cluster 分配颜色和点样式
    const clusterColorMap = clusterIds.map((_, i) =>
      i < 20 ? getRandomColor() : getRandomColor()
    );
    const clusterPointStyleMap = clusterIds.map((_, i) =>
      ALL_POINT_STYLES[i % ALL_POINT_STYLES.length]
    );

    const chartData = {
        datasets: clusterIds.map((clusterId, i) => ({
            label: `分类 ${clusterId + 1}`,
            data: data.filter((d: any) => d.clusteringNum === clusterId),
            backgroundColor: clusterColorMap[i],
            pointStyle: clusterPointStyleMap[i],
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
                        x: { ticks: { stepSize: 2 } },
                        y: { ticks: { stepSize: 2 } }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    const point = context.raw;
                                    // 长文本自动换行，每30个字符一行
                                    const text = `${point.textContent ?? ''}`;
                                    const lines = text.match(/.{1,30}/g) || [];
                                    return lines;
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
