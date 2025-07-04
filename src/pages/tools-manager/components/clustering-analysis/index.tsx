import {
  Typography,
  Form,
  Input,
  Button,
  Slider,
  Space,
  Card,
  message
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import SimilaritySlider from '@/components/similarity-slider';
import ScatterChart2 from './scatter-chart1';
import ScatterChart from './scatter-chat';
import sampleDataList from "./data.json"
const { Title, Text } = Typography;
const { TextArea } = Input;

interface ScatterData {
  x: number;
  y: number;
  color: string;
}



export const sampleData: ScatterData[] = [
  { x: 0.5, y: 1.0, color: "#ff7f0e" },
  { x: 1.0, y: 1.5, color: "#1f77b4" },
  { x: 1.5, y: 2.0, color: "#2ca02c" },
  { x: 2.0, y: 2.5, color: "#d62728" },
  { x: 2.5, y: 3.0, color: "#9467bd" },
  { x: 3.0, y: 3.5, color: "#8c564b" },
  { x: 0.8, y: 3.2, color: "#e377c2" },
  { x: 1.2, y: 2.8, color: "#7f7f7f" },
  { x: 2.3, y: 1.7, color: "#bcbd22" },
  { x: 1.7, y: 1.2, color: "#17becf" }
];
const sampleData2=sampleDataList
// const sampleData2 =
//   [
//     { "value": [399.48, 75098], "itemStyle": { "color": "#3259B8" } },
//     { "value": [398.61, 107624], "itemStyle": { "color": "#3259B8" } },
//     { "value": [390.44, 56347], "itemStyle": { "color": "#3259B8" } },
//     { "value": [368.52, 25779], "itemStyle": { "color": "#3259B8" } },
//     { "value": [367.31, 40293], "itemStyle": { "color": "#3259B8" } },
//     { "value": [367.19, 62638], "itemStyle": { "color": "#3259B8" } },
//     { "value": [357.76, 74911], "itemStyle": { "color": "#3259B8" } },
//     { "value": [353.44, 45836], "itemStyle": { "color": "#3259B8" } },
//     { "value": [349.71, 65769], "itemStyle": { "color": "#3259B8" } },
//     { "value": [336.9, 129000], "itemStyle": { "color": "#3259B8" } },
//     { "value": [335.85, 77416], "itemStyle": { "color": "#3259B8" } },
//     { "value": [335.67, 73883], "itemStyle": { "color": "#3259B8" } },
//     { "value": [330.86, 119386], "itemStyle": { "color": "#3259B8" } },
//     { "value": [327.27, 44306], "itemStyle": { "color": "#3259B8" } },
//     { "value": [326.15, 49058], "itemStyle": { "color": "#3259B8" } },
//     { "value": [325.1, 38143], "itemStyle": { "color": "#3259B8" } },
//     { "value": [324.98, 52311], "itemStyle": { "color": "#3259B8" } },
//     { "value": [324.22, 98699], "itemStyle": { "color": "#3259B8" } },
//     { "value": [321.42, 28623], "itemStyle": { "color": "#3259B8" } },
//     { "value": [321.06, 96556], "itemStyle": { "color": "#3259B8" } },
//     { "value": [321.05, 119920], "itemStyle": { "color": "#3259B8" } },
//     { "value": [320.1, 34990], "itemStyle": { "color": "#3259B8" } },
//     { "value": [320.1, 96845], "itemStyle": { "color": "#3259B8" } },
//     { "value": [319.89, 89406], "itemStyle": { "color": "#3259B8" } },
//     { "value": [317.94, 100648], "itemStyle": { "color": "#3259B8" } },
//     { "value": [317.61, 99179], "itemStyle": { "color": "#3259B8" } },
//     { "value": [316.68, 52104], "itemStyle": { "color": "#3259B8" } },
//     { "value": [314.28, 128866], "itemStyle": { "color": "#3259B8" } },
//     { "value": [314.28, 108184], "itemStyle": { "color": "#3259B8" } },
//     { "value": [314.01, 36624], "itemStyle": { "color": "#3259B8" } },
//     { "value": [311.95, 58664], "itemStyle": { "color": "#3259B8" } },
//     { "value": [310.46, 18038], "itemStyle": { "color": "#3259B8" } },
//     { "value": [310.35, 69599], "itemStyle": { "color": "#3259B8" } },
//     { "value": [310.17, 122514], "itemStyle": { "color": "#3259B8" } },
//     { "value": [307.68, 107255], "itemStyle": { "color": "#3259B8" } },
//     { "value": [306.87, 25418], "itemStyle": { "color": "#3259B8" } },
//     { "value": [306.82, 97778], "itemStyle": { "color": "#3259B8" } },
//     { "value": [306.66, 42393], "itemStyle": { "color": "#3259B8" } },
//     { "value": [306.4, 101175], "itemStyle": { "color": "#3259B8" } },
//     { "value": [305.54, 130916], "itemStyle": { "color": "#3259B8" } },
//     { "value": [305.37, 74991], "itemStyle": { "color": "#3259B8" } },
//     { "value": [304.91, 55755], "itemStyle": { "color": "#3259B8" } },
//     { "value": [304.08, 118390], "itemStyle": { "color": "#3259B8" } },
//     { "value": [303.86, 87541], "itemStyle": { "color": "#3259B8" } },
//     { "value": [303.61, 118574], "itemStyle": { "color": "#3259B8" } },
//     { "value": [303.43, 95574], "itemStyle": { "color": "#3259B8" } },
//     { "value": [303.06, 102290], "itemStyle": { "color": "#3259B8" } },
//     { "value": [302.62, 88164], "itemStyle": { "color": "#3259B8" } },
//     { "value": [301.94, 42393], "itemStyle": { "color": "#3259B8" } },
//     { "value": [301.3, 56423], "itemStyle": { "color": "#3259B8" } },
//     { "value": [298.79, 86951], "itemStyle": { "color": "#3259B8" } },
//     { "value": [298.02, 45299], "itemStyle": { "color": "#3259B8" } },
//     { "value": [297.51, 73275], "itemStyle": { "color": "#3259B8" } },
//     { "value": [297.18, 65954], "itemStyle": { "color": "#3259B8" } },
//     { "value": [296.18, 88798], "itemStyle": { "color": "#3259B8" } },
//     { "value": [295.62, 118396], "itemStyle": { "color": "#3259B8" } },
//     { "value": [295.56, 128570], "itemStyle": { "color": "#3259B8" } },
//     { "value": [295.27, 59268], "itemStyle": { "color": "#3259B8" } },
//     { "value": [294.77, 26801], "itemStyle": { "color": "#3259B8" } },
//     { "value": [294.62, 67545], "itemStyle": { "color": "#3259B8" } },
//     { "value": [293.77, 81697], "itemStyle": { "color": "#3259B8" } },
//     { "value": [293.35, 22158], "itemStyle": { "color": "#3259B8" } },
//     { "value": [292.56, 45119], "itemStyle": { "color": "#3259B8" } },
//     { "value": [292.21, 31827], "itemStyle": { "color": "#3259B8" } },
//     { "value": [292.03, 89032], "itemStyle": { "color": "#3259B8" } },
//     { "value": [291.27, 34333], "itemStyle": { "color": "#3259B8" } },
//     { "value": [291.24, 68672], "itemStyle": { "color": "#3259B8" } },
//     { "value": [290.69, 106643], "itemStyle": { "color": "#3259B8" } },
//     { "value": [289.82, 117315], "itemStyle": { "color": "#3259B8" } },
//     { "value": [289.65, 139997], "itemStyle": { "color": "#3259B8" } },
//     { "value": [289.45, 55278], "itemStyle": { "color": "#3259B8" } },
//     { "value": [289.01, 24913], "itemStyle": { "color": "#3259B8" } },
//     { "value": [288.75, 66840], "itemStyle": { "color": "#3259B8" } },
//     { "value": [287.7, 116441], "itemStyle": { "color": "#3259B8" } },
//     { "value": [286.87, 97606], "itemStyle": { "color": "#3259B8" } },
//     { "value": [286.43, 48878], "itemStyle": { "color": "#3259B8" } },
//     { "value": [286.26, 83840], "itemStyle": { "color": "#3259B8" } },
//     { "value": [286.26, 59387], "itemStyle": { "color": "#3259B8" } },
//     { "value": [286.01, 132863], "itemStyle": { "color": "#3259B8" } },
//     { "value": [284.99, 94741], "itemStyle": { "color": "#3259B8" } },
//     { "value": [284.62, 119458], "itemStyle": { "color": "#3259B8" } },
//     { "value": [284.43, 91411], "itemStyle": { "color": "#3259B8" } },
//     { "value": [283.6, 129937], "itemStyle": { "color": "#3259B8" } },
//     { "value": [283.1, 65348], "itemStyle": { "color": "#3259B8" } },
//     { "value": [282.92, 134314], "itemStyle": { "color": "#3259B8" } },
//     { "value": [282.02, 49642], "itemStyle": { "color": "#3259B8" } },
//     { "value": [281.02, 69391], "itemStyle": { "color": "#3259B8" } },
//     { "value": [280.96, 34881], "itemStyle": { "color": "#3259B8" } },
//     { "value": [280.03, 49995], "itemStyle": { "color": "#3259B8" } },
//     { "value": [278.79, 99717], "itemStyle": { "color": "#3259B8" } },
//     { "value": [278.52, 21543], "itemStyle": { "color": "#3259B8" } },
//     { "value": [278.2, 113228], "itemStyle": { "color": "#3259B8" } },
//     { "value": [278.06, 61138], "itemStyle": { "color": "#3259B8" } },
//     { "value": [278.01, 114996], "itemStyle": { "color": "#3259B8" } },
//     { "value": [277.62, 93221], "itemStyle": { "color": "#3259B8" } },
//     { "value": [276.73, 104796], "itemStyle": { "color": "#3259B8" } },
//     { "value": [275.99, 137687], "itemStyle": { "color": "#3259B8" } },
//     { "value": [275.71, 111712], "itemStyle": { "color": "#3259B8" } },
//     { "value": [275.62, 34468], "itemStyle": { "color": "#3259B8" } },
//     { "value": [275.08, 39989], "itemStyle": { "color": "#3259B8" } },
//     { "value": [274.51, 49179], "itemStyle": { "color": "#3259B8" } },
//     { "value": [273.57, 100523], "itemStyle": { "color": "#3259B8" } },
//     { "value": [273.19, 36166], "itemStyle": { "color": "#3259B8" } },
//     { "value": [272.85, 39216], "itemStyle": { "color": "#3259B8" } },
//     { "value": [271.32, 64500], "itemStyle": { "color": "#3259B8" } },
//     { "value": [271.18, 95878], "itemStyle": { "color": "#3259B8" } },
//     { "value": [270.93, 75666], "itemStyle": { "color": "#3259B8" } },
//     { "value": [269.88, 68549], "itemStyle": { "color": "#3259B8" } },
//     { "value": [269.27, 61277], "itemStyle": { "color": "#3259B8" } },
//     { "value": [267.44, 74784], "itemStyle": { "color": "#3259B8" } },
//     { "value": [267.21, 95057], "itemStyle": { "color": "#3259B8" } },
//     { "value": [266.93, 65561], "itemStyle": { "color": "#3259B8" } },
//     { "value": [266.66, 97503], "itemStyle": { "color": "#3259B8" } },
//     { "value": [266.63, 33755], "itemStyle": { "color": "#3259B8" } },
//     { "value": [266.59, 37511], "itemStyle": { "color": "#3259B8" } },
//     { "value": [266.3, 103267], "itemStyle": { "color": "#3259B8" } },
//     { "value": [266.01, 105260], "itemStyle": { "color": "#3259B8" } },
//     { "value": [265.55, 55734], "itemStyle": { "color": "#3259B8" } },
//     { "value": [263.43, 37961], "itemStyle": { "color": "#3259B8" } },
//     { "value": [263.42, 33407], "itemStyle": { "color": "#3259B8" } },
//     { "value": [263.27, 68371], "itemStyle": { "color": "#3259B8" } },
//     { "value": [263.04, 49423], "itemStyle": { "color": "#3259B8" } },
//     { "value": [262.83, 49462], "itemStyle": { "color": "#3259B8" } },
//     { "value": [262.37, 38038], "itemStyle": { "color": "#3259B8" } },
//     { "value": [262.1, 72492], "itemStyle": { "color": "#3259B8" } },
//     { "value": [261.85, 95475], "itemStyle": { "color": "#3259B8" } },
//     { "value": [261.35, 89918], "itemStyle": { "color": "#3259B8" } },
//     { "value": [261.19, 118688], "itemStyle": { "color": "#3259B8" } },
//     { "value": [260.91, 70906], "itemStyle": { "color": "#3259B8" } },
//     { "value": [260.61, 35609], "itemStyle": { "color": "#3259B8" } },
//     { "value": [260.34, 72982], "itemStyle": { "color": "#3259B8" } },
//     { "value": [259.97, 84626], "itemStyle": { "color": "#3259B8" } },
//     { "value": [259.74, 100101], "itemStyle": { "color": "#3259B8" } },
//     { "value": [259.57, 36599], "itemStyle": { "color": "#3259B8" } },
//     { "value": [259.25, 96433], "itemStyle": { "color": "#3259B8" } },
//     { "value": [258.5, 34817], "itemStyle": { "color": "#3259B8" } },
//     { "value": [257.83, 62057], "itemStyle": { "color": "#3259B8" } },
//     { "value": [257.55, 71831], "itemStyle": { "color": "#3259B8" } },
//     { "value": [257.4, 85471], "itemStyle": { "color": "#3259B8" } },
//     { "value": [257.35, 95202], "itemStyle": { "color": "#3259B8" } },
//     { "value": [256.87, 101219], "itemStyle": { "color": "#3259B8" } }
//   ]


const ClusteringAnalysis = () => {
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [textSegments, setTextSegments] = useState([0, 1]); // 默认两个文本段

  // 添加文本段
  const handleAddTextSegment = () => {
    setTextSegments(prev => [...prev, prev.length]);
  };

  // 删除文本段
  const handleDeleteTextSegment = (index: number) => {
    if (textSegments.length <= 2) {
      message.warning('至少需要保留两个文本段！');
      return;
    }
    setTextSegments(prev => prev.filter((_, i) => i !== index));
  };

  // 聚类分析处理
  const handleClusterAnalysis = () => {
    const formData = form.getFieldsValue();

    if (!formData.threshold || !formData.textSegments || formData.textSegments.length < 2) {
      message.error('请填写所有必填项！');
      return;
    }

    const emptySegments = formData.textSegments.filter((text: string) => !text || text.trim() === '');
    if (emptySegments.length > 0) {
      message.error('请填写所有文本段！');
      return;
    }

    console.log('=== 文本聚类分析信息 ===');
    console.log('阈值:', formData.threshold);
    console.log('文本段数量:', formData.textSegments.length);
    console.log('文本段内容:', formData.textSegments);
    console.log('分析时间:', new Date().toLocaleString());
    console.log('========================');

    setIsProcessing(true);

    setTimeout(() => {
      const segments = formData.textSegments;
      const threshold = formData.threshold;

      const clusters = [];
      for (let i = 0; i < segments.length; i++) {
        const cluster = {
          id: i + 1,
          texts: [segments[i]],
          similarity: Math.random() * (1 - threshold) + threshold
        };
        clusters.push(cluster);
      }

      const result = `
文本聚类分析结果：

分析参数：
• 相似度阈值：${threshold}
• 文本段数量：${segments.length}

聚类结果：
${clusters.map((cluster, index) => `
聚类 ${cluster.id}：
• 文本内容：${cluster.texts.join(', ')}
• 相似度：${(cluster.similarity * 100).toFixed(2)}%
• 文本数量：${cluster.texts.length}
`).join('')}

统计信息：
• 总聚类数：${clusters.length}
• 平均相似度：${(clusters.reduce((sum, c) => sum + c.similarity, 0) / clusters.length * 100).toFixed(2)}%
• 最大相似度：${(Math.max(...clusters.map(c => c.similarity)) * 100).toFixed(2)}%
• 最小相似度：${(Math.min(...clusters.map(c => c.similarity)) * 100).toFixed(2)}%

分析时间：${new Date().toLocaleString()}`;

      setAnalysisResult(result);
      setIsProcessing(false);
      message.success('聚类分析完成！');
    }, 3000);
  };

  return (
    <div >
      <div style={{ width: "100%", backgroundColor: '#fff', borderRadius: '4px', padding: '20px' }}>

        <Form form={form} layout="vertical" >
          <Form.Item
            label="阈值"
            name="threshold"
            initialValue={0.3}
            layout="horizontal"
            rules={[{ required: true, message: '请设置阈值！' }]}
          >
            {/* <div style={{ padding: '0 16px' }}> */}

            <Slider max={1} step={0.1} min={0} />
            {/* </div> */}
          </Form.Item>

          <Form.Item
            label="文本段"
            required
            style={{ marginBottom: '16px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {textSegments.map((_, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Form.Item
                    name={['textSegments', index]}
                    rules={[{ required: true, message: '输入或粘贴您想要聚类的文本' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <TextArea
                      placeholder={`输入或粘贴您想要聚类的文本...`}
                      style={{
                        height: '100px',
                        resize: 'none',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                    />
                  </Form.Item>
                  {textSegments.length > 2 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteTextSegment(index)}
                      style={{ marginTop: '8px' }}
                    />
                  )}
                </div>
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddTextSegment}
                style={{ width: '100%' }}
              >
                添加文本段
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleClusterAnalysis}
            loading={isProcessing}
            style={{ minWidth: '120px' }}
          >
            {isProcessing ? '分析中...' : '聚类分析'}
          </Button>
        </div>


        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ fontSize: '16px' }}>分析结果</Text>
        </div>
        <div style={{ width: '100%' }}>
          <TextArea
            value={analysisResult}
            placeholder="分析结果将在这里显示..."
            style={{
              width: '100%',
              minHeight: '300px',
              resize: 'none',
              fontSize: '14px',
              lineHeight: '1.6',
              border: 'none',
              background: 'transparent'
            }}
            readOnly
          />
          {/* <ScatterChart2  data={sampleData} /> */}
          {/* 修复类型错误，确保传递给ScatterChart的数据格式正确 */}
          {/* <ScatterChart scatterData={sampleData2 as { value: [number, number]; itemStyle?: { color: string } }[]} /> */}
          <ScatterChart scatterData={sampleData2 as [number, number][]} />
        </div>
      </div>
    </div>
  );
};

export default ClusteringAnalysis; 