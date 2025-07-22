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
import noData from "@/assets/svg/noData.svg"
// import VideoPlayer from "./video-player"
import VideoSeek from './video-seek';
import { useVideoUnderstand } from '@/hooks/tools-hooks';
const { Text } = Typography;

const { TextArea } = Input;

const VideoUnderstanding = () => {
  const [form] = Form.useForm();
  const [analysisResult, setAnalysisResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const videoUnderstandMutation = useVideoUnderstand();

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
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('视频大小不能超过50MB！');
        return false;
      }
      // 只保留一个文件，上传新视频时替换
      setUploadedFiles([file]);
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
  const handleVideoUnderstanding = async () => {
    const formData = form.getFieldsValue();
    if (uploadedFiles.length === 0) {
      message.error('请先上传视频！');
      return;
    }
    if (!formData.question) {
      message.error('请输入问题！');
      return;
    }
    setIsProcessing(true);
    try {
      // 只取第一个视频文件
      const file = uploadedFiles[0];
      const result = await videoUnderstandMutation.mutateAsync({ file, desQuestion: formData.question });
      setAnalysisResult(result.data || '');
      message.success('视频理解完成！');
    } catch (e: any) {
      message.error(e?.message || '视频理解失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{}}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* 左侧：上传视频和输入问题 */}
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          height: 'auto',
          minHeight: '500px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
          <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px', boxSizing: 'border-box' }}>
            <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <i style={{ height: 20, borderLeft: '4px solid #0C7CFF', borderRadius: '4px', marginRight: 8 }}></i>
              <span style={{ fontSize: 16, fontWeight: 'bold' }}>视频信息</span>
            </span>
          </div>
          <Form form={form} className={styles.myFulllabelForm} layout="vertical" style={{ height: '100%' }}>
            {/* 上传视频 */}
            <Form.Item label='上传视频:' name='video' rules={[{ required: true, message: '请上传视频！' }]} style={{ padding: 20 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload className={styles.myFullUpload} {...uploadProps}>
                  <Button
                    style={{ width: '100%', height: '200px', borderStyle: 'dashed' }}
                  >
                    <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="48" height="48" viewBox="0 0 48 48">
                        <defs>
                          <clipPath id="master_svg0_130_16615">
                            <rect x="0" y="0" width="48" height="48" rx="0" />
                          </clipPath>
                        </defs>
                        <g clipPath="url(#master_svg0_130_16615)">
                          <g>
                            <path d="M19.383014892578124,31.26278125L29.859014892578124,25.29578125C30.822014892578125,24.74378125,30.822014892578125,23.17478125,29.859014892578124,22.62578125L19.383014892578124,16.65578125C18.510014892578127,16.16078125,17.487014892578124,16.877781249999998,17.487014892578124,17.990781249999998L17.487014892578124,29.93078125C17.487014892578124,31.04078125,18.510014892578127,31.75778125,19.383014892578124,31.26278125ZM41.07001489257812,6.05078125L6.999014892578125,6.05078125C4.845014892578125,6.05078125,3.084014892578125,8.07278125,3.084014892578125,10.55078125L3.084014892578125,37.36778125C3.084014892578125,39.85178125,4.830014892578125,41.86778125,6.999014892578125,41.86778125L41.07001489257812,41.86778125C43.227014892578126,41.86778125,44.98501489257813,39.84278125,44.98501489257813,37.36778125L44.98501489257813,10.55078125C44.98501489257813,8.06378125,43.239014892578126,6.05078308105,41.07001489257812,6.05078125ZM10.938014892578124,37.37678125C10.938014892578124,38.20778125,10.377014892578124,38.88278125,9.615014892578124,38.88278125L7.023014892578125,38.88278125C6.291014892578125,38.88278125,5.700014892578125,38.24378125,5.700014892578125,37.37678125L5.700014892578125,34.421781249999995C5.700014892578125,33.59078125,6.261014892578125,32.915781249999995,7.023014892578125,32.915781249999995L9.618014892578124,32.915781249999995C10.347014892578125,32.915781249999995,10.938014892578124,33.554781250000005,10.938014892578124,34.421781249999995L10.938014892578124,37.37678125ZM10.938014892578124,25.43678125C10.938014892578124,26.27078125,10.377014892578124,26.94278125,9.615014892578124,26.94278125L7.023014892578125,26.94278125C6.294014892578125,26.94278125,5.700014892578125,26.30678125,5.700014892578125,25.43678125L5.700014892578125,22.48178125C5.700014892578125,21.65078125,6.261014892578125,20.97578125,7.023014892578125,20.97578125L9.618014892578124,20.97578125C10.347014892578125,20.97578125,10.938014892578124,21.61478125,10.938014892578124,22.48178125L10.938014892578124,25.43678125ZM10.938014892578124,13.49978125C10.938014892578124,14.33078125,10.377014892578124,15.00578125,9.615014892578124,15.00578125L7.023014892578125,15.00578125C6.294014892578125,15.00578125,5.700014892578125,14.36678125,5.700014892578125,13.49978125L5.700014892578125,10.54478125C5.700014892578125,9.71078125,6.261014892578125,9.03878125,7.023014892578125,9.03878125L9.618014892578124,9.03878125C10.347014892578125,9.03878125,10.938014892578124,9.677781249999999,10.938014892578124,10.54478125L10.938014892578124,13.49978125ZM34.51201489257812,38.88278125L13.560014892578126,38.88278125L13.560014892578126,9.03578125L34.51201489257812,9.03578125L34.51201489257812,38.88278125ZM42.36601489257812,37.37678125C42.36601489257812,38.20778125,41.80501489257812,38.88278125,41.04601489257813,38.88278125L38.45101489257812,38.88278125C37.72501489257812,38.88278125,37.13401489257812,38.24378125,37.13401489257812,37.37678125L37.13401489257812,34.421781249999995C37.13401489257812,33.59078125,37.69501489257812,32.915781249999995,38.45401489257812,32.915781249999995L41.04901489257813,32.915781249999995C41.77501489257813,32.915781249999995,42.36601489257812,33.554781250000005,42.36601489257812,34.421781249999995L42.36601489257812,37.37678125ZM42.36601489257812,25.43678125C42.36601489257812,26.27078125,41.80501489257812,26.94278125,41.04601489257813,26.94278125L38.45101489257812,26.94278125C37.72501489257812,26.94278125,37.13401489257812,26.30378125,37.13401489257812,25.43678125L37.13401489257812,22.48178125C37.13401489257812,21.65078125,37.69501489257812,20.97578125,38.45401489257812,20.97578125L41.04901489257813,20.97578125C41.77501489257813,20.97578125,42.36601489257812,21.61478125,42.36601489257812,22.48178125L42.36601489257812,25.43678125ZM42.36601489257812,13.49978125C42.36601489257812,14.33078125,41.80501489257812,15.00578125,41.04601489257813,15.00578125L38.45101489257812,15.00578125C37.72501489257812,15.00578125,37.13401489257812,14.36678125,37.13401489257812,13.49978125L37.13401489257812,10.54478125C37.13401489257812,9.71078125,37.69501489257812,9.03878125,38.45401489257812,9.03878125L41.04901489257813,9.03878125C41.77501489257813,9.03878125,42.36601489257812,9.677781249999999,42.36601489257812,10.54478125L42.36601489257812,13.49978125Z" fill="#0689FF" fillOpacity="1" />
                          </g>
                        </g>
                      </svg>
                      <p className='mt-2' style={{ fontSize: '16px' }}>点击或将视频拖拽到这里上传</p>
                      <p style={{ fontSize: '14px', color: '#999', marginTop: "10px" }}>
                        支持 MP4、AVI、MOV、MKV、WMV 格式，
                      </p>
                      <p style={{ fontSize: '12px', color: '#999' }}>
                        视频大小不超过 50MB
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
            {/* 输入问题 */}
            <Form.Item
              label='输入问题:'
              name="question"
              rules={[{ required: true, message: '请输入问题！' }]}
              style={{ padding: 20 }}
            >
              <TextArea
                placeholder="请输入您想了解的问题，例如：这个视频讲了什么？视频的主要内容是什么？..."
                style={{
                  height: '120px',
                  resize: 'none',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
              />
            </Form.Item>
            {/* 视频理解按钮 */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
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
          </Form>
        </div>
        {/* 右侧：理解结果 */}
        <div style={{
          background: '#fff',
          padding: '20px 0',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          minHeight: '500px',
          flex: 1,
          marginLeft: 20,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
            <span className='pl-2 text-[16px] font-bold'>理解结果</span>
          </div>
          <div style={{ width: '100%', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {uploadedFiles.length === 0 ? (
              <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={noData} alt="无数据" style={{ width: 100, marginBottom: 16 }} />
                <div style={{ color: 'rgba(29, 33, 41, 0.55)', fontSize: 14 }}>拖入或粘贴视频进行转换后，显示相关结果</div>
                {/* <VideoPlayer src={uploadedFiles.length > 0 ? uploadedFiles[0].url : ''} /> */}
                {/* <VideoSeek 
                  startTime={3}
                  endTime={10} /> */}
              </div>
            ) : (<TextArea
              value={analysisResult}
              placeholder="理解结果将在这里显示..."
              style={{
                height: '100%',
                minHeight: '200px',
                resize: 'none',
                fontSize: '14px',
                lineHeight: '1.6',
                border: 'none',
                background: 'transparent'
              }}
              readOnly
            />



            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUnderstanding; 