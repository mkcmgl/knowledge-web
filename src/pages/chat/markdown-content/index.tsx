import MyImage from '@/components/image';
import SvgIcon from '@/components/svg-icon';
import { IReference, IReferenceChunk } from '@/interfaces/database/chat';
import { getExtension } from '@/utils/document-util';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Popover, Image, Modal } from 'antd';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import reactStringReplace from 'react-string-replace';
import SyntaxHighlighter from 'react-syntax-highlighter';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { visitParents } from 'unist-util-visit-parents';
import { api_rag_host } from '@/utils/api';
import { useFetchDocumentThumbnailsByIds } from '@/hooks/document-hooks';
import { useTranslation } from 'react-i18next';
import { fetchVideoChunks, getMinioDownloadUrl } from '@/services/knowledge-service';

import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you

import {
  preprocessLaTeX,
  replaceThinkToSection,
  showImage,
} from '@/utils/chat';
import { currentReg, replaceTextByOldReg } from '../utils';

import classNames from 'classnames';
import { pipe } from 'lodash/fp';
import styles from './index.less';

const getChunkIndex = (match: string) => Number(match.slice(2, -2));
// TODO: The display of the table is inconsistent with the display previously placed in the MessageItem.
const MarkdownContent = ({
  reference,
  clickDocumentButton,
  content,
}: {
  content: string;
  loading: boolean;
  reference: IReference;
  clickDocumentButton?: (documentId: string, chunk: IReferenceChunk) => void;
}) => {
  const { t } = useTranslation();
  const { setDocumentIds, data: fileThumbnails } =
    useFetchDocumentThumbnailsByIds();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoInfo, setCurrentVideoInfo] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const contentWithCursor = useMemo(() => {
    // let text = DOMPurify.sanitize(content);
    let text = content;
    if (text === '') {
      text = t('chat.searching');
    }
    const nextText = replaceTextByOldReg(text);
    return pipe(replaceThinkToSection, preprocessLaTeX)(nextText);
  }, [content, t]);

  useEffect(() => {
    const docAggs = reference?.doc_aggs;
    setDocumentIds(Array.isArray(docAggs) ? docAggs.map((x) => x.doc_id) : []);
  }, [reference, setDocumentIds]);

  // 时间字符串转秒
  const timeStrToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 4) {
      const [hours, minutes, seconds, milliseconds] = parts;
      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    }
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  // 处理视频播放
  const handlePlaySection = () => {
    if (videoRef.current && currentVideoInfo) {
      const startSec = timeStrToSeconds(currentVideoInfo.start_time);
      const endSec = timeStrToSeconds(currentVideoInfo.end_time);
      videoRef.current.currentTime = startSec;
      videoRef.current.play().catch(e => console.error('播放失败:', e));
      setIsPlaying(true);

      const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= endSec) {
          videoRef.current.pause();
          videoRef.current.currentTime = startSec;
          setIsPlaying(false);
        }
      };

      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  };

  // 弹窗关闭时重置视频状态
  useEffect(() => {
    if (modalVisible) {
      setIsPlaying(false);
      if (videoRef.current && currentVideoInfo) {
        const startSec = timeStrToSeconds(currentVideoInfo.start_time);
        videoRef.current.currentTime = startSec;
        videoRef.current.pause();
      }
    } else {
      setIsPlaying(false);
      if (videoRef.current && currentVideoInfo) {
        videoRef.current.pause();
        const startSec = timeStrToSeconds(currentVideoInfo.start_time);
        videoRef.current.currentTime = startSec;
      }
    }
  }, [modalVisible, currentVideoInfo]);

  // 合并图片和视频的渲染，保证顺序
  function renderContentWithImagesAndVideos(content: string) {
    if (!content) return null;
    const parts = [];
    let lastIndex = 0;
    // 匹配[{chunk_id:xxx}]或[IMG::xxx]
    const regex = /\[\{chunk_id:([a-zA-Z0-9]+)\}\]|\[IMG::([a-zA-Z0-9]+)\]/g;
    let match;
    let key = 0;
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>);
      }
      if (match[1]) {
        // 视频按钮
        const chunkId = match[1];
        parts.push(
          <Button
            key={key++}
            type="primary"
            size="small"
            style={{ margin: '0 4px' }}
            onClick={async () => {
              setModalVisible(true);
              setIsLoadingVideo(true);
              setCurrentVideoInfo(null);
              try {
                const { data: videoData } = await fetchVideoChunks([chunkId]);
                if (videoData.data && videoData.data.length > 0) {
                  const videoInfo = videoData.data[0];
                  if (videoInfo.doc_id) {
                    const { data: urlData } = await getMinioDownloadUrl(videoInfo.doc_id);
                    const videoUrl = urlData.data.replace('http://localhost:9000', 'http://119.84.128.68:6581/minio');
                    setCurrentVideoInfo({
                      ...videoInfo,
                      videoUrl: videoUrl
                    });
                  }
                }
              } catch (error) {
                console.error('获取视频信息失败:', error);
                setModalVisible(false);
              } finally {
                setIsLoadingVideo(false);
              }
            }}
          >
            查看视频
          </Button>
        );
      } else if (match[2]) {
        // 图片
        const imgId = match[2];
        parts.push(
          <div key={key++}>
            <Image
              src={`${api_rag_host}/file/download/${imgId}`}
              alt='图片'
              style={{ maxWidth: 120, maxHeight: 120, margin: '0 4px', verticalAlign: 'middle' }}
              preview={true}
            />
            <br />
          </div>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
    }
    return parts;
  }

  const handleDocumentButtonClick = useCallback(
    (
      documentId: string,
      chunk: IReferenceChunk,
      isPdf: boolean,
      documentUrl?: string,
    ) =>
      () => {
        // console.log(`handleDocumentButtonClick`, documentId, chunk, isPdf, documentUrl)
        if (!isPdf) {
          if (!documentUrl) {
            //  clickDocumentButton?.(documentId, chunk);
            return;
          }

          window.open(documentUrl, '_blank');
        } else {

          clickDocumentButton?.(documentId, chunk);
        }
      },
    [clickDocumentButton],
  );

  const rehypeWrapReference = () => {
    return function wrapTextTransform(tree: any) {
      visitParents(tree, 'text', (node, ancestors) => {
        const latestAncestor = ancestors.at(-1);
        if (
          latestAncestor.tagName !== 'custom-typography' &&
          latestAncestor.tagName !== 'code'
        ) {
          node.type = 'element';
          node.tagName = 'custom-typography';
          node.properties = {};
          node.children = [{ type: 'text', value: node.value }];
        }
      });
    };
  };

  const getReferenceInfo = useCallback(
    (chunkIndex: number) => {
      const chunks = reference?.chunks ?? [];
      const chunkItem = chunks[chunkIndex];
      const document = reference?.doc_aggs?.find(
        (x) => x?.doc_id === chunkItem?.document_id,
      );
      const documentId = document?.doc_id;
      const documentUrl = document?.url;
      const fileThumbnail = documentId ? fileThumbnails[documentId] : '';
      const fileExtension = documentId ? getExtension(document?.doc_name) : '';
      const imageId = chunkItem?.image_id;

      return {
        documentUrl,
        fileThumbnail,
        fileExtension,
        imageId,
        chunkItem,
        documentId,
        document,
      };
    },
    [fileThumbnails, reference?.chunks, reference?.doc_aggs],
  );

  const getPopoverContent = useCallback(
    (chunkIndex: number) => {
      const {
        documentUrl,
        fileThumbnail,
        fileExtension,
        imageId,
        chunkItem,
        documentId,
        document,
      } = getReferenceInfo(chunkIndex);
      // console.log(`getPopoverContent`, documentUrl, fileThumbnail, fileExtension, imageId, chunkItem, documentId, document);
      return (
        <div key={chunkItem?.id} className="flex gap-2">
          {imageId && (
            <Popover
              placement="left"
              content={
                <MyImage
                  id={imageId}
                  className={styles.referenceImagePreview}
                ></MyImage>
              }
            >
              <MyImage
                id={imageId}
                className={styles.referenceChunkImage}
              ></MyImage>
            </Popover>
          )}
          <div className={'space-y-2 max-w-[40vw]'}>
            {/* 提示内容 chunk内容 */}
            <div
              // dangerouslySetInnerHTML={{
              //   __html: DOMPurify.sanitize(
              //     chunkItem?.content ?? ''),
              // }}
              className={classNames(styles.chunkContentText)}
            >{renderContentWithImagesAndVideos(chunkItem?.content ?? '')}</div>
            {documentId && (
              <Flex gap={'small'}>
                {fileThumbnail ? (
                  <img
                    src={fileThumbnail}
                    alt=""
                    className={styles.fileThumbnail}
                  />
                ) : (
                  <SvgIcon
                    name={`file-icon/${fileExtension}`}
                    width={24}
                  ></SvgIcon>
                )}
                <Button
                  type="link"
                  className={classNames(styles.documentLink, 'text-wrap')}
                  onClick={handleDocumentButtonClick(
                    documentId,
                    chunkItem,
                    fileExtension === 'pdf',
                    documentUrl,
                  )}
                >
                  {document?.doc_name}
                </Button>
              </Flex>
            )}
          </div>
        </div>
      );
    },
    [getReferenceInfo, handleDocumentButtonClick],
  );

  const renderReference = useCallback(
    (text: string) => {
      // console.log(`test`, text);
      let replacedText = reactStringReplace(text, currentReg, (match, i) => {
        const chunkIndex = getChunkIndex(match);

        const { documentUrl, fileExtension, imageId, chunkItem, documentId } =
          getReferenceInfo(chunkIndex);

        const docType = chunkItem?.doc_type;
        // console.log(`docType,documentUrl, fileExtension, imageId, chunkItem, documentId`, docType, documentUrl, fileExtension, imageId, chunkItem, documentId);
        if (showImage(docType)) {
          return (
            <MyImage
              key={i}
              id={imageId}
              className={styles.referenceInnerChunkImage}
              type={fileExtension === 'pdf'}
              onClick={
                documentId
                  ? handleDocumentButtonClick(
                    documentId,
                    chunkItem,
                    fileExtension === 'pdf',
                    documentUrl,
                  )
                  : () => { console.log(`documentIdfalse`, documentId); }
              }
            />
          );
        } else {
          return (
            <Popover content={getPopoverContent(chunkIndex)} key={i}>
              <InfoCircleOutlined className={styles.referenceIcon} />
            </Popover>
          );
        }
      });

      // replacedText = reactStringReplace(replacedText, curReg, (match, i) => (
      //   <span className={styles.cursor} key={i}></span>
      // ));

      return replacedText;
    },
    [getPopoverContent, getReferenceInfo, handleDocumentButtonClick],
  );

  // 折叠控制section.think（自定义section渲染，保证children走markdown逻辑）
  const [thinkOpen, setThinkOpen] = useState(true);
  const markdownComponents = useMemo(() => ({
    section: ({ className, children, ...rest }: { className?: string; children?: React.ReactNode }) => {
      if (className && className.includes('think')) {
        return (
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                justifyContent: "space-between",
                marginBottom: 8,
              }}
              onClick={() => setThinkOpen(v => !v)}
            >

              <span style={{ marginLeft: 8, fontWeight: 500 }}>思考过程</span>
              <svg width="16" height="16" style={{ verticalAlign: 'middle', transition: 'transform 0.2s' }} viewBox="0 0 1024 1024">
                <path d={thinkOpen
                  ? 'M192 352l320 320 320-320z' // 向下
                  : 'M192 672l320-320 320 320z' // 向上
                } fill="#666" />
              </svg>
            </div>
            <section
              className={className}
              style={{
                display: thinkOpen ? 'block' : 'none',
                background: '#f6f8fa',
                padding: 12,
                borderRadius: 6,
                transition: 'all 0.2s'
              }}
              {...rest}
            >
              {children}
            </section>
          </div>
        );
      }
      // 其它 section 正常渲染
      return <section className={className} {...rest}>{children}</section>;
    },
    'custom-typography': ({ children }: { children: string }) =>
      renderReference(children),
    code(props: any) {
      const { children, className, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          language={match[1]}
          wrapLongLines
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code {...rest} className={classNames(className, 'text-wrap')}>
          {children}
        </code>
      );
    },
  }), [thinkOpen, renderReference]);

  return (
    <div>
      <Markdown
        rehypePlugins={[rehypeWrapReference, rehypeKatex, rehypeRaw]}
        remarkPlugins={[remarkGfm, remarkMath]}
        className={styles.markdownContentWrapper}
        components={markdownComponents as any}
      >
        {contentWithCursor}
      </Markdown>
      {/* 视频弹窗 */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        destroyOnHidden
      >
        {isLoadingVideo ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div>正在加载视频...</div>
          </div>
        ) : currentVideoInfo ? (
          <div style={{ textAlign: 'center' }}>
            <video
              ref={videoRef}
              src={currentVideoInfo.videoUrl}
              controls
              width="100%"
              poster={currentVideoInfo.cover_url || undefined}
              style={{ borderRadius: 8, background: '#000' }}
            />
            <div style={{ marginTop: 16 }}>
              当前播放区间: {currentVideoInfo.start_time} - {currentVideoInfo.end_time}
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                style={{ padding: '8px 16px', fontSize: 16, borderRadius: 4, background: '#306EFD', color: '#fff', border: 'none', cursor: isPlaying ? 'not-allowed' : 'pointer' }}
                onClick={handlePlaySection}
                disabled={isPlaying}
              >
                {isPlaying ? '播放中...' : '播放区间'}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default MarkdownContent;
