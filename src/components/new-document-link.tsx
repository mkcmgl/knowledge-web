import {
  getExtension,
  isSupportedPreviewDocumentType,
} from '@/utils/document-util';
import React, { useState } from 'react';
import { Modal } from 'antd';
import { getMinioDownloadUrl } from '@/services/knowledge-service';

interface IProps extends React.PropsWithChildren {
  link?: string;
  preventDefault?: boolean;
  color?: string;
  documentName: string;
  documentId?: string;
  prefix?: string;
  className?: string;
}

const NewDocumentLink = ({
  children,
  link,
  preventDefault = false,
  color = 'rgb(15, 79, 170)',
  documentId,
  documentName,
  prefix = 'file',
  className,
}: IProps) => {
  let nextLink = link;
  const extension = getExtension(documentName);
  if (!link) {
    nextLink = `/api/file/download//${documentId}?ext=${extension}&prefix=${prefix}`;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    if (documentName && documentName.toLowerCase().endsWith('.mp4') && documentId) {
      e.preventDefault();
      setModalVisible(true);
      setLoading(true);
      try {
        const { data } = await getMinioDownloadUrl([documentId]);
        let url = data.data;
        url = url.replace('http://localhost:9000', 'http://119.84.128.68:6581/minio');
        setVideoUrl(url);
      } catch (err) {
        setVideoUrl(undefined);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <a
        target="_blank"
        onClick={
          documentName && documentName.toLowerCase().endsWith('.mp4')
            ? handleClick
            : (!preventDefault || isSupportedPreviewDocumentType(extension)
                ? undefined
                : (e) => e.preventDefault())
        }
        href={nextLink}
        rel="noreferrer"
        style={{ color: className ? '' : color, wordBreak: 'break-all' }}
        className={className}
      >
        {children}
      </a>
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        destroyOnHidden
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>视频加载中...</div>
        ) : videoUrl ? (
          <video
            src={videoUrl}
            controls
            width="100%"
            style={{ borderRadius: 8, background: '#000' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>视频加载失败</div>
        )}
      </Modal>
    </>
  );
};

export default NewDocumentLink;
