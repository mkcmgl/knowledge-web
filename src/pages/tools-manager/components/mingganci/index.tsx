import { 
  Typography, 
  Form, 
  Input, 
  Button, 
  Card,
  message
} from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Mingganci = () => {
  const [form] = Form.useForm();
  const [desensitizedResult, setDesensitizedResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 脱敏处理
  const handleDesensitize = () => {
    const formData = form.getFieldsValue();
    
    if (!formData.textSegment || formData.textSegment.trim() === '') {
      message.error('请输入文本段！');
      return;
    }

    console.log('=== 敏感词处理信息 ===');
    console.log('原始文本:', formData.textSegment);
    console.log('处理时间:', new Date().toLocaleString());
    console.log('========================');
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const originalText = formData.textSegment;
      
      // 模拟敏感词检测和替换
      const sensitiveWords = ['敏感', '违规', '违法', '色情', '暴力', '政治', '赌博', '毒品'];
      let processedText = originalText;
      let detectedWords: string[] = [];
      
      sensitiveWords.forEach(word => {
        if (originalText.includes(word)) {
          detectedWords.push(word);
          const regex = new RegExp(word, 'g');
          processedText = processedText.replace(regex, '*'.repeat(word.length));
        }
      });
      
      const result = `
敏感词处理结果：

原始文本：
${originalText}

处理结果：
${processedText}

检测信息：
• 检测到的敏感词：${detectedWords.length > 0 ? detectedWords.join(', ') : '无'}
• 敏感词数量：${detectedWords.length}
• 替换字符：*
• 处理方式：字符替换

处理时间：${new Date().toLocaleString()}`;

      setDesensitizedResult(result);
      setIsProcessing(false);
      message.success('脱敏处理完成！');
    }, 2000);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '800px' }}>
  
        
        <Card style={{ marginBottom: '24px' }}>
          <Form form={form} layout="vertical">
            <Form.Item 
              label="文本段" 
              name="textSegment"
              rules={[{ required: true, message: '请输入文本段！' }]}
            >
              <TextArea
                placeholder="请输入需要脱敏处理的文本..."
                style={{ 
                  height: '100px', 
                  resize: 'none',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
              />
            </Form.Item>
          </Form>
        </Card>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={handleDesensitize}
            loading={isProcessing}
            style={{ minWidth: '120px' }}
          >
            {isProcessing ? '处理中...' : '脱敏处理'}
          </Button>
        </div>

        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ fontSize: '16px' }}>脱敏结果</Text>
          </div>
          <div style={{ width: '100%' }}>
            <TextArea
              value={desensitizedResult}
              placeholder="脱敏结果将在这里显示..."
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
        </Card>
      </div>
    </div>
  );
};

export default Mingganci; 