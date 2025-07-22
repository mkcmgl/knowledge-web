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
  Modal,
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
import { fetchVideoChunks } from '@/services/knowledge-service';
import { useCallback, useEffect, useState, useRef } from 'react';
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
  const [videoChunkInfo, setVideoChunkInfo] = useState<any[]>([]);
  // 新增：弹窗控制和当前视频信息
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoInfo, setCurrentVideoInfo] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 弹窗打开后收集 chunks 的 id，调用 fetchVideoChunks
  useEffect(() => {
    if (isSuccess && chunks && chunks.length > 0) {
      const chunkIds = chunks.map((x) => x.id).filter(Boolean);
      if (chunkIds.length > 0) {
        (async () => {
          try {
            const { data } = await fetchVideoChunks(chunkIds as string[]);
            setVideoChunkInfo(data.data);
            console.log('fetchVideoChunks 返回:', data);
          } catch (e: any) {
            console.warn('获取视频分块信息失败', e);
          }
        })();
      } else {
        setVideoChunkInfo([]);
      }
    }
  }, [isSuccess, chunks]);

  // 时间字符串转秒，如 0:0:4:17 => 4
  const timeStrToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    // 处理"时:分:秒:毫秒"格式
    if (parts.length === 4) {
      const [hours, minutes, seconds, milliseconds] = parts;
      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    }
    // 处理"时:分:秒"格式
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }

    return 0;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && currentVideoInfo) {
      const startSec = timeStrToSeconds(currentVideoInfo.start_time);
      const endSec = timeStrToSeconds(currentVideoInfo.end_time);

      videoRef.current.currentTime = startSec;
      videoRef.current.play().catch(e => console.error('播放失败:', e));

      // 添加时间更新监听
      const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= endSec) {
          videoRef.current.pause();
          videoRef.current.currentTime = startSec; // 可选：重置到开始位置
        }
      };

      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);

      // 返回清理函数，避免内存泄漏
      return () => {
        videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  };
  // 弹窗视频起止时间控制
  useEffect(() => {
    if (!modalVisible || !videoRef.current || !currentVideoInfo) return;
    const video = videoRef.current;
    const start = timeStrToSeconds(currentVideoInfo.start_time);
    const end = timeStrToSeconds(currentVideoInfo.end_time);
    console.log(`start,end`, start, end);
    const handleTimeUpdate = () => {
      if (video.currentTime >= end) {
        video.pause();
        video.currentTime = start;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [modalVisible, currentVideoInfo]);

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
            chunks?.map((x) => {
              const videoInfo = Array.isArray(videoChunkInfo) ? videoChunkInfo.find((v) => v.id === x.id) : null;
              return (
                <Card key={String(x.chunk_id)} title={<ChunkTitle item={x} />}>
                  <div className="flex justify-center">
                    {showImage(x.doc_type_kwd) && (
                      <Image
                        id={x.image_id}
                        className={'object-contain max-h-[30vh] w-full text-center'}
                        src={`/api/file/downloadImage?imageId=${x.image_id}`}
                      ></Image>
                    )}
                  </div>
                  <div className="pt-4" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexDirection: 'column' }}>
                    {/* 渲染内容时去除所有 '[{chunk_id:...}]' 结构的文本 */}
                    <div style={{ flex: 1 }}>
                      {x.content_ltks
                        ? x.content_ltks.replace(/\[\{chunk_id:[^}]+\}\]/g, '')
                        : ''}
                    </div>
                    {/* 渲染视频封面，点击弹窗播放指定区间 */}
                    {videoInfo && videoInfo.doc_id && (
                      <div style={{ cursor: 'pointer', width: 200 }}
                        onClick={() => {
                          setCurrentVideoInfo({
                            ...videoInfo,
                            videoUrl: `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4`, // TODO: 替换为真实接口
                          });
                          setModalVisible(true);
                        }}
                      >
                        <video
                          width={200}
                          style={{ borderRadius: 8, background: '#000' }}
                          poster={videoInfo.cover_url || undefined}
                          src=""
                          controls={false}
                        />
                        <div style={{ position: 'absolute', bottom: 24, left: 24, borderRadius: 8, width: 200, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, background: 'rgba(0,0,0,0.2)' }}>
                          ▶
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          ) : isSuccess && chunks?.length === 0 ? (
            <Empty></Empty>
          ) : null}
        </Flex>
      </div>
      {/* 视频弹窗 */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        destroyOnHidden
      >
        {currentVideoInfo && (
          <div style={{ textAlign: 'center' }}>

            <video
              ref={videoRef}
              src={currentVideoInfo.videoUrl}
              controls
              width="100%"
              poster={currentVideoInfo.cover_url || undefined}
              style={{ borderRadius: 8, background: '#000' }}
              onLoadedMetadata={handleLoadedMetadata}
            />
            <div style={{ marginTop: 16 }}>
              当前播放区间: {currentVideoInfo.start_time} - {currentVideoInfo.end_time}
            </div>
          </div>

        )}
      </Modal>
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
