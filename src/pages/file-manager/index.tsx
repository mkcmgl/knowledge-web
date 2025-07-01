import { useFetchFileList } from '@/hooks/file-manager-hooks';
import { IFile } from '@/interfaces/database/file-manager';
import { formatDate } from '@/utils/date';
import { Button, Flex, Space, Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ActionCell from './action-cell';
import FileToolbar from './file-toolbar';
import {
  useGetRowSelection,
  useHandleConnectToKnowledge,
  useHandleCreateFolder,
  useHandleMoveFile,
  useHandleUploadFile,
  useNavigateToOtherFolder,
  useRenameCurrentFile,
} from './hooks';

import FileUploadModal from '@/components/file-upload-modal';
import RenameModal from '@/components/rename-modal';
import SvgIcon from '@/components/svg-icon';
import { useTranslate } from '@/hooks/common-hooks';
import { formatNumberWithThousandsSeparator } from '@/utils/common-util';
import { getExtension } from '@/utils/document-util';
import ConnectToKnowledgeModal from './connect-to-knowledge-modal';
import FolderCreateModal from './folder-create-modal';
import styles from './index.less';
import FileMovingModal from './move-file-modal';
import { useState } from 'react';

const { Text } = Typography;

const FileManager = () => {
  const { t } = useTranslate('fileManager');
  // const fileList = useSelectFileList();
  const { rowSelection, setSelectedRowKeys } = useGetRowSelection();
  const navigateToOtherFolder = useNavigateToOtherFolder();
  const {
    fileRenameVisible,
    fileRenameLoading,
    hideFileRenameModal,
    showFileRenameModal,
    initialFileName,
    onFileRenameOk,
  } = useRenameCurrentFile();
  const {
    folderCreateModalVisible,
    showFolderCreateModal,
    hideFolderCreateModal,
    folderCreateLoading,
    onFolderCreateOk,
  } = useHandleCreateFolder();
  const {
    fileUploadVisible,
    hideFileUploadModal,
    showFileUploadModal,
    fileUploadLoading,
    onFileUploadOk,
  } = useHandleUploadFile();
  const {
    connectToKnowledgeVisible,
    hideConnectToKnowledgeModal,
    showConnectToKnowledgeModal,
    onConnectToKnowledgeOk,
    initialValue,
    connectToKnowledgeLoading,
  } = useHandleConnectToKnowledge();
  const {
    showMoveFileModal,
    moveFileVisible,
    onMoveFileOk,
    hideMoveFileModal,
    moveFileLoading,
  } = useHandleMoveFile(setSelectedRowKeys);
  const [searchFilters, setSearchFilters] = useState<{ name: string; dateRange: [string, string] | null }>({ name: '', dateRange: null });
  const { pagination, data, loading, setPagination } = useFetchFileList(searchFilters);

  // 查询按钮逻辑
  const handleSearch = (filters: { name: string; dateRange: [string, string] | null }) => {
    setSearchFilters(filters);
    setPagination({ page: 1, pageSize: pagination.pageSize || 10 });
    console.log('FileManager 查询条件:', filters);
  };
  // 重置按钮逻辑
  const handleReset = () => {
    setSearchFilters({ name: '', dateRange: null });
    setPagination({ page: 1, pageSize: pagination.pageSize || 10 });
    console.log('FileManager 重置');
  };

  const columns: ColumnsType<IFile> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',

      render(value, record) {
        return (
          <Flex gap={10} align="center">
            <SvgIcon
              name={`file-icon/${record.type === 'folder' ? 'folder' : getExtension(value)}`}
              width={24}
            ></SvgIcon>
            {record.type === 'folder' ? (
              <Button
                type={'link'}
                className={styles.linkButton}
                onClick={() => navigateToOtherFolder(record.id)}
              >
                <Text ellipsis={{ tooltip: value }}>{value}</Text>
              </Button>
            ) : (
              <Text ellipsis={{ tooltip: value }}>{value}</Text>
            )}
          </Flex>
        );
      },
    },

    {
      title: t('size'),
      dataIndex: 'size',
      key: 'size',
      render(value) {
        return (
          formatNumberWithThousandsSeparator((value / 1024).toFixed(2)) + ' KB'
        );
      },
    },
    {
      title: t('uploadDate'),
      dataIndex: 'create_time',
      key: 'create_time',
      render(text) {
        return formatDate(text);
      },
    },
    {
      title: t('knowledgeBase'),
      dataIndex: 'kbs_info',
      key: 'kbs_info',
      render(value) {
        return Array.isArray(value) ? (
          <Space wrap>
            {value?.map((x,index) => (
              <Tag color={index % 2 === 1 ? "#52C41A" : "blue"} key={x.kb_id}>
                {x.kb_name}
              </Tag>
            ))}
          </Space>
        ) : (
          ''
        );
      },
    },
    {
      title: t('action'),
      dataIndex: 'action',
      key: 'action',
      width: 320,
      fixed: 'right',
      render: (text, record) => (
        <ActionCell
          record={record}
          setCurrentRecord={(record: any) => {
            console.info(record);
          }}
          showRenameModal={showFileRenameModal}
          showMoveFileModal={showMoveFileModal}
          showConnectToKnowledgeModal={showConnectToKnowledgeModal}
          setSelectedRowKeys={setSelectedRowKeys}
        ></ActionCell>
      ),
    },
  ];

  return (
    <section className={styles.fileManagerWrapper}>
      <FileToolbar
        selectedRowKeys={rowSelection.selectedRowKeys as string[]}
        showFolderCreateModal={showFolderCreateModal}
        showFileUploadModal={showFileUploadModal}
        setSelectedRowKeys={setSelectedRowKeys}
        showMoveFileModal={showMoveFileModal}
        onSearch={handleSearch}
        onReset={handleReset}
      ></FileToolbar>
      <Table
        dataSource={data?.files}
        columns={columns}
        rowKey={'id'}
        rowSelection={rowSelection}
        loading={loading}
        pagination={pagination}
        scroll={{ scrollToFirstRowOnChange: true, x: '100%' }}
      />
      <RenameModal
        visible={fileRenameVisible}
        hideModal={hideFileRenameModal}
        onOk={onFileRenameOk}
        initialName={initialFileName}
        loading={fileRenameLoading}
      ></RenameModal>
      <FolderCreateModal
        loading={folderCreateLoading}
        visible={folderCreateModalVisible}
        hideModal={hideFolderCreateModal}
        onOk={onFolderCreateOk}
      ></FolderCreateModal>
      <FileUploadModal
        visible={fileUploadVisible}
        hideModal={hideFileUploadModal}
        loading={fileUploadLoading}
        onOk={onFileUploadOk}
      ></FileUploadModal>
      <ConnectToKnowledgeModal
        initialValue={initialValue}
        visible={connectToKnowledgeVisible}
        hideModal={hideConnectToKnowledgeModal}
        onOk={onConnectToKnowledgeOk}
        loading={connectToKnowledgeLoading}
      ></ConnectToKnowledgeModal>
      {moveFileVisible && (
        <FileMovingModal
          visible={moveFileVisible}
          hideModal={hideMoveFileModal}
          onOk={onMoveFileOk}
          loading={moveFileLoading}
        ></FileMovingModal>
      )}
    </section>
  );
};

export default FileManager;
