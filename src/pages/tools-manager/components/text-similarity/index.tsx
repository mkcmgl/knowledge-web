import {
  Form,
  Input,
  Button,
  message
} from 'antd';
import { useState } from 'react';
import { useTextSimilarity } from '@/hooks/tools-hooks';
import styles from './index.less';
const { TextArea } = Input;

const TextSimilarity = () => {
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState('');
  const { mutateAsync: calcSimilarity, isPending: isProcessing } = useTextSimilarity();

  // 文本相似度计算处理
  const handleSimilarityCalculation = async () => {
    const formData = form.getFieldsValue();
    if (!formData.originalText || !formData.compareText) {
      message.error('请填写原始文本和比对文本！');
      return;
    }
    try {
      setAnalysisResult('');
      const result = await calcSimilarity({ sourceFile: formData.originalText, targetFile: formData.compareText });
      console.log('相似度计算结果:', result);
      
      if (result && result.data.similarity !== undefined) {
        const similarityPercentage = result.data.similarity.toFixed(2);
        const res = (
          <span>
            相似度：
            <span style={{ color: '#F56C6C', fontSize: 20, fontWeight: 600 }}>
              {similarityPercentage}%
            </span>
          </span>
        );
        setAnalysisResult(res);
        message.success('相似度计算完成！');
      } else {
        setAnalysisResult('无分析结果');
      }
    } catch (err: any) {
      message.error(err.message || '相似度计算失败！');
    }
  };

  return (
    <div style={{}}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* 左侧原始文本输入 */}
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
          <Form className={styles.myFulllabelForm} form={form} layout="vertical" labelCol={{ style: { width: '100%' } }} style={{ height: '100%' }}>

            <Form.Item
              label={
                <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px', boxSizing: 'border-box' }}>
                  <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <i style={{ height: 20, borderLeft: '4px solid #0C7CFF', borderRadius: '4px', marginRight: 8 }}></i>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>原始文本</span>
                    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </span>
                </div>
              }
              name="originalText"
              rules={[{ required: true, message: '请输入原始文本！' }]}
              required={false}

              style={{ flex: 1, marginBottom: 0, paddingBottom: 8 }}
            >
              <div style={{ padding: "10px 20px" }}>
                <TextArea
                  placeholder="请输入原始文本..."
                  style={{
                    height: '400px',
                    resize: 'none',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </div>

            </Form.Item>
          </Form>
        </div>

        {/* 右侧比对文本输入 */}
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
          <Form form={form} className={styles.myFulllabelForm} layout="vertical" style={{ height: '450px' }}>
            <Form.Item
              label={
                <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px', boxSizing: 'border-box' }}>
                  <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <i style={{ height: 20, borderLeft: '4px solid #0C7CFF', borderRadius: '4px', marginRight: 8 }}></i>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>比对文本</span>
                    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </span>
                </div>
              }
              name="compareText"
              rules={[{ required: true, message: '请输入比对文本！' }]}
              required={false}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <div style={{ padding: "10px 20px" }}>
                <TextArea
                  placeholder="请输入比对文本..."
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
          {/* 相似度计算按钮 */}
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
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
        </div>
      </div>




      {/* 分析结果显示 */}
      <div style={{ marginTop: '24px' }}>
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          border: '1px solid #f0f0f0'
        }}>

          <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
            <span className='pl-2 text-[16px] font-bold'>分析结果</span>
          </div>
          <div style={{ width: '100%' }}>
            {/* 用div替换TextArea以支持ReactNode */}
            <div
              style={{
                width: '100%',
                minHeight: '200px',
                fontSize: '14px',
                lineHeight: '1.6',
                border: 'none',
                background: 'transparent',
                padding: '12px 8px',
                color: '#1D2129'
              }}
            >
              {analysisResult}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSimilarity; 