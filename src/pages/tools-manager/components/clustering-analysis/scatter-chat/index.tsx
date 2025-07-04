import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';

// 定义组件的Props，包含散点图数据
interface ScatterChartProps {
  scatterData: [number, number][]; // 散点图数据，格式为二维数组
}

// ScatterChart组件
const ScatterChart: React.FC<ScatterChartProps> = ({ scatterData }) => {
  // 使用useRef创建一个ECharts实例的引用
  const chartRef = useRef(null);

  // ECharts的配置项，基于提供的demo配置，并添加数据接收逻辑
  const getOption = () => {
    return {
      title: {
        text: '数据聚类情况',
        x: 'center',
        y: 0,
        textStyle: {
          color: '#3259B8',
          fontSize: 16,
          fontWeight: 'normal',
        },
      },
      // 右上角筛选
      visualMap: {
        show: false,
        min: 15202,
        max: 159980,
        dimension: 1,
        left: 'right',
        top: 'top',
        text: ['HIGH', 'LOW'],
        calculable: true,
        itemWidth: 18,
        itemHeight: 160,
        textStyle: {
          color: '#3259B8',
          fontSize: 11,
          // 注意：ECharts的textStyle属性中不包含height，已移除
          lineHeight: 60,
        },
        inRange: {
          color: ['#3EACE5', '#F02FC2'],
        },
        padding: [50, 20],
        orient: 'horizontal',
      },
      grid: {
        left: '5%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        formatter: (params) => {
          if (params.value.length > 1) {
            return `x: ${params.value[0]}x<br/> y: ${params.value[1]} y`;
          } else {
            return `${params.seriesName} :<br/>${params.name} : ${params.value} y`;
          }
        },
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1,
          },
        },
      },
      xAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value} x',
          },
          nameTextStyle: {
            color: '#3259B8',
            fontSize: 14,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#3259B8',
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value} y',
          },
          nameTextStyle: {
            color: '#3259B8',
            fontSize: 14,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#3259B8',
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'price-area',
          type: 'scatter',
          data: scatterData, // 使用父组件传递的数据
          symbolSize: 4,
        },
      ],
    };
  };

  return (
    <ReactECharts
      ref={chartRef}
      option={getOption()}
      style={{ height: '400px', width: '100%' }}
    />
  );
};

export default ScatterChart;












// import React, { useEffect, useRef } from 'react';
// import ReactECharts from 'echarts-for-react';

// interface ScatterChartProps {
//   scatterData: Array<{
//     value: [number, number];
//     itemStyle?: {
//       color: string;
//     };
//   }>; // 修改数据类型以支持颜色设置
// }

// // ScatterChart组件
// const ScatterChart: React.FC<ScatterChartProps> = ({ scatterData }) => {
//   // 使用useRef创建一个ECharts实例的引用
//   const chartRef = useRef(null);

//   // ECharts的配置项，基于提供的demo配置，并添加数据接收逻辑
//   const getOption = () => {
//     return {
//       title: {
//         text: '数据聚类情况',
//         x: 'center',
//         y: 0,
//         textStyle: {
//           color: '#3259B8',
//           fontSize: 16,
//           fontWeight: 'normal',
//         },
//       },
//       visualMap: {
//         min: 15202,
//         max: 159980,
//         dimension: 1,
//         left: 'right',
//         top: 'top',
//         text: ['HIGH', 'LOW'],
//         calculable: true,
//         itemWidth: 18,
//         itemHeight: 160,
//         textStyle: {
//           color: '#3259B8',
//           fontSize: 11,
//           // 注意：ECharts的textStyle属性中不包含height，已移除
//           lineHeight: 60,
//         },
//         inRange: {
//           color: ['#3EACE5', '#F02FC2'],
//         },
//         padding: [50, 20],
//         orient: 'horizontal',
//       },
//       grid: {
//         left: '5%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true,
//       },
//       tooltip: {
//         trigger: 'item',
//         showDelay: 0,
//         formatter: (params) => {
//           if (params.value.length > 1) {
//             return `x: ${params.value[0]}x <br/> y: ${params.value[1]}y`;
//           } else {
//             return `${params.seriesName} :<br/>${params.name} : ${params.value} y`;
//           }
//         },
//         axisPointer: {
//           show: true,
//           type: 'cross',
//           lineStyle: {
//             type: 'dashed',
//             width: 1,
//           },
//         },
//       },
//       xAxis: [
//         {
//           type: 'value',
//           scale: true,
//           axisLabel: {
//             formatter: '{value} m',
//           },
//           nameTextStyle: {
//             color: '#3259B8',
//             fontSize: 14,
//           },
//           axisTick: {
//             show: false,
//           },
//           axisLine: {
//             lineStyle: {
//               color: '#3259B8',
//             },
//           },
//           splitLine: {
//             show: false,
//           },
//         },
//       ],
//       yAxis: [
//         {
//           type: 'value',
//           scale: true,
//           axisLabel: {
//             formatter: '{value} y',
//           },
//           nameTextStyle: {
//             color: '#3259B8',
//             fontSize: 14,
//           },
//           axisTick: {
//             show: false,
//           },
//           axisLine: {
//             lineStyle: {
//               color: '#3259B8',
//             },
//           },
//           splitLine: {
//             show: false,
//           },
//         },
//       ],
//       series: [
//         {
//           name: 'price-area',
//           type: 'scatter',
//           data: scatterData.map(item => ({
//             ...item,
//             symbolSize: 4
//           })),
//           // 统一设置默认颜色（可选）
//           itemStyle: {
//             color: '#3EACE5' // 默认颜
//           }
//         },
//       ],
//     };
//   };

//   return (
//     <ReactECharts
//       ref={chartRef}
//       option={getOption()}
//       style={{ height: '400px', width: '100%' }}
//     />
//   );
// };

// export default ScatterChart;

