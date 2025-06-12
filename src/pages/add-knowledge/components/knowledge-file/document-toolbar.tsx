import { ReactComponent as CancelIcon } from '@/assets/svg/cancel.svg';
import { ReactComponent as DeleteIcon } from '@/assets/svg/delete.svg';
import { ReactComponent as DisableIcon } from '@/assets/svg/disable.svg';
import { ReactComponent as EnableIcon } from '@/assets/svg/enable.svg';
import { ReactComponent as RunIcon } from '@/assets/svg/run.svg';
import { useShowDeleteConfirm, useTranslate } from '@/hooks/common-hooks';
import {
  useRemoveNextDocument,
  useRunNextDocument,
  useSetNextDocumentStatus,
} from '@/hooks/document-hooks';
import { IDocumentInfo } from '@/interfaces/database/document';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Select, Space } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { RunningStatus } from './constant';

import styles from './index.less';

interface IProps {
  selectedRowKeys: string[];
  showWebCrawlModal(): void;
  showDocumentUploadModal(): void;
  documents: IDocumentInfo[];
  onSearch: (filters: { keywords: string; parser_id: string }) => void;
  onReset: () => void;
  parserList: { label: string; value: string }[];
}

const DocumentToolbar = ({
  selectedRowKeys,
  documents,
  onSearch,
  onReset,
  parserList,
}: IProps) => {
  const { t } = useTranslate('knowledgeDetails');
  const { removeDocument } = useRemoveNextDocument();
  const showDeleteConfirm = useShowDeleteConfirm();
  const { runDocumentByIds } = useRunNextDocument();
  const { setDocumentStatus } = useSetNextDocumentStatus();
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    console.log('搜索条件：', values);
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleDelete = useCallback(() => {
    const deletedKeys = selectedRowKeys.filter(
      (x) =>
        !documents
          .filter((y) => y.run === RunningStatus.RUNNING)
          .some((y) => y.id === x),
    );
    if (deletedKeys.length === 0) {
      toast.error(t('theDocumentBeingParsedCannotBeDeleted'));
      return;
    }
    showDeleteConfirm({
      onOk: () => {
        removeDocument(deletedKeys);
      },
    });
  }, [selectedRowKeys, showDeleteConfirm, documents, t, removeDocument]);

  const runDocument = useCallback(
    (run: number) => {
      runDocumentByIds({
        documentIds: selectedRowKeys,
        run,
        shouldDelete: false,
      });
    },
    [runDocumentByIds, selectedRowKeys],
  );

  const handleRunClick = useCallback(() => {
    runDocument(1);
  }, [runDocument]);

  const handleCancelClick = useCallback(() => {
    runDocument(2);
  }, [runDocument]);

  const onChangeStatus = useCallback(
    (enabled: boolean) => {
      selectedRowKeys.forEach((id) => {
        setDocumentStatus({ status: enabled, documentId: id });
      });
    },
    [selectedRowKeys, setDocumentStatus],
  );

  const handleEnableClick = useCallback(() => {
    onChangeStatus(true);
  }, [onChangeStatus]);

  const handleDisableClick = useCallback(() => {
    onChangeStatus(false);
  }, [onChangeStatus]);

  const disabled = selectedRowKeys.length === 0;

  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: '0',
        onClick: handleEnableClick,
        label: (
          <Flex gap={10}>
            <EnableIcon></EnableIcon>
            <b>{t('enabled')}</b>
          </Flex>
        ),
      },
      {
        key: '1',
        onClick: handleDisableClick,
        label: (
          <Flex gap={10}>
            <DisableIcon></DisableIcon>
            <b>{t('disabled')}</b>
          </Flex>
        ),
      },
      { type: 'divider' },
      {
        key: '2',
        onClick: handleRunClick,
        label: (
          <Flex gap={10}>
            <RunIcon></RunIcon>
            <b>{t('run')}</b>
          </Flex>
        ),
      },
      {
        key: '3',
        onClick: handleCancelClick,
        label: (
          <Flex gap={10}>
            <CancelIcon />
            <b>{t('cancel')}</b>
          </Flex>
        ),
      },
      { type: 'divider' },
      {
        key: '4',
        onClick: handleDelete,
        label: (
          <Flex gap={10}>
            <span className={styles.deleteIconWrapper}>
              <DeleteIcon width={18} />
            </span>
            <b>{t('delete', { keyPrefix: 'common' })}</b>
          </Flex>
        ),
      },
    ];
  }, [
    handleDelete,
    handleRunClick,
    handleCancelClick,
    t,
    handleDisableClick,
    handleEnableClick,
  ]);

  return (
    <div className={styles.filter}>
      <Flex justify="space-between" align="center" className="w-full">
        <Form
          form={form}
          layout="inline"
          className="flex-1"
        >
          <Space size="middle" align="center">
            <Form.Item name="keywords" label={t('fileName')}>
              <Input
                placeholder={t('pleaseInputFileName')}
                style={{ width: 200 }}
                allowClear
              />
            </Form.Item>
            <Form.Item name="parser_id" label={t('chunkMethod')}>
              <Select
                placeholder={t('pleaseSelectChunkMethod')}
                style={{ width: 200 }}
                allowClear
                options={parserList}
              />
            </Form.Item>
          </Space>
        </Form>
        <Space>
          <Button type="primary" onClick={handleSearch}>
            {t('search')}
          </Button>
          <Button onClick={handleReset} icon={<ReloadOutlined />}>
            {t('reset')}
          </Button>
        </Space>
      </Flex>
      {/* 批量 */}
      {/* <Dropdown
        menu={{ items }}
        placement="bottom"
        arrow={false}
        disabled={disabled}
      >
        <Button>
          <Space>
            <b> {t('bulk')}</b>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown> */}
    </div>
  );
};

export default DocumentToolbar;
