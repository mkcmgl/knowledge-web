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

const { Title, Text } = Typography;
const { TextArea } = Input;

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
      <div style={{ width: "100%", backgroundColor: '#fff', borderRadius: '4px',padding:'20px'  }}>

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
          </div>
      </div>
    </div>
  );
};

export default ClusteringAnalysis; 