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

const Guanjianci = () => {
  const [form] = Form.useForm();
  const [keywordsResult, setKeywordsResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 关键词提取处理
  const handleExtractKeywords = () => {
    const formData = form.getFieldsValue();
    
    if (!formData.textSegment || formData.textSegment.trim() === '') {
      message.error('请输入文本段！');
      return;
    }

    console.log('=== 关键词提取信息 ===');
    console.log('原始文本:', formData.textSegment);
    console.log('提取时间:', new Date().toLocaleString());
    console.log('========================');
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const originalText = formData.textSegment;
      
      // 模拟关键词提取算法
      const words = originalText.split(/[\s,，。！？；：""''（）【】、]+/).filter(word => word.length > 1);
      const wordCount: { [key: string]: number } = {};
      
      // 统计词频
      words.forEach((word: string) => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
      
      // 按频率排序，取前10个作为关键词
      const sortedWords = Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      // 计算TF-IDF权重（简化版）
      const totalWords = words.length;
      const keywords = sortedWords.map(([word, count], index) => ({
        word,
        frequency: count,
        tf: count / totalWords,
        weight: (count / totalWords) * Math.log(10 / (index + 1))
      }));
      
      const result = `
关键词提取结果：

原始文本：
${originalText}

提取的关键词：
${keywords.map((kw, index) => `
${index + 1}. ${kw.word}
   • 出现频率：${kw.frequency} 次
   • TF值：${(kw.tf * 100).toFixed(2)}%
   • 权重：${kw.weight.toFixed(4)}
`).join('')}

统计信息：
• 总词汇数：${totalWords}
• 提取关键词数：${keywords.length}
• 最高频率词：${keywords[0]?.word} (${keywords[0]?.frequency} 次)
• 平均权重：${(keywords.reduce((sum, kw) => sum + kw.weight, 0) / keywords.length).toFixed(4)}

提取算法：TF-IDF + 词频统计
提取时间：${new Date().toLocaleString()}`;

      setKeywordsResult(result);
      setIsProcessing(false);
      message.success('关键词提取完成！');
    }, 2500);
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
                placeholder="请输入需要提取关键词的文本..."
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
            onClick={handleExtractKeywords}
            loading={isProcessing}
            style={{ minWidth: '120px' }}
          >
            {isProcessing ? '提取中...' : '提取关键词'}
          </Button>
        </div>

        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ fontSize: '16px' }}>关键词</Text>
          </div>
          <div style={{ width: '100%' }}>
            <TextArea
              value={keywordsResult}
              placeholder="关键词提取结果将在这里显示..."
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

export default Guanjianci; 