import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Space,
  Typography
} from 'antd';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Text } = Typography;
const { TextArea } = Input;

const VideoUnderstanding = () => {
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // 上传配置
  const uploadProps = {
    beforeUpload: (file: any) => {
      const allowedTypes = [
        'video/mp4',
        'video/avi',
        'video/quicktime', // mov
        'video/x-matroska', // mkv
        'video/x-ms-wmv',
        'video/msvideo',
        'video/x-msvideo',
      ];
      if (!allowedTypes.includes(file.type)) {
        message.error('仅支持MP4、AVI、MOV、MKV、WMV格式的视频！');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('视频大小不能超过10MB！');
        return false;
      }
      setUploadedFiles(prev => [...prev, file]);
      return false; // 阻止自动上传
    },
    showUploadList: false,
    accept: '.mp4,.avi,.mov,.mkv,.wmv'
  };

  // 删除文件
  const handleDeleteFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 视频理解处理
  const handleVideoUnderstanding = () => {
    const formData = form.getFieldsValue();
    if (uploadedFiles.length === 0) {
      message.error('请先上传视频！');
      return;
    }
    if (!formData.question) {
      message.error('请输入问题！');
      return;
    }
    console.log('=== 视频理解信息 ===');
    console.log('上传的视频:', uploadedFiles.map(f => f.name));
    console.log('问题:', formData.question);
    console.log('处理时间:', new Date().toLocaleString());
    console.log('==================');
    setIsProcessing(true);
    setTimeout(() => {
      const result = `
视频理解分析结果：

上传视频：
${uploadedFiles.map(f => `• ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}

问题：
${formData.question}

理解结果：
• 视频类型：动态场景视频
• 主要内容：包含多个动作和场景切换
• 语义描述：视频内容丰富，包含多种元素
• 关键特征：画面流畅，内容连贯
• 理解准确度：88%

详细分析：
基于您的问题"${formData.question}"，AI对视频进行了深度理解分析。
视频中包含了多种动态元素，AI能够识别出主要内容和场景特征。
通过计算机视觉与视频分析技术，系统能够理解视频的内容、结构和语义信息。

处理时间：${new Date().toLocaleString()}`;
      setAnalysisResult(result);
      setIsProcessing(false);
      message.success('视频理解完成！');
    }, 3000);
  };

  return (
    <div style={{}}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* 左侧视频上传 */}
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          height: '500px',
          overflow: 'auto',
          flex: 1
        }}>
          <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
            <span className='pl-2 text-[16px] font-bold'>上传视频</span>
          </div>
          <Space direction="vertical" style={{ width: '100%', height: 'calc(100% - 40px)', justifyContent: 'center', alignItems: 'center' }}>
            <Form.Item style={{ width: '100%', textAlign: 'center' }}>
              <Space direction="vertical">
                {/* 上传按钮 - 始终显示 */}
                <Upload {...uploadProps}>
                  <Button
                    style={{ width: '300px', height: '200px', borderStyle: 'dashed' }}
                  >
                    <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="48" height="48" viewBox="0 0 48 48">
                        <defs>
                          <clipPath id="master_svg0_23_8218">
                            <rect x="0" y="0" width="48" height="48" rx="0" />
                          </clipPath>
                        </defs>
                        <g clipPath="url(#master_svg0_23_8218)">
                          <g>
                            <path d="M15.72000244140625,20.64041015625C17.52000244140625,20.64041015625,19.08000244140625,19.20041015625,19.08000244140625,17.28041015625C19.08000244140625,15.48041015625,17.64000244140625,13.92041015625,15.72000244140625,13.92041015625C13.92000244140625,13.92041015625,12.36000244140625,15.36041015625,12.36000244140625,17.28041015625C12.48000244140625,19.20041015625,13.92000244140625,20.64041015625,15.72000244140625,20.64041015625ZM30.60000244140625,18.60041015625L20.880002441406248,32.400410156250004L15.84000244140625,25.32041015625L7.44000244140625,37.20041015625L40.44000244140625,37.20041015625L30.60000244140625,18.60041015625Z" fill="#0689FF" fillOpacity="1" />
                          </g>
                          <g>
                            <path d="M43.799989013671876,5.0400390625L4.199989013671875,5.0400390625C3.2399890136718748,5.0400390625,2.519989013671875,5.7600390625,2.519989013671875,6.7200390625L2.519989013671875,41.4000390625C2.519989013671875,42.3600390625,3.2399890136718748,43.0800390625,4.199989013671875,43.0800390625L43.799989013671876,43.0800390625C44.75998901367188,43.0800390625,45.479989013671876,42.3600390625,45.479989013671876,41.4000390625L45.479989013671876,6.7200390625C45.479989013671876,5.7600390625,44.75998901367188,5.0400390625,43.799989013671876,5.0400390625ZM42.119989013671876,39.7200390625L5.879989013671874,39.7200390625L5.879989013671874,8.2800390625L42.239989013671874,8.2800390625L42.239989013671874,39.7200390625L42.119989013671876,39.7200390625Z" fill="#0689FF" fillOpacity="1" />
                          </g>
                        </g>
                      </svg>
                      <p className='mt-2' style={{ fontSize: '16px' }}>点击或将视频拖拽到这里上传</p>
                      <p style={{ fontSize: '14px', color: '#999', marginTop: "10px" }}>
                        支持 MP4、AVI、MOV、MKV、WMV 格式，
                      </p>
                      <p style={{ fontSize: '12px', color: '#999' }}>
                        视频大小不超过 10MB
                      </p>
                    </div>
                  </Button>
                </Upload>
                {/* 已上传文件列表 */}
                {uploadedFiles.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>已上传文件 ({uploadedFiles.length})：</Text>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          border: '1px dashed #d9d9d9',
                          borderRadius: '6px',
                          padding: '12px',
                          background: '#fafafa',
                          marginTop: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <Text strong>{file.name}</Text>
                            <br />
                            <Text type="secondary">
                              大小: {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Text>
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteFile(index)}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Space>
            </Form.Item>
          </Space>
        </div>
        {/* 右侧问题输入 */}
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
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>输入问题</span>
                    <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                  </span>
                </div>
              }
              name="question"
              rules={[{ required: true, message: '请输入问题！' }]}
              required={false}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <div style={{ padding: "10px 20px" }}>
                <TextArea
                  placeholder="请输入您想了解的问题，例如：这个视频讲了什么？视频的主要内容是什么？..."
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
          {/* 视频理解按钮 */}
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <Button
              type="primary"
              size="large"
              onClick={handleVideoUnderstanding}
              loading={isProcessing}
              style={{ minWidth: '120px' }}
            >
              {isProcessing ? '理解中...' : '视频理解'}
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
            <span className='pl-2 text-[16px] font-bold'>理解结果</span>
          </div>
          <div style={{ width: '100%' }}>
            <TextArea
              value={analysisResult}
              placeholder="理解结果将在这里显示..."
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

export default VideoUnderstanding; 