import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const YuyinText = () => {
  return (
    <div>
      <Title level={2}>语言转文字</Title>
      <Paragraph>
        这是一个语音转文字工具，可以将语音文件转换为可编辑的文本。
      </Paragraph>
      <Card title="功能说明" style={{ marginTop: 16 }}>
        <Paragraph>
          • 支持多种音频格式：MP3、WAV、M4A等<br/>
          • 高精度语音识别<br/>
          • 支持多种语言和方言<br/>
          • 实时语音转文字<br/>
          • 批量音频处理<br/>
          • 时间戳标记<br/>
          • 导出多种格式
        </Paragraph>
      </Card>
    </div>
  );
};

export default YuyinText; 