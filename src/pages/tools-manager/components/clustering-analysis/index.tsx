import {
  Typography,
  Form,
  Input,
  Button,
  Slider,
  Space,
  message
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ScatterChart from './scatter-chat';
import sampleDataList from "./data.json"
import ClusterVisualization from './cluster-visualization';
import { useClusteringAnalysis } from '@/hooks/tools-hooks';
const { Text } = Typography;
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
const sampleData2 = sampleDataList


const generateData = () => {
  const clusters = [
    { x: 3, y: 3, count: 10, id: 0 },
    { x: 8, y: 8, count: 10, id: 1 },
    { x: 15, y: 15, count: 10, id: 2 }
  ];

  return clusters.flatMap(cluster =>
    Array.from({ length: cluster.count }, (_, idx) => ({
      x: +(cluster.x + (Math.random() * 2 - 1)).toFixed(2),
      y: +(cluster.y + (Math.random() * 2 - 1)).toFixed(2),
      cluster: cluster.id,
      label: `点${cluster.id + 1}-${idx + 1}`,
      value: (Math.random() * 100).toFixed(2)
    }))
  );
};
const ClusteringAnalysis = () => {
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState('');
  const [textSegments, setTextSegments] = useState([0, 1]); // 默认两个文本段

  const { mutateAsync: clusteringAnalysis, isPending: isProcessing } = useClusteringAnalysis();

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
  const handleClusterAnalysis = async () => {
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

    try {
      setAnalysisResult('');
      const result = await clusteringAnalysis({
        clusteringText: formData.textSegments,
        thresholdValue: formData.threshold
      });
      console.log(`result`, result);

      // 组装展示内容
      const analysisResult = `${result?.data?.map((cluster: any) => `聚类 ${cluster.clusteringNum}：
文本内容：${cluster.textContent}
聚类编号：${cluster.clusteringNum}

`).join('')}
`;

      setAnalysisResult(analysisResult);
      message.success('聚类分析完成！');
    } catch (err: any) {
      message.error('聚类分析失败！');
    }
  };
  const [clusterData] = useState(generateData());
  console.log(`clusterData`, clusterData);
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
          <ClusterVisualization data={clusterData} />

          {/* <ScatterChart scatterData={sampleData2 as [number, number][]} /> */}
        </div>
      </div>
    </div>
  );
};

export default ClusteringAnalysis; 