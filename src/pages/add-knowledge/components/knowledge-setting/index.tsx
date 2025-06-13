import { Button, Divider, Modal, Spin, Typography } from 'antd';
import CategoryPanel from './category-panel';
import { ConfigurationForm } from './configuration';
import {
  useHandleChunkMethodChange,
  useSelectKnowledgeDetailsLoading,
} from './hooks';

import { useTranslate } from '@/hooks/common-hooks';
import styles from './index.less';
import { useState } from 'react';

const { Title } = Typography;

const Configuration = () => {
  const loading = useSelectKnowledgeDetailsLoading();
  const { form, chunkMethod } = useHandleChunkMethodChange();
  const { t } = useTranslate('knowledgeConfiguration');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.configurationWrapper}>
      <Title className={styles.contentTop} level={4}>
        {t('configuration', { keyPrefix: 'knowledgeDetails' })}
      </Title>
      <p className={styles.titleDescription}>{t('titleDescription')}</p>
      <Divider></Divider>
      <Spin spinning={loading}>
        <div className={styles.configurationContent}>
          <div className={styles.configurationForm}>
            <div className={styles.formHeader}>
              <ConfigurationForm form={form}></ConfigurationForm>
            </div>
          </div>
        </div>
      </Spin>
      <Modal
        title={t('chunkMethodDetails')}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <CategoryPanel chunkMethod={chunkMethod}></CategoryPanel>
      </Modal>
    </div>
  );
};

export default Configuration;
