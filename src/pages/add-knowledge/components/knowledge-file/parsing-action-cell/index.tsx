import { useShowDeleteConfirm, useTranslate } from '@/hooks/common-hooks';
import { useRemoveNextDocument } from '@/hooks/document-hooks';
import { IDocumentInfo } from '@/interfaces/database/document';
import { downloadDocument } from '@/utils/file-util';

import { Button, Dropdown, MenuProps, Space, Tooltip } from 'antd';
import { isParserRunning } from '../utils';
import { useNavigate } from 'umi';
import { useCallback, useState } from 'react';
import { DocumentType } from '../constant';
import styles from './index.less';
import { KnowledgeRouteKey } from '../constant';
import { useGetKnowledgeSearchParams } from '@/hooks/route-hook';
import PreviewModal from '../preview-modal/index';

interface IProps {
  record: IDocumentInfo;
  setCurrentRecord: (record: IDocumentInfo) => void;
  showRenameModal: () => void;
  showChangeParserModal: () => void;
  showSetMetaModal: () => void;
}

const ParsingActionCell = ({
  record,
  setCurrentRecord,
  showRenameModal,
  showChangeParserModal,
  showSetMetaModal,
}: IProps) => {
  const documentId = record.id;
  const isRunning = isParserRunning(record.run);
  const { t } = useTranslate('knowledgeDetails');
  const { removeDocument } = useRemoveNextDocument();
  const showDeleteConfirm = useShowDeleteConfirm();
  const isVirtualDocument = record.type === DocumentType.Virtual;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocId, setPreviewDocId] = useState<string>('');

  const onRmDocument = () => {
    if (!isRunning) {
      showDeleteConfirm({
        onOk: () => removeDocument([documentId]),
        content: record?.parser_config?.graphrag?.use_graphrag
          ? t('deleteDocumentConfirmContent')
          : '',
      });
    }
  };

  const onDownloadDocument = () => {
    downloadDocument({
      id: documentId,
      filename: record.name,
    });
  };

  const setRecord = useCallback(() => {
    setCurrentRecord(record);
  }, [record, setCurrentRecord]);

  const onShowRenameModal = () => {
    setRecord();
    showRenameModal();
  };
  const onShowChangeParserModal = () => {
    setRecord();
    showChangeParserModal();
  };

  const onShowSetMetaModal = useCallback(() => {
    setRecord();
    showSetMetaModal();
  }, [setRecord, showSetMetaModal]);

  const onShowPreviewModal = (docId: string) => {
    setPreviewDocId(docId);
    setPreviewVisible(true);
  };

  const hidePreviewModal = () => {
    setPreviewVisible(false);
    setPreviewDocId('');
  };

  const useNavigateToOtherPage = () => {
    const navigate = useNavigate();
    const { knowledgeId } = useGetKnowledgeSearchParams();

    const linkToUploadPage = useCallback(() => {
      navigate(`/knowledge/dataset/upload?id=${knowledgeId}`);
    }, [navigate, knowledgeId]);

    const toChunk = useCallback(
      (id: string) => {
        navigate(
          `/knowledge/${KnowledgeRouteKey.Dataset}/chunk?id=${knowledgeId}&doc_id=${id}`,
        );
      },
      [navigate, knowledgeId],
    );

    return { linkToUploadPage, toChunk };
  };

  const { toChunk } = useNavigateToOtherPage();
  const chunkItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex flex-col">
          <Button type="link" onClick={onShowChangeParserModal}>
            {t('chunkMethod')}
          </Button>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: '2',
      label: (
        <div className="flex flex-col">
          <Button type="link" onClick={onShowSetMetaModal}>
            {t('setMetaData')}
          </Button>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: '3',
      label: (
        <div className="flex flex-col">
          <Button
            type="link"
            size='small'
            disabled={isRunning}
            onClick={onShowRenameModal}
            className={styles.iconButton}
          >
            {t('rename', { keyPrefix: 'common' })}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Space size={0}>
        {isVirtualDocument || (
          <Dropdown
            menu={{ items: chunkItems }}
            trigger={['click']}
            disabled={isRunning || record.parser_id === 'tag'}
          >
            <Button type="link" size='small' className={styles.iconButton}>
              设置
            </Button>
          </Dropdown>
        )}
        <Button
          type="link"
          size='small'
          disabled={isRunning}
          onClick={() => onShowPreviewModal(record.id)}
          className={styles.iconButton}
        >
          预览
        </Button>
        <Button
          type="link"
          size='small'
          disabled={isRunning}
          onClick={onRmDocument}
          className={styles.iconButton}
          style={{color: '#F56C6C'}}
        >
          {t('delete', { keyPrefix: 'common' })}
        </Button>
        {isVirtualDocument || (
          <Button
            type="link"
            size='small'
            disabled={isRunning}
            onClick={onDownloadDocument}
            className={styles.iconButton}
          >
            {t('download', { keyPrefix: 'common' })}
          </Button>
        )}
      </Space>
      <PreviewModal
        visible={previewVisible}
        hideModal={hidePreviewModal}
        docId={previewDocId}
      />
    </>
  );
};

export default ParsingActionCell;
