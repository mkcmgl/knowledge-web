import {
  useNavigateWithFromState,
  useSecondPathName,
} from '@/hooks/route-hook';
import { Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useMemo } from 'react';
import { Outlet } from 'umi';
import ToolsSidebar from './components/tools-sidebar';
import { ToolsMenuRouteKey, toolsRouteMap } from './constant';
import styles from './index.less';

const ToolsManager = () => {
  const activeKey: ToolsMenuRouteKey =
    (useSecondPathName() as ToolsMenuRouteKey) || ToolsMenuRouteKey.OCR;

  const gotoList = useNavigateWithFromState();

  const breadcrumbItems: ItemType[] = useMemo(() => {
    const items: ItemType[] = [
      {
        title: (
          <a onClick={() => gotoList('/tools')}>
            工具集
          </a>
        ),
      },
      {
        title: toolsRouteMap[activeKey] || '工具',
      },
    ];

    return items;
  }, [activeKey, gotoList]);

  return (
    <>
      <div className={styles.container}>
        <ToolsSidebar></ToolsSidebar>
        <div className={styles.contentWrapper}>
          <Breadcrumb items={breadcrumbItems} />
          <div className={styles.content}>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolsManager;
