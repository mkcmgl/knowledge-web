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
  useSelectIsTestingSuccess,
} from '@/hooks/knowledge-hooks';
import { useGetPaginationWithRouter } from '@/hooks/logic-hooks';
import { showImage } from '@/utils/chat';
import { useCallback, useEffect, useState, useRef } from 'react';
import { fetchVideoChunks } from '@/services/knowledge-service';
import styles from './index.less';
import { api_rag_host } from '@/utils/api';
import { formatTimeDisplay } from '@/utils/document-util';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

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
  // const { documents, } = useSelectTestingResult();
  const { documents: documentsAll, chunks, total } = useAllTestingResult();
  const { t } = useTranslate('knowledgeDetails');
  const { pagination, setPagination } = useGetPaginationWithRouter();
  const isSuccess = useSelectIsTestingSuccess();
  console.log(chunks)
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
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false); // 新增：控制视频是否正在播放
  const [isVideoLoading, setIsVideoLoading] = useState(false); // 新增：控制视频是否正在加载
  const [isVideoReady, setIsVideoReady] = useState(false); // 新增：控制视频是否准备就绪
  const [loadingProgress, setLoadingProgress] = useState(0); // 新增：加载进度百分比
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null); // 新增：存储下载的视频blob
  const [isDownloading, setIsDownloading] = useState(false); // 新增：是否正在下载视频


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

  // 时间字符串转秒，如 0:0:4:17 => 4.017
  const timeStrToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    console.log('时间转换:', timeStr, 'parts:', parts);
    
    // 处理"时:分:秒:毫秒"格式
    if (parts.length === 4) {
      const [hours, minutes, seconds, milliseconds] = parts;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
      console.log('4段格式转换结果:', totalSeconds);
      return totalSeconds;
    }
    // 处理"时:分:秒"格式
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      console.log('3段格式转换结果:', totalSeconds);
      return totalSeconds;
    }
    // 处理"分:秒"格式
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      const totalSeconds = minutes * 60 + seconds;
      console.log('2段格式转换结果:', totalSeconds);
      return totalSeconds;
    }

    console.log('无法解析时间格式:', timeStr);
    return 0;
  };

  // 下载视频文件
  useEffect(() => {
    if (modalVisible && currentVideoInfo && !videoBlob && !isDownloading) {
      const downloadVideo = async () => {
        try {
          setIsDownloading(true);
          setLoadingProgress(0);
          
          console.log('开始下载视频:', currentVideoInfo.videoUrl);
          
          const response = await fetch(currentVideoInfo.videoUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('无法获取响应流');
          }
          
          const contentLength = response.headers.get('content-length');
          const total = contentLength ? parseInt(contentLength, 10) : 0;
          let receivedLength = 0;
          const chunks: Uint8Array[] = [];
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            receivedLength += value.length;
            
            if (total > 0) {
              const progress = (receivedLength / total) * 100;
              setLoadingProgress(progress);
              console.log(`下载进度: ${progress.toFixed(1)}%`);
            }
          }
          
          const blob = new Blob(chunks as BlobPart[], { type: 'video/mp4' });
          setVideoBlob(blob);
          setIsDownloading(false);
          setLoadingProgress(100);
          setIsVideoReady(true); // 下载完成后立即设置为准备就绪
          console.log('视频下载完成，大小:', blob.size, 'bytes');
          
        } catch (error) {
          console.error('视频下载失败:', error);
          setIsDownloading(false);
          setLoadingProgress(0);
        }
      };
      
      downloadVideo();
    }
  }, [modalVisible, currentVideoInfo, videoBlob, isDownloading]);

  // 初始化 Video.js 播放器
  useEffect(() => {
    console.log(`modalVisible: ${modalVisible}, currentVideoInfo: ${currentVideoInfo}, videoBlob: ${videoBlob}`);
    console.log('videoBlob size:', videoBlob?.size);
    if (!modalVisible || !currentVideoInfo || !videoBlob) {
      console.log('播放器初始化条件不满足，退出');
      return;
    }

    // 使用 requestAnimationFrame 确保 DOM 元素已经渲染
    const initPlayer = () => {
      console.log('initPlayer 被调用');
      if (!videoRef.current) {
        console.log('videoRef.current 仍然为 null，重试...');
        // 如果还没有渲染，继续等待
        requestAnimationFrame(initPlayer);
        return;
      }

      console.log('videoRef.current 已找到，开始初始化 Video.js');
      console.log('videoRef.current:', videoRef.current);

      // 销毁之前的播放器
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      
      // 声明定时器变量
      let progressInterval: NodeJS.Timeout | null = null;

      // 创建新的 Video.js 播放器
      const player = videojs(videoRef.current, {
        controls: true,
        fluid: false,
        responsive: false,
        preload: 'auto', // 改为 auto，确保视频完全加载
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'remainingTimeDisplay',
            'playbackRateMenuButton',
            'fullscreenToggle'
          ]
        },
        sources: [{
          src: URL.createObjectURL(videoBlob),
          type: 'video/mp4'
        }]
      });

      console.log('Video.js 播放器创建成功:', player);

      playerRef.current = player;

      // 设置初始时间
      const start = timeStrToSeconds(currentVideoInfo.start_time);
      const end = timeStrToSeconds(currentVideoInfo.end_time);

      player.ready(() => {
        console.log('Video.js 播放器准备就绪');
        setIsVideoLoading(false); // 播放器准备就绪，停止加载状态
        
        // 等待元数据加载完成后再设置时间
        player.on('loadedmetadata', () => {
          console.log('视频元数据加载完成，设置初始时间:', start);
          player.currentTime(start);
        });
        
        // 监听数据加载完成事件
        player.on('loadeddata', () => {
          console.log('视频数据加载完成，确保设置初始时间:', start);
          player.currentTime(start);
          console.log('当前播放时间:', player.currentTime());
          console.log('视频时长:', player.duration());
          console.log('缓冲状态:', player.buffered());
        });
        
        // 监听可以播放事件
        player.on('canplay', () => {
          console.log('视频可以播放，当前时间:', player.currentTime());
          console.log('视频时长:', player.duration());
          console.log('视频就绪状态:', player.readyState());
          // 由于视频已经下载完成，直接设置为准备就绪
          setIsVideoLoading(false);
          setIsVideoReady(true);
        });
        
        // 监听可以播放通过事件（更高级的缓冲状态）
        player.on('canplaythrough', () => {
          console.log('视频可以流畅播放，当前时间:', player.currentTime());
          // 由于视频已经下载完成，直接设置为准备就绪
          setIsVideoLoading(false);
          setIsVideoReady(true);
        });
        
        // 监听时间更新
        player.on('timeupdate', () => {
          if (player && typeof player.currentTime === 'function' && player.currentTime() >= end) {
            console.log('播放到结束时间，重新开始:', end);
            player.pause();
            player.currentTime(start);
            // 使用 setTimeout 延迟设置状态，避免 DOM 冲突
            setTimeout(() => {
              setIsPlaying(false); // 重置播放状态
            }, 50);
          }
        });
        
        // 监听播放开始事件
        player.on('play', () => {
          console.log('播放开始，当前时间:', player.currentTime());
          // 使用 setTimeout 延迟设置状态，避免 DOM 冲突
          setTimeout(() => {
            setIsPlaying(true); // 设置播放状态
          }, 50);
          // 确保从正确的时间开始播放
          if (player.currentTime() < start) {
            console.log('当前时间小于开始时间，重新设置:', start);
            player.currentTime(start);
          }
        });
        
        // 监听等待事件（视频缓冲中）
        player.on('waiting', () => {
          console.log('视频等待数据加载...');
          setIsVideoLoading(true); // 缓冲时显示loading
          setLoadingProgress(0); // 重置进度
        });
        
        // 监听进度事件（视频加载中）
        player.on('progress', () => {
          console.log('视频加载进度，当前时间:', player.currentTime());
          // 由于视频已经下载完成，不需要再检查缓冲状态
          setIsVideoLoading(false);
          setIsVideoReady(true);
        });
        
        // 监听播放暂停事件
        player.on('pause', () => {
          console.log('播放暂停');
          setIsPlaying(false); // 重置播放状态
        });
        
        // 监听播放结束事件
        player.on('ended', () => {
          console.log('播放结束');
          setIsPlaying(false); // 重置播放状态
        });
        
        // 确保控制栏可见
        setTimeout(() => {
          const videoElement = player.el() as HTMLElement;
          if (videoElement) {
            // 添加自定义样式
            videoElement.style.position = 'relative';
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            
            const controlBar = videoElement.querySelector('.vjs-control-bar');
            const progressBar = videoElement.querySelector('.vjs-progress-control');
            const playButton = videoElement.querySelector('.vjs-play-control');
            
            if (controlBar) {
              (controlBar as HTMLElement).style.display = 'flex';
              (controlBar as HTMLElement).style.visibility = 'visible';
              (controlBar as HTMLElement).style.opacity = '1';
              (controlBar as HTMLElement).style.position = 'absolute';
              (controlBar as HTMLElement).style.bottom = '0';
              (controlBar as HTMLElement).style.left = '0';
              (controlBar as HTMLElement).style.right = '0';
              (controlBar as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.7)';
            }
            if (progressBar) {
              (progressBar as HTMLElement).style.display = 'block';
              (progressBar as HTMLElement).style.visibility = 'visible';
            }
            if (playButton) {
              (playButton as HTMLElement).style.display = 'block';
              (playButton as HTMLElement).style.visibility = 'visible';
            }
          }
        }, 100);
      });

      // 清理函数
      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
        // 清理定时器
        if (progressInterval) {
          clearInterval(progressInterval);
        }
      };
    };

    // 开始初始化
    requestAnimationFrame(initPlayer);

    // 清理函数
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [modalVisible, currentVideoInfo, videoBlob]);

  // 弹窗关闭时重置视频状态
  useEffect(() => {
    if (modalVisible) {
      // 弹窗刚打开，重置播放状态
      setIsPlaying(false);
      setIsVideoLoading(false);
      setIsVideoReady(false);
      setLoadingProgress(0);
      setVideoBlob(null);
      setIsDownloading(false);
    } else {
      // 弹窗刚关闭，重置播放状态
      setIsPlaying(false);
      setIsVideoLoading(false);
      setIsVideoReady(false);
      setLoadingProgress(0);
      setVideoBlob(null);
      setIsDownloading(false);
      // 销毁播放器
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    }
  }, [modalVisible, currentVideoInfo]);



  const handlePlaySection = () => {
    console.log('handlePlaySection 被调用');
    console.log('playerRef.current:', !!playerRef.current);
    console.log('currentVideoInfo:', !!currentVideoInfo);
    console.log('videoBlob:', !!videoBlob);
    console.log('isVideoReady:', isVideoReady);
    
    if (playerRef.current && currentVideoInfo && videoBlob && isVideoReady) {
      const startSec = timeStrToSeconds(currentVideoInfo.start_time);
      const endSec = timeStrToSeconds(currentVideoInfo.end_time);
      
      console.log(`Video.js 播放片段:`, startSec, '到', endSec);
      console.log('播放器状态:', playerRef.current.readyState());
      
      // 确保播放器已准备就绪
      if (playerRef.current.readyState() >= 1) {
        // 使用 Video.js API 设置时间和播放
        console.log('设置播放时间:', startSec);
        playerRef.current.currentTime(startSec);
        
        // 延迟一点时间确保时间设置生效
        setTimeout(() => {
          console.log('当前播放时间:', playerRef.current.currentTime());
          playerRef.current.play().then(() => {
            console.log('Video.js 开始播放');
          }).catch((e: any) => {
            console.error('Video.js 播放失败:', e);
            setIsPlaying(false);
          });
        }, 200);
      } else {
        console.log('播放器未准备就绪，等待元数据加载...');
        // 等待元数据加载完成
        playerRef.current.one('loadedmetadata', () => {
          console.log('设置播放时间:', startSec);
          playerRef.current.currentTime(startSec);
          
          // 再等待数据加载完成
          playerRef.current.one('loadeddata', () => {
            console.log('数据加载完成，再次设置时间:', startSec);
            playerRef.current.currentTime(startSec);
            
            setTimeout(() => {
              console.log('当前播放时间:', playerRef.current.currentTime());
              playerRef.current.play().then(() => {
                console.log('Video.js 开始播放');
              }).catch((e: any) => {
                console.error('Video.js 播放失败:', e);
                setIsPlaying(false);
              });
            }, 200);
          });
        });
      }
    } else if (isDownloading) {
      console.log('视频正在下载中，请稍候...');
    } else if (isVideoLoading) {
      console.log('视频正在加载中，请稍候...');
    } else if (!videoBlob) {
      console.log('视频尚未下载完成，请等待下载...');
    } else if (!isVideoReady) {
      console.log('视频尚未准备就绪，请等待加载完成...');
    }
  };

  // 工具函数：将[IMG::xxxx]替换为Antd <Image>组件
  function renderContentWithImages(content: string) {
    if (!content) return null;
    const parts = [];
    let lastIndex = 0;
    const regex = /\[IMG::([a-zA-Z0-9]+)\]/g;
    let match;
    let key = 0;
    while ((match = regex.exec(content)) !== null) {
      // 文本部分
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>);
      }
      // 图片部分
      const imgId = match[1];
      parts.push(
        <>
          <Image
            key={key++}
            src={`${api_rag_host}/file/download/${imgId}`}
            alt='图片'
            style={{ maxWidth: 120, maxHeight: 120, margin: '0 4px', verticalAlign: 'middle' }}
            preview={true}
          />
          <br key={key++} />
        </>
      );
      lastIndex = match.index + match[0].length;
    }
    // 剩余文本
    if (lastIndex < content.length) {
      parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
    }
    return parts;
  }

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
                        ? renderContentWithImages(x.content_ltks.replace(/\[\{chunk_id:[^}]+\}\]/g, ''))
                        : ''}
                    </div>
                    {/* 渲染视频封面，点击弹窗播放指定区间 */}
                    {videoInfo && videoInfo.doc_id && (
                      <div
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          width: 200,
                          height: 100,
                          borderRadius: 8,
                          overflow: 'hidden'
                        }}
                        onClick={() => {
                          // const { data } = await getMinioDownloadUrl(videoInfo.doc_id)
                          // const videoUrl = data.data.replace('http://localhost:9000', 'http://119.84.128.68:6581/minio');
                          setCurrentVideoInfo({
                            ...videoInfo,
                            videoUrl: `/api/file/download/${videoInfo.doc_id}`,
                            content_ltks: x.content_ltks
                          });
                          setModalVisible(true);
                        }}
                      >
                        <img
                          src= {`/api/file/download/${videoInfo.cover_id}`}
                          alt="视频封面"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 24,
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: 8
                        }}>
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
        onCancel={() => {
          setModalVisible(false);
          // 销毁播放器
          if (playerRef.current) {
            playerRef.current.dispose();
            playerRef.current = null;
          }
        }}
        footer={null}
        width={600}
        destroyOnHidden
      >
        {currentVideoInfo && (
          <div style={{ textAlign: 'center', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ 
              borderRadius: 8, 
              overflow: 'hidden',
              backgroundColor: '#000',
              height: '400px',
              width: '100%',
              position: 'relative',
              marginBottom: '16px'
            }}>
              {(!videoBlob || isDownloading || !isVideoReady || isVideoLoading) && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  zIndex: 10,
                  color: '#fff',
                  fontSize: 16
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8 }}>
                      {isDownloading ? '正在下载视频...' : isVideoLoading ? '视频加载中...' : '等待视频准备...'}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {isDownloading ? `请稍候，正在下载视频文件 (${loadingProgress.toFixed(1)}%)` : 
                       isVideoLoading ? `请稍候，正在初始化播放器 (${loadingProgress.toFixed(1)}%)` : 
                       '正在准备视频播放器'}
                    </div>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                  className="video-js vjs-default-skin vjs-big-play-centered"
                  data-setup="{}"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#000'
                  }}
                />
            </div>

            {/* 渲染内容时去除所有 '[{chunk_id:...}]' 结构的文本 */}
            <div style={{ marginTop: 16, fontSize: 16, textAlign: 'left' }}>
              {currentVideoInfo.content_ltks
                ? renderContentWithImages(currentVideoInfo.content_ltks.replace(/\[\{chunk_id:[^}]+\}\]/g, ''))
                : ''}
            </div>
            <div style={{ marginTop: 10,fontSize: 16,color: '#676767' }}>
              相关片段: {formatTimeDisplay(currentVideoInfo.start_time)} - {formatTimeDisplay(currentVideoInfo.end_time)}
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                style={{ 
                  padding: '8px 16px', 
                  fontSize: 16, 
                  borderRadius: 4, 
                  background: (!videoBlob || isDownloading || !isVideoReady || isVideoLoading) ? '#ccc' : '#306EFD', 
                  color: '#fff', 
                  border: 'none', 
                  cursor: (isPlaying || isVideoLoading || !isVideoReady || isDownloading || !videoBlob) ? 'not-allowed' : 'pointer' 
                }}
                onClick={handlePlaySection}
                disabled={isPlaying || isVideoLoading || !isVideoReady || isDownloading || !videoBlob}
              >
                {isDownloading ? '正在下载视频...' : isVideoLoading ? '视频加载中...' : !videoBlob ? '等待视频下载...' : !isVideoReady ? '等待视频准备...' : isPlaying ? '播放中...' : '播放相关片段'}
              </button>
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
