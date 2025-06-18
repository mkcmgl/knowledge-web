import { 
  Typography, 
  Form, 
  Upload, 
  Button, 
  Card,
  message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

const YuyinText = () => {
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
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '800px' }}>
 
        
        <Card style={{ marginBottom: '24px' }}>
          <Form form={form} layout="vertical">
            <Form.Item 
              label="语音" 
              required
            >
              <div style={{ width: '100%' }}>
                {!uploadedFile ? (
                  <Upload {...uploadProps}>
                    <Button 
                      icon={<UploadOutlined />} 
                      style={{ width: '100%', height: '120px', borderStyle: 'dashed' }}
                    >
                      <div>
                        <p>点击或拖拽音频文件到此区域上传</p>
                        <p style={{ fontSize: '12px', color: '#999' }}>
                          支持 MP3、M4A、WMA、AAC、FLAC、AC3、M4R、APE、OGG、WAV 格式，文件大小不超过 100MB
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
          </Form>
        </Card>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={handleTranscribe}
            loading={isProcessing}
            disabled={!uploadedFile}
            style={{ minWidth: '120px' }}
          >
            {isProcessing ? '转换中...' : '语音转文字'}
          </Button>
        </div>

        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ fontSize: '16px' }}>文字</Text>
          </div>
          <div style={{ width: '100%' }}>
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
        </Card>
      </div>
    </div>
  );
};

export default YuyinText; 