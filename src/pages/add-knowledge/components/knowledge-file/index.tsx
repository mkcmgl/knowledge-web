import ChunkMethodModal from '@/components/chunk-method-modal';
import SvgIcon from '@/components/svg-icon';
import {
  useFetchNextDocumentList,
  useSetNextDocumentStatus,
} from '@/hooks/document-hooks';
import { useSetSelectedRecord } from '@/hooks/logic-hooks';
import { useSelectParserList } from '@/hooks/user-setting-hooks';
import { getExtension } from '@/utils/document-util';
import {
  FileOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Dropdown,
  Flex,
  MenuProps,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
  Modal,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import CreateFileModal from './create-file-modal';
import DocumentToolbar from './document-toolbar';
import {
  useChangeDocumentParser,
  useCreateEmptyDocument,
  useGetRowSelection,
  useHandleUploadDocument,
  useHandleWebCrawl,
  useNavigateToOtherPage,
  useRenameDocument,
  useShowMetaModal,
} from './hooks';
import ParsingActionCell from './parsing-action-cell';
import ParsingStatusCell from './parsing-status-cell';
import RenameModal from './rename-modal';
import WebCrawlModal from './web-crawl-modal';

import FileUploadModal from '@/components/file-upload-modal';
import { RunningStatus } from '@/constants/knowledge';
import { IDocumentInfo } from '@/interfaces/database/document';
import { formatDate } from '@/utils/date';
import { CircleHelp } from 'lucide-react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import styles from './index.less';
import { SetMetaModal } from './set-meta-modal';
import Editor from '@monaco-editor/react';
const { Text } = Typography;

const KnowledgeFile = () => {
  const { documents, pagination, setPagination, handleSearch, handleReset, loading } = useFetchNextDocumentList();
  const [filteredDocuments, setFilteredDocuments] = useState<IDocumentInfo[]>([]);
  const parserList = useSelectParserList();
  const { setDocumentStatus } = useSetNextDocumentStatus();
  const { toChunk } = useNavigateToOtherPage();
  const { currentRecord, setRecord } = useSetSelectedRecord<IDocumentInfo>();
  const {
    renameLoading,
    onRenameOk,
    renameVisible,
    hideRenameModal,
    showRenameModal,
  } = useRenameDocument(currentRecord.id);
  const {
    createLoading,
    onCreateOk,
    createVisible,
    hideCreateModal,
    showCreateModal,
  } = useCreateEmptyDocument();
  const {
    changeParserLoading,
    onChangeParserOk,
    changeParserVisible,
    hideChangeParserModal,
    showChangeParserModal,
  } = useChangeDocumentParser(currentRecord.id);
  const {
    documentUploadVisible,
    hideDocumentUploadModal,
    showDocumentUploadModal,
    onDocumentUploadOk,
    documentUploadLoading,
    uploadFileList,
    setUploadFileList,
    uploadProgress,
    setUploadProgress,
  } = useHandleUploadDocument();
  const {
    webCrawlUploadVisible,
    hideWebCrawlUploadModal,
    showWebCrawlUploadModal,
    onWebCrawlUploadOk,
    webCrawlUploadLoading,
  } = useHandleWebCrawl();
  const { t } = useTranslation('translation', {
    keyPrefix: 'knowledgeDetails',
  });

  const {
    showSetMetaModal,
    hideSetMetaModal,
    setMetaVisible,
    setMetaLoading,
    onSetMetaModalOk,
  } = useShowMetaModal(currentRecord.id);

  const rowSelection = useGetRowSelection();

  const [viewMetaVisible, setViewMetaVisible] = useState(false);
  const [viewMetaData, setViewMetaData] = useState<any>(null);

  const columns: ColumnsType<IDocumentInfo> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      // fixed: 'left',
      render: (text: any, { id, thumbnail, name }) => (
        <div className={styles.toChunks} onClick={() => toChunk(id)}>
          <Flex gap={10} align="center">
            {thumbnail ? (
              <img className={styles.img} src={thumbnail} alt="" />
            ) : (
              <SvgIcon
                name={`file-icon/${getExtension(name)}`}
                width={24}
              ></SvgIcon>
            )}
            <Text ellipsis={{ tooltip: text }} className={styles.nameText}>
              {text}
            </Text>
          </Flex>
        </div>
      ),
    },
    {
      title: t('chunkNumber'),
      dataIndex: 'chunk_num',
      key: 'chunk_num',
    },

    {
      title: t('chunkMethod'),
      dataIndex: 'parser_id',
      key: 'parser_id',
      render: (text) => {
        return parserList.find((x) => x.value === text)?.label;
      },
    },

    {
      title: (
        <span className="flex items-center gap-2">
          {t('parsingStatus')}
          <Tooltip title={t('parsingStatusTip')}>
            <CircleHelp className="size-3" />
          </Tooltip>
        </span>
      ),
      dataIndex: 'run',
      key: 'run',
      filters: Object.entries(RunningStatus).map(([, value]) => ({
        text: t(`runningStatus${value}`),
        value: value,
      })),
      onFilter: (value, record: IDocumentInfo) => record.run === value,
      render: (text, record) => {
        return <ParsingStatusCell record={record}></ParsingStatusCell>;
      },
    },
    {
      title: '元数据',
      dataIndex: 'meta_fields',
      key: 'meta_fields',
      render: (meta, record) => (
        <a
          style={{ cursor: 'pointer' }}
          onClick={e => {
            e.stopPropagation();
            setViewMetaData(record.meta_fields);
            setViewMetaVisible(true);
          }}
        >
          {typeof record.meta_fields === 'object' ? JSON.stringify(record.meta_fields) : record.meta_fields}
        </a>
      ),
    },
    {
      title: '启用状态',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status, id }) => (
        <>
          <Switch
            checked={status === '1'}
            onChange={(e) => {
              setDocumentStatus({ status: e, documentId: id });
            }}
          />
        </>
      ),
    },
    {
      title: t('uploadDate'),
      dataIndex: 'create_time',
      key: 'create_time',
      render(value) {
        return formatDate(value);
      },
    },
    {
      title: t('action'),
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <ParsingActionCell
          setCurrentRecord={setRecord}
          showRenameModal={showRenameModal}
          showChangeParserModal={showChangeParserModal}
          showSetMetaModal={showSetMetaModal}
          record={record}
        ></ParsingActionCell>
      ),
    },
  ];

  const finalColumns = columns.map((x) => ({
    ...x,
    className: `${styles.column}`,
  }));

  const actionItems: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: '1',
        onClick: showDocumentUploadModal,
        label: (
          <div>
            <Button type="link">
              <Space>
                <FileTextOutlined />
                {t('localFiles')}
              </Space>
            </Button>
          </div>
        ),
      },
      { type: 'divider' },
      {
        key: '3',
        onClick: showCreateModal,
        label: (
          <div>
            <Button type="link">
              <FileOutlined />
              {t('emptyFiles')}
            </Button>
          </div>
        ),
      },
    ];
  }, [showDocumentUploadModal, showCreateModal, t]);

  useEffect(() => {
    console.log('接口返回数据：', documents);
    setFilteredDocuments(documents);
  }, [documents]);

  return (
    <div className={styles.datasetWrapper}>
      <div className={styles.topFex}>


        <Dropdown menu={{ items: actionItems }} trigger={['click']}>
          <Button type="primary" icon={<PlusOutlined />}>
            {t('addFile')}
          </Button>
        </Dropdown>
      </div>

      <DocumentToolbar
        selectedRowKeys={rowSelection.selectedRowKeys as string[]}
        showCreateModal={showCreateModal}
        showWebCrawlModal={showWebCrawlUploadModal}
        showDocumentUploadModal={showDocumentUploadModal}
        documents={documents}
        onSearch={handleSearch}
        onReset={handleReset}
        parserList={parserList}
        onFilteredDocumentsChange={setFilteredDocuments}
      ></DocumentToolbar>
      <div className={styles.testingControlTip}>
        <div>  <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" style={{ width: 20, height: 20, marginRight: 8, }} viewBox="0 0 20 20">
          <defs>
            <clipPath id="master_svg0_2_7215">
              <rect x="0" y="0" width="20" height="20" rx="0" style={{ width: 20, height: 20, }} />
            </clipPath>
          </defs>
          <g clipPath="url(#master_svg0_2_7215)">
            <g>
              <path d="M10,1.25C14.8307,1.25,18.75,5.16387,18.75,10C18.75,14.8361,14.8361,18.75,10,18.75C5.16387,18.75,1.25,14.8361,1.25,10C1.25,5.16387,5.16934,1.25,10,1.25ZM11.09238,13.2826L8.90762,13.2826L8.90762,15.4674L11.09238,15.4674L11.09238,13.2826ZM11.09238,4.53262L8.90762,4.53262L8.90762,11.09238L11.09238,11.09238L11.09238,4.53262Z" fill="#F9CA06" fillOpacity="1" style={{ width: 20, height: 20, }} />
            </g>
          </g>
        </svg></div>
        <p className={styles.testingDescription}>特别提醒:解析成功后才能问答哦。</p>
      </div>
      <Table
        rowKey="id"
        columns={finalColumns}
        dataSource={filteredDocuments}
        pagination={{
          ...pagination,
          itemRender: (page, type, originalElement) => {
            if (type === 'prev') {
              return <a>上一页</a>;
            }
            if (type === 'next') {
              return <a>下一页</a>;
            }
            return originalElement;
          },
          showTotal: (total) => `总共${total}条`,
        }}
        className={styles.documentTable}
        scroll={{ scrollToFirstRowOnChange: true, x: 1300 }}
        loading={loading}
      />
      <CreateFileModal
        visible={createVisible}
        hideModal={hideCreateModal}
        loading={createLoading}
        onOk={onCreateOk}
      />
      <ChunkMethodModal
        documentId={currentRecord.id}
        parserId={currentRecord.parser_id}
        parserConfig={currentRecord.parser_config}
        documentExtension={getExtension(currentRecord.name)}
        onOk={onChangeParserOk}
        visible={changeParserVisible}
        hideModal={hideChangeParserModal}
        loading={changeParserLoading}
      />
      <RenameModal
        visible={renameVisible}
        onOk={onRenameOk}
        loading={renameLoading}
        hideModal={hideRenameModal}
        initialName={currentRecord.name}
      ></RenameModal>
      <FileUploadModal
        visible={documentUploadVisible}
        hideModal={hideDocumentUploadModal}
        loading={documentUploadLoading}
        onOk={onDocumentUploadOk}
        uploadFileList={uploadFileList}
        setUploadFileList={setUploadFileList}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
      ></FileUploadModal>
      <WebCrawlModal
        visible={webCrawlUploadVisible}
        hideModal={hideWebCrawlUploadModal}
        loading={webCrawlUploadLoading}
        onOk={onWebCrawlUploadOk}
      ></WebCrawlModal>
      {setMetaVisible && (
        <SetMetaModal
          visible={setMetaVisible}
          hideModal={hideSetMetaModal}
          onOk={onSetMetaModalOk}
          loading={setMetaLoading}
          initialMetaData={currentRecord.meta_fields}
        ></SetMetaModal>
      )}
      <Modal
        title="查看元数据"
        open={viewMetaVisible}
        onCancel={() => setViewMetaVisible(false)}
        footer={null}
        width={600}
      >

        <Editor
          height={200}
          defaultLanguage="json"
          theme="vs-dark"
          value={viewMetaData ? JSON.stringify(viewMetaData, null, 4) : ''}
          options={{ readOnly: true }}
        />
      </Modal>
    </div>
  );
};

export default KnowledgeFile;
