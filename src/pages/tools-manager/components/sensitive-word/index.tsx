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
const { Title, Text } = Typography;
const { TextArea } = Input;

const SensitiveWord = () => {
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
    <div >

      <div style={{ display: 'flex', gap: '20px' }} >

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
                  placeholder="请输入需要脱敏处理的文本..."
                  style={{
                    height: '350px',
                    resize: 'none',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </div>

            </Form.Item>
          </Form>
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
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



        </div >
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
            <span className='pl-2 text-[16px] font-bold'>脱敏结果</span>
          </div>
          <div style={{ width: '100%', padding: "20px" }}>
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
          <div>

          </div>

        </div>
      </div >
    </div >
  );
};

export default SensitiveWord; 