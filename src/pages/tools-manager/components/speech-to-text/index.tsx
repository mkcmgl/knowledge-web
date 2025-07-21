import {
  Typography,
  Form,
  Upload,
  Button,
  message
} from 'antd';
import { useState } from 'react';
import styles from './index.less';
import { useSpeechToText } from '@/hooks/tools-hooks';
import noData from "@/assets/svg/noData.svg"
const { Text } = Typography;

const SpeechToText = () => {
  const [form] = Form.useForm();
  const [transcriptionResult, setTranscriptionResult] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { mutateAsync: speechToText, isPending: isProcessing } = useSpeechToText();

  // 文件上传配置
  const uploadProps = {
    accept: '.mp3,.m4a,.wma,.aac,.flac,.ac3,.m4r,.ape,.ogg,.wav',
    maxSize: 10 * 1024 * 1024, // 10MB
    beforeUpload: (file: File) => {
      const isValidFormat = /\.(mp3|m4a|wma|aac|flac|ac3|m4r|ape|ogg|wav)$/i.test(file.name);
      const isValidSize = file.size <= 10 * 1024 * 1024;

      if (!isValidFormat) {
        message.error('只支持 MP3、M4A、WMA、AAC、FLAC、AC3、M4R、APE、OGG、WAV 格式的音频文件！');
        return false;
      }

      if (!isValidSize) {
        message.error('音频文件大小不能超过 10MB！');
        return false;
      }

      setUploadedFile(file);
      message.success('音频文件上传成功！');
      return false; // 阻止自动上传
    },
    showUploadList: false,
  };

  // 语音转文字处理
  const handleTranscribe = async () => {
    if (!uploadedFile) {
      message.error('请先上传音频文件！');
      return;
    }
    try {
      setTranscriptionResult('');
      const result = await speechToText(uploadedFile);
      // 组装展示内容
      //       const transcription = `
      // 转换结果：
      // ${result?.transcription || result?.data || JSON.stringify(result)}
      // 音频文件信息：
      // • 文件名：${uploadedFile.name}
      // • 文件大小：${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
      // • 文件类型：${uploadedFile.type}
      // `;
      setTranscriptionResult(result?.transcription || result?.data || JSON.stringify(result));
      message.success('语音转文字完成！');
    } catch (err: any) {
      message.error('语音转文字失败！');
    }
  };
  const handleDel = () => {
    setUploadedFile(null);
    setTranscriptionResult('');

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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="48" height="48" viewBox="0 0 48 48">
                          <defs>
                            <clipPath id="master_svg0_53_7929">
                              <rect x="0" y="0" width="48" height="48" rx="0" />
                            </clipPath>
                          </defs>
                          <g clipPath="url(#master_svg0_53_7929)">
                            <g>
                              <path d="M24.828,10L42,10C43.1046,10,44,10.895430000000001,44,12L44,40C44,41.1046,43.1046,42,42,42L6,42C4.895431,42,4,41.1046,4,40L4,8C4,6.895431,4.895431,6,6,6L20.828,6L24.828,10ZM22,26.1C19.1652,25.5213,16.4324,27.4622,16.045,30.3295C15.6576,33.1967,17.7772,35.7932,20.664,35.987700000000004C23.5513,36.1816,26,33.892700000000005,26,31L26,22L32,22L32,18L22,18L22,26.1Z" fill="#0689FF" fillOpacity="1" />
                            </g>
                          </g>
                        </svg>
                        <p style={{ color: " #1D2129", fontSize: '16px', marginTop: "2px" }}>上传音频</p>
                        <p style={{ fontSize: '12px', color: ' rgba(29, 33, 41, 0.55)', marginTop: "10px" }}>
                          支持 MP3、M4A、WMA、AAC、FLAC、AC3、
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(29, 33, 41, 0.55)' }}>
                          M4R、APE、OGG、WAV 格式
                        </p>
                        <p style={{ fontSize: '12px', color: '#999' }}>
                         文件大小不超过 10MB
                        </p>
                      </div>
                    </Button>
                  </Upload>
                ) : (
                  <div style={{
                    border: '1px solid  #E5E6EB',
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
                        onClick={handleDel}
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
                  color="primary"
                  onClick={handleDel}
                  loading={isProcessing}
                  style={{ minWidth: '120px' }}
                >
                  {/* {isProcessing ? '转换中...' : '重新上传'} */}
                  重新上传
                </Button>
                <Button
                  type="primary"
                  onClick={handleTranscribe}
                  loading={isProcessing}
                  style={{ minWidth: '120px', marginLeft: 16 }}
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
          <div style={{ flex: 1, overflow: 'auto', }}>
            {transcriptionResult ? (
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
                  padding: '20px',
                  background: 'transparent',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: '#1D2129'
                }}
                readOnly
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', width: '100%', }}>
                <img src={noData} alt="无数据" style={{ width: 100, marginBottom: 16 }} />
                <div style={{ color: 'rgba(29, 33, 41, 0.55)', fontSize: 14 }}>拖入或粘贴音频进行转换后，显示相关结果</div>
              </div>

            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText; 