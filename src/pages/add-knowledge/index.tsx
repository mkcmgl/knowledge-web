import { useKnowledgeBaseId } from '@/hooks/knowledge-hooks';
import {
  useNavigateWithFromState,
  useSecondPathName,
  useThirdPathName,
} from '@/hooks/route-hook';
import { Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'umi';
import Siderbar from './components/knowledge-sidebar';
import { KnowledgeDatasetRouteKey, KnowledgeRouteKey } from './constant';
import styles from './index.less';

const KnowledgeAdding = () => {
  const knowledgeBaseId = useKnowledgeBaseId();

  const { t } = useTranslation();
  const activeKey: KnowledgeRouteKey =
    (useSecondPathName() as KnowledgeRouteKey) || KnowledgeRouteKey.Dataset;

  const datasetActiveKey: KnowledgeDatasetRouteKey =
    useThirdPathName() as KnowledgeDatasetRouteKey;

  const gotoList = useNavigateWithFromState();

  const breadcrumbItems: ItemType[] = useMemo(() => {
    const items: ItemType[] = [
      {
        title: (
          <a onClick={() => gotoList('/knowledge')}>
            {t('header.knowledgeBase')}
          </a>
        ),
      },
      {
        title: datasetActiveKey ? (
          <Link

            to={`/knowledge/${KnowledgeRouteKey.Dataset}?id=${knowledgeBaseId}`}
          >
            <span style={{ color: '#306EFD' }}>
              {t(`knowledgeDetails.${activeKey}`)}
            </span>
          </Link>
        ) : (
          <span style={{ color: '#306EFD' }}>
            {t(`knowledgeDetails.${activeKey}`)}
          </span>
        ),
      },
    ];

    if (datasetActiveKey) {
      items.push({
        title: t(`knowledgeDetails.${datasetActiveKey}`),
      });
    }

    return items;
  }, [activeKey, datasetActiveKey, gotoList, knowledgeBaseId, t]);

  return (
    <>
      <div className={styles.container}>
        <Siderbar></Siderbar>
        <div className={styles.contentWrapper}>
          <Breadcrumb items={breadcrumbItems} className={styles.contentBreadcrumb} />
          <div className={styles.content}>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeAdding;
