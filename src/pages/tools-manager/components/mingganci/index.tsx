import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Mingganci = () => {
  return (
    <div>
      <Title level={2}>敏感词处理</Title>
      <Paragraph>
        这是一个敏感词处理工具，可以检测和过滤文本中的敏感词汇。
      </Paragraph>
      <Card title="功能说明" style={{ marginTop: 16 }}>
        <Paragraph>
          • 支持自定义敏感词库<br/>
          • 多种过滤模式：替换、删除、标记等<br/>
          • 支持模糊匹配和精确匹配<br/>
          • 批量文本处理<br/>
          • 敏感词统计报告<br/>
          • 支持多种语言
        </Paragraph>
      </Card>
    </div>
  );
};

export default Mingganci; 