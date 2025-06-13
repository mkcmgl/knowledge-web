import { useTranslate } from '@/hooks/common-hooks';
import { useHandleChunkMethodSelectChange } from '@/hooks/logic-hooks';
import { Button, Form, Select } from 'antd';
import { memo, useState } from 'react';
import {
  useHasParsedDocument,
  useSelectChunkMethodList,
  useSelectEmbeddingModelOptions,
} from '../hooks';
import { Modal } from 'antd';
import CategoryPanel from '../category-panel';

export const EmbeddingModelItem = memo(function EmbeddingModelItem() {
  const { t } = useTranslate('knowledgeConfiguration');
  const embeddingModelOptions = useSelectEmbeddingModelOptions();
  const disabled = useHasParsedDocument();

  return (
    <Form.Item
      name="embd_id"
      label={t('embeddingModel')}
      rules={[{ required: true }]}
      tooltip={t('embeddingModelTip')}
    >
      <Select
        placeholder={t('embeddingModelPlaceholder')}
        options={embeddingModelOptions}
        disabled={disabled}
      ></Select>
    </Form.Item>
  );
});

export const ChunkMethodItem = memo(function ChunkMethodItem() {
  const { t } = useTranslate('knowledgeConfiguration');
  const form = Form.useFormInstance();
  const handleChunkMethodSelectChange = useHandleChunkMethodSelectChange(form);
  const parserList = useSelectChunkMethodList();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chunkMethod = Form.useWatch('parser_id', form);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className='flex'>

        <Form.Item
          name="parser_id"
          label={t('chunkMethod')}
          tooltip={t('chunkMethodTip')}
          rules={[{ required: true }]}
          className='flex-1'
        >
          <Select
            placeholder={t('chunkMethodPlaceholder')}
            onChange={handleChunkMethodSelectChange}
            options={parserList}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="link" onClick={showModal}>
            {t('viewDetails')}
          </Button>
        </Form.Item>
      </div>

      <Modal
        title={t('chunkMethodDetails')}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <CategoryPanel chunkMethod={chunkMethod}></CategoryPanel>
      </Modal>
    </>
  );
});
