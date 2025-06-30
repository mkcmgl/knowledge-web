import {
  Typography,
  Form,
  Upload,
  Button,
  Card,
  message,
  Space
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './index.less';
const { Title, Text } = Typography;

const SpeechToText = () => {
  const [form] = Form.useForm();
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // 文件上传配置
  const uploadProps = {
    accept: '.mp3,.m4a,.wma,.aac,.flac,.ac3,.m4r,.ape,.ogg,.wav',
    maxSize: 100 * 1024 * 1024, // 100MB
    beforeUpload: (file: File) => {
      const isValidFormat = /\.(mp3|m4a|wma|aac|flac|ac3|m4r|ape|ogg|wav)$/i.test(file.name);
      const isValidSize = file.size <= 100 * 1024 * 1024;

      if (!isValidFormat) {
        message.error('只支持 MP3、M4A、WMA、AAC、FLAC、AC3、M4R、APE、OGG、WAV 格式的音频文件！');
        return false;
      }

      if (!isValidSize) {
        message.error('音频文件大小不能超过 100MB！');
        return false;
      }

      setUploadedFile(file);
      message.success('音频文件上传成功！');
      return false; // 阻止自动上传
    },
    showUploadList: false,
  };

  // 语音转文字处理
  const handleTranscribe = () => {
    if (!uploadedFile) {
      message.error('请先上传音频文件！');
      return;
    }

    console.log('=== 语音转文字信息 ===');
    console.log('音频文件:', uploadedFile.name);
    console.log('文件大小:', (uploadedFile.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('文件类型:', uploadedFile.type);
    console.log('转换时间:', new Date().toLocaleString());
    console.log('========================');

    setIsProcessing(true);

    setTimeout(() => {
      // 模拟语音转文字结果
      const transcription = `
语音转文字结果：

音频文件信息：
• 文件名：${uploadedFile.name}
• 文件大小：${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
• 文件类型：${uploadedFile.type}

转换结果：
这是一个示例的语音转文字结果。
支持中文和英文混合识别。
语音识别准确率较高，能够识别多种口音和方言。

时间戳信息：
00:00:00 - 这是一个示例的语音转文字结果。
00:00:03 - 支持中文和英文混合识别。
00:00:06 - 语音识别准确率较高，能够识别多种口音和方言。

识别统计：
• 总时长：约 10 秒
• 识别字数：45 字
• 识别准确率：95.2%
• 语言类型：中文 + 英文

转换时间：${new Date().toLocaleString()}`;

      setTranscriptionResult(transcription);
      setIsProcessing(false);
      message.success('语音转文字完成！');
    }, 4000);
  };

  return (
    <div >
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
          <Form form={form} layout="vertical" labelCol={{ style: { width: '100%' } }} style={{ height: '520px' }} className={styles.myFulllabelForm}>
            <Form.Item
              label={
                <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px', boxSizing: 'border-box' }}>
                  <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <i style={{ height: 20, borderLeft: '4px solid #0C7CFF', borderRadius: '4px', marginRight: 8 }}></i>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>语音</span>
                    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </span>
                </div>
              }
              style={{ width: '100%', textAlign: 'center' }}
            >
              <div style={{ width: '100%', marginTop: 10 }}>
                {!uploadedFile ? (
                  <Upload {...uploadProps}>
                    <Button
                      style={{ width: '300px', height: '200px', borderStyle: 'dashed' }}
                    >
                      <div className='flex flex-col items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="48" height="48" viewBox="0 0 48 48">
                          <defs>
                            <clipPath id="master_svg0_53_7929">
                              <rect x="0" y="0" width="48" height="48" rx="0" />
                            </clipPath>
                          </defs>
                          <g clipPath="url(#master_svg0_53_7929)">
                            <g>
                              <path d="M24.828,10L42,10C43.1046,10,44,10.895430000000001,44,12L44,40C44,41.1046,43.1046,42,42,42L6,42C4.895431,42,4,41.1046,4,40L4,8C4,6.895431,4.895431,6,6,6L20.828,6L24.828,10ZM22,26.1C19.1652,25.5213,16.4324,27.4622,16.045,30.3295C15.6576,33.1967,17.7772,35.7932,20.664,35.987700000000004C23.5513,36.1816,26,33.892700000000005,26,31L26,22L32,22L32,18L22,18L22,26.1Z" fill="#0689FF" fillOpacity="1" style={{ mixBlendMode: "passthrough" }} />
                            </g>
                          </g>
                        </svg>
                        <p style={{ color:" #1D2129",fontSize: '16px', marginTop: "2px" }}>上传音频</p>
                        <p style={{ fontSize: '12px', color: ' rgba(29, 33, 41, 0.55)', marginTop: "10px" }}>
                          支持 MP3、M4A、WMA、AAC、FLAC、AC3、
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(29, 33, 41, 0.55)' }}>
                          M4R、APE、OGG、WAV 格式
                        </p>
                      </div>
                    </Button>
                  </Upload>
                ) : (
                  <div style={{
                    border: '1px dashed #d9d9d9',
                    borderRadius: '6px',
                    padding: '16px',
                    background: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <Text strong>{uploadedFile.name}</Text>
                        <br />
                        <Text type="secondary">
                          大小: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Text>
                      </div>
                      <Button
                        type="text"
                        danger
                        onClick={() => setUploadedFile(null)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Form.Item>
            {uploadedFile && (
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleTranscribe}
                  loading={isProcessing}
                  style={{ minWidth: '120px' }}
                >
                  {isProcessing ? '转换中...' : '语音转文字'}
                </Button>
              </div>
            )}
          </Form>



        </div>



        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>

          <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
            <span className='pl-2 text-[16px] font-bold'>文字</span>
          </div>
          <div style={{ width: '100%',padding:"15px 20px" }}>
            <textarea
              value={transcriptionResult}
              placeholder="语音转文字结果将在这里显示..."
              style={{
                width: '100%',
                minHeight: '300px',
                resize: 'none',
                fontSize: '14px',
                lineHeight: '1.6',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText; 