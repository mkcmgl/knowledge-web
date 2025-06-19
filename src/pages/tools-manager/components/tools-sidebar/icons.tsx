import React from 'react';

// 导入所有SVG图标
import OCRIconSvg from '@/assets/svg/tool-manager/OCR-identify.svg';
import SimilarityIconSvg from '@/assets/svg/tool-manager/similarity.svg';
import ClusterIconSvg from '@/assets/svg/tool-manager/cluster.svg';
import SensitiveWordIconSvg from '@/assets/svg/tool-manager/sensitiveWord.svg';
import KeywordIconSvg from '@/assets/svg/tool-manager/keyword.svg';
import SpeechToTextIconSvg from '@/assets/svg/tool-manager/speechToText.svg';
import ViewIconSvg from '@/assets/svg/tool-manager/view.svg';
import DeleteIconSvg from '@/assets/svg/tool-manager/del.svg';
import QuestionCircleIconSvg from '@/assets/svg/tool-manager/question-circle.svg';
import ToolIconSvg from '@/assets/svg/tool-manager/tool.svg';
import TestIconSvg from '@/assets/svg/tool-manager/test.svg';

interface IconProps {
  size?: number;
  className?: string;
}

export const OCRIdentifyIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={OCRIconSvg} alt="OCR识别" style={{ width: size, height: size }} className={className} />
);

export const TextSimilarityIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={SimilarityIconSvg} alt="文本相似度" style={{ width: size, height: size }} className={className} />
);

export const TextClusterIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={ClusterIconSvg} alt="文本聚类" style={{ width: size, height: size }} className={className} />
);

export const SensitiveWordIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={SensitiveWordIconSvg} alt="敏感词处理" style={{ width: size, height: size }} className={className} />
);

export const KeywordExtractIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={KeywordIconSvg} alt="关键词提取" style={{ width: size, height: size }} className={className} />
);

export const SpeechToTextIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={SpeechToTextIconSvg} alt="语音转文字" style={{ width: size, height: size }} className={className} />
);

// 其他图标组件
export const ViewIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={ViewIconSvg} alt="查看" style={{ width: size, height: size }} className={className} />
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={DeleteIconSvg} alt="删除" style={{ width: size, height: size }} className={className} />
);

export const QuestionCircleIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={QuestionCircleIconSvg} alt="帮助" style={{ width: size, height: size }} className={className} />
);

export const ToolIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={ToolIconSvg} alt="工具" style={{ width: size, height: size }} className={className} />
);

export const TestIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <img src={TestIconSvg} alt="测试" style={{ width: size, height: size }} className={className} />
); 