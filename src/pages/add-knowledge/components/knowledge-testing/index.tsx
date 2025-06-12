import {
  useTestChunkAllRetrieval,
  useTestChunkRetrieval,
} from '@/hooks/knowledge-hooks';
import { App, Form, Modal } from 'antd';
import TestingControl from './testing-control';
import TestingResult from './testing-result';

import { useState } from 'react';
import styles from './index.less';

const KnowledgeTesting = () => {
  const [form] = Form.useForm();
  const { testChunk } = useTestChunkRetrieval();
  const { testChunkAll } = useTestChunkAllRetrieval();
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();

  const handleTesting = async (documentIds: string[] = []) => {
    try {
      const values = await form.validateFields();
      await Promise.all([
        testChunk({
          ...values,
          doc_ids: Array.isArray(documentIds) ? documentIds : [],
          vector_similarity_weight: 1 - values.vector_similarity_weight,
        }),
        testChunkAll({
          ...values,
          doc_ids: [],
          vector_similarity_weight: 1 - values.vector_similarity_weight,
        })
      ]);
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('Testing failed:', error);
      message.error('测试失败，请重试');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <App>
      <div className={styles.testingWrapper}>
        <div className={styles.testingControlSection}>
          <TestingControl
            form={form}
            handleTesting={handleTesting}
            selectedDocumentIds={selectedDocumentIds}
          />
        </div>
        <Modal
          title="测试结果"
          open={isModalOpen}
          onCancel={handleModalClose}
          width="80%"
          footer={null}
          destroyOnClose
        >
          <TestingResult
            handleTesting={handleTesting}
            selectedDocumentIds={selectedDocumentIds}
            setSelectedDocumentIds={setSelectedDocumentIds}
          />
        </Modal>
      </div>
    </App>
  );
};

export default KnowledgeTesting;
