import NewDocumentLink from '@/components/new-document-link';
import { useTranslate } from '@/hooks/common-hooks';
import { useDownloadFile } from '@/hooks/file-manager-hooks';
import { IFile } from '@/interfaces/database/file-manager';
import {
  getExtension,
  isSupportedPreviewDocumentType,
} from '@/utils/document-util';
import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import { FolderInput, Trash2 } from 'lucide-react';
import { useHandleDeleteFile } from '../hooks';

interface IProps {
  record: IFile;
  setCurrentRecord: (record: any) => void;
  showRenameModal: (record: IFile) => void;
  showMoveFileModal: (ids: string[]) => void;
  showConnectToKnowledgeModal: (record: IFile) => void;
  setSelectedRowKeys(keys: string[]): void;
}

const ActionCell = ({
  record,
  setCurrentRecord,
  showRenameModal,
  showConnectToKnowledgeModal,
  setSelectedRowKeys,
  showMoveFileModal,
}: IProps) => {
  const documentId = record.id;
  const beingUsed = false;
  const { t } = useTranslate('fileManager');
  const { handleRemoveFile } = useHandleDeleteFile(
    [documentId],
    setSelectedRowKeys,
  );
  const { downloadFile, loading } = useDownloadFile();
  const extension = getExtension(record.name);
  const isKnowledgeBase = record.source_type === 'knowledgebase';

  const onDownloadDocument = () => {
    downloadFile({
      id: documentId,
      filename: record.name,
    });
  };

  const setRecord = () => {
    setCurrentRecord(record);
  };

  const onShowRenameModal = () => {
    setRecord();
    showRenameModal(record);
  };

  const onShowConnectToKnowledgeModal = () => {
    showConnectToKnowledgeModal(record);
  };

  const onShowMoveFileModal = () => {
    showMoveFileModal([documentId]);
  };

  return (
    <Space size={0} className='flex items-center gap-3'>
      {/* {isKnowledgeBase || ( */}
      {record.type !== 'folder' && (
        <Button style={{ padding: 0, fontSize: 14 }} type="link" onClick={onShowConnectToKnowledgeModal}>
          链接知识库
        </Button>
      )}

      {/* {isKnowledgeBase || ( */}
      {record.type !== 'folder' && (
        <Button style={{ padding: 0, fontSize: 14 }} type="link" disabled={beingUsed} onClick={onShowRenameModal}>
          重命名
        </Button>
      )}


      {/* {isKnowledgeBase || ( */}
      {record.type !== 'folder' && (
        <Button
          style={{ padding: 0, fontSize: 14 }}
          type="link"
          disabled={beingUsed}
          onClick={onShowMoveFileModal}

        >
          移动
        </Button>
      )}
      {record.type !== 'folder' && (
        <Button
          style={{ padding: 0, fontSize: 14 }}
          type="link"
          disabled={beingUsed}
          loading={loading}
          onClick={onDownloadDocument}
        >
          下载
        </Button>
      )}
      {isSupportedPreviewDocumentType(extension) && (
        <NewDocumentLink
          documentId={documentId}
          documentName={record.name}
          color="black"
        >
          <Button style={{ padding: 0, fontSize: 14 }} type="link">
            预览
          </Button>
        </NewDocumentLink>
      )}
      {/* {isKnowledgeBase || ( */}
      {record.type !== 'folder' && (
        <Button
          style={{ padding: 0, fontSize: 14, color: "#F56C6C" }}
          type="link"
          disabled={beingUsed}
          onClick={handleRemoveFile}

        >
          删除
        </Button>
      )}

    </Space>
  );
};

export default ActionCell;
