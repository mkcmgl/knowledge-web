import { 
  Typography, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  message
} from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

const textSimilarity = () => {
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 文本相似度计算处理
  const handleSimilarityCalculation = () => {
    // 获取表单数据
    const formData = form.getFieldsValue();
    
    if (!formData.originalText || !formData.compareText) {
      message.error('请填写原始文本和比对文本！');
      return;
    }

    // 控制台输出配置信息
    console.log('=== 文本相似度计算信息 ===');
    console.log('原始文本:', formData.originalText);
    console.log('比对文本:', formData.compareText);
    console.log('计算时间:', new Date().toLocaleString());
    console.log('========================');
    
    setIsProcessing(true);
    
    // 模拟相似度计算过程
    setTimeout(() => {
      // 简单的相似度计算示例（这里只是演示）
      const originalWords = formData.originalText.split(/\s+/).filter((word: string) => word.length > 0);
      const compareWords = formData.compareText.split(/\s+/).filter((word: string) => word.length > 0);
      
      const intersection = originalWords.filter((word: string) => compareWords.includes(word));
      const union = [...new Set([...originalWords, ...compareWords])];
      
      const jaccardSimilarity = intersection.length / union.length;
      const cosineSimilarity = intersection.length / Math.sqrt(originalWords.length * compareWords.length);
      
      const result = `
文本相似度分析结果：

原始文本：
${formData.originalText}

比对文本：
${formData.compareText}

分析结果：
• Jaccard相似度：${(jaccardSimilarity * 100).toFixed(2)}%
• 余弦相似度：${(cosineSimilarity * 100).toFixed(2)}%
• 共同词汇数量：${intersection.length}
• 原始文本词汇数：${originalWords.length}
• 比对文本词汇数：${compareWords.length}
• 词汇交集：${intersection.join(', ')}

计算时间：${new Date().toLocaleString()}`;

      setAnalysisResult(result);
      setIsProcessing(false);
      message.success('相似度计算完成！');
    }, 2000);
  };

  return (
    <div style={{ padding: '20px' }}>
      
      <Row gutter={24} style={{ marginTop: '20px' }}>
        {/* 左侧原始文本输入 */}
        <Col span={12}>
          <div style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #f0f0f0',
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Form form={form} layout="vertical" style={{ height: '100%' }}>
              <Form.Item 
                label="原始文本" 
                name="originalText"
                rules={[{ required: true, message: '请输入原始文本！' }]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <TextArea
                  placeholder="请输入原始文本..."
                  style={{ 
                    height: '300px', 
                    resize: 'none',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </Col>

        {/* 右侧比对文本输入 */}
        <Col span={12}>
          <div style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid #f0f0f0',
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Form form={form} layout="vertical" style={{ height: '100%' }}>
              <Form.Item 
                label="比对文本" 
                name="compareText"
                rules={[{ required: true, message: '请输入比对文本！' }]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <TextArea
                  placeholder="请输入比对文本..."
                  style={{ 
                    height: '300px', 
                    resize: 'none',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>

      {/* 相似度计算按钮 */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button 
          type="primary" 
          size="large"
          onClick={handleSimilarityCalculation}
          loading={isProcessing}
          style={{ minWidth: '120px' }}
        >
          {isProcessing ? '计算中...' : '相似度计算'}
        </Button>
      </div>

      {/* 分析结果显示 */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ fontSize: '16px' }}>分析结果</Text>
          </div>
          <div style={{ width: '100%' }}>
            <TextArea
              value={analysisResult}
              placeholder="分析结果将在这里显示..."
              style={{ 
                width: '100%',
                minHeight: '200px',
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
    </div>
  );
};

export default textSimilarity; 