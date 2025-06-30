import React from 'react';

// 用 ReactComponent 方式导入 SVG
import { ReactComponent as OCRIconSvg } from '@/assets/svg/tool-manager/OCR-identify.svg';
import { ReactComponent as SimilarityIconSvg } from '@/assets/svg/tool-manager/similarity.svg';
import { ReactComponent as ClusterIconSvg } from '@/assets/svg/tool-manager/cluster.svg';
import { ReactComponent as SensitiveWordIconSvg } from '@/assets/svg/tool-manager/sensitiveWord.svg';
import { ReactComponent as KeywordIconSvg } from '@/assets/svg/tool-manager/keyword.svg';
import { ReactComponent as SpeechToTextIconSvg } from '@/assets/svg/tool-manager/speechToText.svg';
import { ReactComponent as ViewIconSvg } from '@/assets/svg/tool-manager/view.svg';
import { ReactComponent as DeleteIconSvg } from '@/assets/svg/tool-manager/del.svg';
import { ReactComponent as QuestionCircleIconSvg } from '@/assets/svg/tool-manager/question-circle.svg';
import { ReactComponent as ToolIconSvg } from '@/assets/svg/tool-manager/tool.svg';
import { ReactComponent as TestIconSvg } from '@/assets/svg/tool-manager/test.svg';

interface IconProps {
  size?: number;
  className?: string;
  fill?: string;
}

export const OCRIdentifyIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <OCRIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const TextSimilarityIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <SimilarityIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const TextClusterIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <ClusterIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const SensitiveWordIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <SensitiveWordIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const KeywordExtractIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <KeywordIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const SpeechToTextIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <SpeechToTextIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

// 其他图标组件
export const ViewIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <ViewIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <DeleteIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const QuestionCircleIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <QuestionCircleIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const ToolIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <ToolIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
);

export const TestIcon: React.FC<IconProps> = ({ size = 16, className, fill = '#1D2129' }) => (
  <TestIconSvg style={{ width: size, height: size }} className={className} fill={fill} />
); 