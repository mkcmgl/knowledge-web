import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const TextFenxi = () => {
  return (
    <div>
      <Title level={2}>文本聚类分析</Title>
      <Paragraph>
        这是一个文本聚类分析工具，可以对大量文本进行自动分类和聚类。
      </Paragraph>
      <Card title="功能说明" style={{ marginTop: 16 }}>
        <Paragraph>
          • 支持多种聚类算法：K-means、层次聚类、DBSCAN等<br/>
          • 自动确定最佳聚类数量<br/>
          • 聚类结果可视化<br/>
          • 支持大规模文本数据<br/>
          • 聚类质量评估<br/>
          • 导出聚类报告
        </Paragraph>
      </Card>
    </div>
  );
};

export default TextFenxi; 