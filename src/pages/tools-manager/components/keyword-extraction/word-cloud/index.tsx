
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import 'echarts-wordcloud';

interface WordCloudProps {
  data: Array<{ name: string; value: number }>;
  width?: number;
  height?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ 
  data, 
  width = 600, 
  height = 400 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const chart = echarts.init(chartRef.current);
    const option = {
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        right: null,
        bottom: null,
        data: data,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: () => {
            return `rgb(${[
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',')})`;
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        }
      }]
    };
    chart.setOption(option);
    
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  return <div ref={chartRef} style={{ width, height }} />;
};

export default WordCloud;
