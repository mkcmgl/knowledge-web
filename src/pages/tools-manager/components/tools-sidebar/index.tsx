import {
  useSecondPathName,
} from '@/hooks/route-hook';
import { getWidth } from '@/utils';
import { Menu, MenuProps } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'umi';
import { ToolsMenuRouteKey, toolsRouteMap } from '../../constant';
import styles from './index.less';
import {
  OCRIdentifyIcon,
  TextSimilarityIcon,
  TextClusterIcon,
  SensitiveWordIcon,
  KeywordExtractIcon,
  SpeechToTextIcon,
} from './icons';

const ToolsSidebar = () => {
  let navigate = useNavigate();
  const activeKey = useSecondPathName();
  const [windowWidth, setWindowWidth] = useState(getWidth());

  const handleSelect: MenuProps['onSelect'] = (e) => {
    navigate(`/tools/${e.key}`);
  };

  type MenuItem = Required<MenuProps>['items'][number];

  const getItem = useCallback(
    (
      label: string,
      key: React.Key,
      icon?: React.ReactNode,
      disabled?: boolean,
      children?: MenuItem[],
      type?: 'group',
    ): MenuItem => {
      return {
        key,
        icon,
        children,
        label: label,
        type,
        disabled,
      } as MenuItem;
    },
    [],
  );

  const items: MenuItem[] = useMemo(() => {
    return [
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.OCR],
        ToolsMenuRouteKey.OCR,
        <OCRIdentifyIcon size={16} fill={activeKey === ToolsMenuRouteKey.OCR ? '#306EFD' : '#1D2129'} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.textSimilarity],
        ToolsMenuRouteKey.textSimilarity,
        <TextSimilarityIcon size={16} fill={activeKey === ToolsMenuRouteKey.textSimilarity ? '#306EFD' : '#1D2129'} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.ClusteringAnalysis],
        ToolsMenuRouteKey.ClusteringAnalysis,
        <TextClusterIcon size={16} fill={activeKey === ToolsMenuRouteKey.ClusteringAnalysis ? '#306EFD' : '#1D2129'} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.SensitiveWord],
        ToolsMenuRouteKey.SensitiveWord,
        <SensitiveWordIcon size={16} fill={activeKey === ToolsMenuRouteKey.SensitiveWord ? '#306EFD' : '#1D2129'} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.KeywordExtraction],
        ToolsMenuRouteKey.KeywordExtraction,
        <KeywordExtractIcon size={16} fill={activeKey === ToolsMenuRouteKey.KeywordExtraction ? '#306EFD' : '#1D2129'} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.SpeechToText],
        ToolsMenuRouteKey.SpeechToText,
        <SpeechToTextIcon size={16} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.ImgUnderstand],
        ToolsMenuRouteKey.ImgUnderstand,
        <SpeechToTextIcon size={16} />,
      ), getItem(
        toolsRouteMap[ToolsMenuRouteKey.VideoUnderstand],
        ToolsMenuRouteKey.VideoUnderstand,
        <SpeechToTextIcon size={16} />,
      ),

    ];
  }, [getItem]);

  useEffect(() => {
    const widthSize = () => {
      const width = getWidth();
      setWindowWidth(width);
    };
    window.addEventListener('resize', widthSize);
    return () => {
      window.removeEventListener('resize', widthSize);
    };
  }, []);

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.menuWrapper}>
        <Menu
          selectedKeys={[activeKey]}
          className={classNames(styles.menu, {
            [styles.defaultWidth]: windowWidth.width > 957,
            [styles.minWidth]: windowWidth.width <= 957,
          })}
          items={items}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
};

export default ToolsSidebar; 