import {
  Form,
  Input,
  Button,
  message,
  Spin
} from 'antd';
import { useState, useMemo } from 'react';
import styles from './index.less';
import WordCloud from './word-cloud';
import { useKeywordExtraction } from '@/hooks/tools-hooks';
const { TextArea } = Input;
const getRandomValue = () => Math.floor(Math.random() * 81) + 20;

const KeywordExtraction = () => {
  const [form] = Form.useForm();
  const [keywordsResult, setKeywordsResult] = useState('');
  const { mutate: extractKeywords, status } = useKeywordExtraction();

  // 关键词提取处理
  const handleExtractKeywords = () => {
    const formData = form.getFieldsValue();
    if (!formData.textSegment || formData.textSegment.trim() === '') {
      message.error('请输入文本段！');
      return;
    }
    setKeywordsResult('');
    extractKeywords(formData.textSegment, {
      onSuccess: (data) => {
        setKeywordsResult(data.data);
        message.success('关键词提取完成！');
      },
      onError: (err: any) => {
        message.error(err?.message || '关键词提取失败');
      },
    });
  };

  const wordCloudData = useMemo(() => {
    if (Array.isArray(keywordsResult)) {
      return keywordsResult.map((name: string) => ({ name, value: getRandomValue() }));
    }
    return [];
  }, [keywordsResult]);//

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          height: 'calc(100vh - 200px)',
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }} >
          <Form form={form} layout="vertical" labelCol={{ style: { width: '100%' } }}  className={styles.myFulllabelForm}>
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
                    height: 'calc(100vh - 380px)',
                    minHeight:400,
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
              loading={status === 'pending'}
              style={{ minWidth: '120px' }}
            >
              {status === 'pending' ? '提取中...' : '提取关键词'}
            </Button>
          </div>
        </div>
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          height: 'calc(100vh - 200px)',
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          overflow:'auto',
          flex: 1
        }} >

          <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
            <span className='pl-2 text-[16px] font-bold'>关键词</span>
          </div>
          <Spin spinning={status === 'pending'} style={{ width: '100%' }}>
            <div style={{ width: '100%', padding: "20px" }}>
              <TextArea
                value={keywordsResult}
                placeholder="关键词提取结果将在这里显示..."
                style={{
                  width: '100%',
                  resize: 'none',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  border: 'none',
                  background: 'transparent'
                }}
                readOnly
              />
              <WordCloud data={wordCloudData} />
            </div>
          </Spin>
        </div>




      </div>

    </div>
  );
};

export default KeywordExtraction; 