import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Guanjianci = () => {
  return (
    <div>
      <Title level={2}>关键词提取</Title>
      <Paragraph>
        这是一个关键词提取工具，可以从文本中自动提取重要的关键词和短语。
      </Paragraph>
      <Card title="功能说明" style={{ marginTop: 16 }}>
        <Paragraph>
          • 支持多种提取算法：TF-IDF、TextRank、LDA等<br/>
          • 自动识别关键词权重<br/>
          • 支持中文和英文文本<br/>
          • 批量文档处理<br/>
          • 关键词云可视化<br/>
          • 导出关键词列表
        </Paragraph>
      </Card>
    </div>
  );
};

export default Guanjianci; 