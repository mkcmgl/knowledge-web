import {
  useSecondPathName,
} from '@/hooks/route-hook';
import { getWidth } from '@/utils';
import { Menu, MenuProps } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate} from 'umi';
import { ToolsMenuRouteKey, toolsRouteMap } from '../../constant';
import styles from './index.less';
import { 
  Camera, 
  FileText, 
  BarChart3, 
  Shield, 
  Hash, 
  Mic 
} from 'lucide-react';

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
        <Camera size={16} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.TextLike],
        ToolsMenuRouteKey.TextLike,
        <FileText size={16} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.TextFenxi],
        ToolsMenuRouteKey.TextFenxi,
        <BarChart3 size={16} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.Mingganci],
        ToolsMenuRouteKey.Mingganci,
        <Shield size={16} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.Guanjianci],
        ToolsMenuRouteKey.Guanjianci,
        <Hash size={16} />,
      ),
      getItem(
        toolsRouteMap[ToolsMenuRouteKey.YuyinText],
        ToolsMenuRouteKey.YuyinText,
        <Mic size={16} />,
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