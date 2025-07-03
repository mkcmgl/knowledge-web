import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  message
} from 'antd';
import { useState } from 'react';
import styles from './index.less';
import WordCloud from './word-cloud';
const { Title, Text } = Typography;
const { TextArea } = Input;
const testData = [
  { name: "React", value: 100 },
  { name: "TypeScript", value: 85 },
  { name: "JavaScript", value: 90 },
  { name: "前端开发", value: 78 },
  { name: "组件化", value: 65 },
  { name: "Hooks", value: 70 },
  { name: "ECharts", value: 60 },
  { name: "数据可视化", value: 75 },
  { name: "CSS", value: 55 },
  { name: "响应式设计", value: 50 },
  { name: "Webpack", value: 45 },
  { name: "Node.js", value: 40 },
  { name: "性能优化", value: 35 },
  { name: "虚拟DOM", value: 30 },
  { name: "状态管理", value: 25 }
];

const KeywordExtraction = () => {
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
        .sort(([, a], [, b]) => b - a)
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
    <div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }} >
          <Form form={form} layout="vertical" labelCol={{ style: { width: '100%' } }} style={{ height: '520px' }} className={styles.myFulllabelForm}>
            <Form.Item
              label={
                <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px', boxSizing: 'border-box' }}>
                  <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <i style={{ height: 20, borderLeft: '4px solid #0C7CFF', borderRadius: '4px', marginRight: 8 }}></i>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>文本段</span>
                    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </span>
                </div>
              }
              name="textSegment"
              rules={[{ message: '请输入文本段！' }]}
            >
              <div style={{ padding: "10px 20px" }} >
                <TextArea
                  placeholder="请输入需要提取关键词的文本..."
                  style={{
                    height: '420px',
                    resize: 'none',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </div>

            </Form.Item>
          </Form>

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
        </div>
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }} >

          <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
            <span className='pl-2 text-[16px] font-bold'>关键词</span>
          </div>
          <div style={{ width: '100%', padding: "20px"  }}>
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
        </div>
        <WordCloud data={testData} />

              

      </div>
    </div>
  );
};

export default KeywordExtraction; 