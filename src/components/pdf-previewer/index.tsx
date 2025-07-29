import {
  useGetChunkHighlights,
  useGetDocumentUrl,
} from '@/hooks/document-hooks';
import { IReferenceChunk } from '@/interfaces/database/chat';
import { IChunk } from '@/interfaces/database/knowledge';
import FileError from '@/pages/document-viewer/file-error';
import { Skeleton } from 'antd';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  AreaHighlight,
  Highlight,
  IHighlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
} from 'react-pdf-highlighter';
import { useCatchDocumentError } from './hooks';

import styles from './index.less';

interface IProps {
  chunk: IChunk | IReferenceChunk;
  documentId: string;
  visible: boolean;
}

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const DocumentPreviewer = ({ chunk, documentId, visible }: IProps) => {
  const getDocumentUrl = useGetDocumentUrl(documentId);
  const { highlights: state, setWidthAndHeight } = useGetChunkHighlights(chunk);
  const ref = useRef<(highlight: IHighlight) => void>(() => { });
  const [loaded, setLoaded] = useState(false);
  const url = getDocumentUrl();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    const token = 'Bearer ragflow-' + localStorage.getItem('Authorization');
    if (!url || !token) return;
    
    // 如果已清空，不重新加载
    if (isCleared) return;
    
    fetch(url, {
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.blob())
      .then(blob => {
        const localUrl = URL.createObjectURL(blob);
        setPdfUrl(localUrl);
        return () => URL.revokeObjectURL(localUrl);
      });
  }, [url, documentId, isCleared]);

  const error = useCatchDocumentError(url);

  const resetHash = () => { };

  // 清空文档内容的函数
  const clearDocument = useCallback(() => {
    console.log('清空PDF文档内容');
    // 清空PDF URL
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl('');
    }
    // 重置加载状态
    setLoaded(false);
    // 重置高亮引用
    ref.current = () => {};
    // 标记为已清空
    setIsCleared(true);
  }, [pdfUrl]);

  // 当visible变为false时清空文档
  useEffect(() => {
    if (!visible) {
      clearDocument();
    } else {
      // 当visible变为true时，重置清空状态
      setIsCleared(false);
    }
  }, [visible, clearDocument]);

  useEffect(() => {
    setLoaded(visible);
  }, [visible]);

  useEffect(() => {
    if (state.length > 0 && loaded) {
      setLoaded(false);
      ref.current(state[0]);
    }
  }, [state, loaded]);

  return (
    <div className={styles.documentContainer}>
      {!isCleared && (
        <PdfLoader
          url={pdfUrl}
          beforeLoad={<Skeleton active />}
          workerSrc="/pdfjs-dist/pdf.worker.min.js"
          errorMessage={<FileError>{error}</FileError>}
        >
          {(pdfDocument) => {
            pdfDocument.getPage(1).then((page) => {
              const viewport = page.getViewport({ scale: 1 });
              const width = viewport.width;
              const height = viewport.height;
              setWidthAndHeight(width, height);
            });

            return (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                scrollRef={(scrollTo) => {
                  ref.current = scrollTo;
                  setLoaded(true);
                }}
                onSelectionFinished={() => null}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo,
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image,
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={() => { }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, () => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                    >
                      {component}
                    </Popup>
                  );
                }}
                highlights={state}
              />
            );
          }}
        </PdfLoader>
      )}
    </div>
  );
};

export default DocumentPreviewer;
