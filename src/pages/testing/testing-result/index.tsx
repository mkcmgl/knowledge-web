import { ReactComponent as SelectedFilesCollapseIcon } from '@/assets/svg/selected-files-collapse.svg';
import { useTranslate } from '@/hooks/common-hooks';
import { ITestingChunk } from '@/interfaces/database/knowledge';
import {
  Card,
  Collapse,
  Empty,
  Flex,
  Image,
  Pagination,
  PaginationProps,
  Space,
} from 'antd';
import camelCase from 'lodash/camelCase';
import SelectFiles from './select-files';

import {
  useAllTestingResult,
  useAllTestingSuccess,
  useSelectIsTestingSuccess,
  useSelectTestingResult,
} from '@/hooks/knowledge-hooks';
import { useGetPaginationWithRouter } from '@/hooks/logic-hooks';
import { api_host } from '@/utils/api';
import { showImage } from '@/utils/chat';
import { useCallback } from 'react';
import styles from './index.less';

const similarityList: Array<{ field: keyof ITestingChunk; label: string }> = [
  { field: 'similarity', label: 'Hybrid Similarity' },
  { field: 'term_similarity', label: 'Term Similarity' },
  { field: 'vector_similarity', label: 'Vector Similarity' },
];

const ChunkTitle = ({ item }: { item: ITestingChunk }) => {
  const { t } = useTranslate('knowledgeDetails');
  return (
    <Flex gap={10}>
      {similarityList.map((x) => (
        typeof item[x.field] === 'number' ? (
          <Space key={x.field}>
            <span style={{ color: '#306EFD', fontSize: 20 }} className={styles.similarityCircle}>
              {((item[x.field] as number) * 100).toFixed(2)}
            </span>
            <span className={styles.similarityText}>{t(camelCase(x.field))}</span>
          </Space>
        ) : null
      ))}
    </Flex>
  );
};

interface IProps {
  handleTesting: (documentIds?: string[]) => Promise<any>;
  selectedDocumentIds: string[];
  setSelectedDocumentIds: (ids: string[]) => void;
}

const TestingResult = ({
  handleTesting,
  selectedDocumentIds,
  setSelectedDocumentIds,
}: IProps) => {
  // const { documents,} = useSelectTestingResult();
  const { documents: documentsAll, total, chunks } = useAllTestingResult();
  const { t } = useTranslate('knowledgeDetails');
  const { pagination, setPagination } = useGetPaginationWithRouter();
  const isSuccess = useSelectIsTestingSuccess();
  // const isAllSuccess = useAllTestingSuccess();
  const onChange: PaginationProps['onChange'] = (pageNumber, pageSize) => {
    pagination.onChange?.(pageNumber, pageSize);
    handleTesting(selectedDocumentIds);
  };
  const onTesting = useCallback(
    (ids: string[]) => {
      setPagination({ page: 1 });
      handleTesting(ids);
    },
    [setPagination, handleTesting],
  );

  return (
    <section className={styles.testingResultWrapper}>
      <Collapse
        expandIcon={() => (
          <SelectedFilesCollapseIcon></SelectedFilesCollapseIcon>
        )}
        className={styles.selectFilesCollapse}
        items={[
          {
            key: '1',
            label: (
              <Flex
                justify={'space-between'}
                align="center"
                className={styles.selectFilesTitle}
              >
                <Space>
                  <span>
                    {selectedDocumentIds?.length ?? 0}/
                    {documentsAll?.length ?? 0}
                  </span>
                  {t('filesSelected')}
                </Space>
              </Flex>
            ),
            children: (
              <div>
                <SelectFiles
                  setSelectedDocumentIds={setSelectedDocumentIds}
                  handleTesting={onTesting}
                ></SelectFiles>
              </div>
            ),
          },
        ]}
      />
      <div className={styles.resultContent}>
        <Flex
          gap={'large'}
          vertical
          flex={1}
        >
          {isSuccess && chunks?.length > 0 ? (
            chunks?.map((x) => (
              <Card key={x.chunk_id} title={<ChunkTitle item={x}></ChunkTitle>}>
                <div className="flex justify-center">
                  {showImage(x.doc_type_kwd) && (
                    <Image
                      id={x.image_id}
                      className={'object-contain max-h-[30vh] w-full text-center'}
                      src={`${api_host}/document/image/${x.image_id}`}
                    ></Image>
                  )}
                </div>
                <div className="pt-4">{x.content_ltks}</div>
              </Card>
            ))
          ) : isSuccess && chunks?.length === 0 ? (
            <Empty></Empty>
          ) : null}
        </Flex>
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination
          {...pagination}
          size={'small'}
          total={total}
          onChange={onChange}
        />
      </div>
    </section>
  );
};

export default TestingResult;
