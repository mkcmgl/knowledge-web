import { useFetchNextChunkList } from '@/hooks/chunk-hooks';
import { Modal, Spin } from 'antd';
import { useEffect } from 'react';
import { useSearchParams } from 'umi';
import DocumentPreview from '../../knowledge-chunk/components/document-preview/preview';
import { useGetChunkHighlights } from '../../knowledge-chunk/hooks';
import styles from './index.less';

export interface IProps {
    visible: boolean;
    hideModal: () => void;
    docId: string;
}

const PreviewModal = ({ visible, hideModal, docId }: IProps) => {
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (visible && docId) {
            console.log('Setting doc_id:', docId);
            setSearchParams({ doc_id: docId });
        }
    }, [visible, docId, setSearchParams]);

    const {
        data: { documentInfo, data = [] },
        loading,
    } = useFetchNextChunkList();
    
    console.log('documentInfo:', documentInfo);
    console.log('docId:', docId);
    const isPdf = documentInfo?.type === 'pdf';
    console.log('isPdf:', isPdf);

    const { highlights, setWidthAndHeight } = useGetChunkHighlights(docId);

    return (
        <Modal
            title={<div style={{ textAlign: 'center', fontSize: '16px' }}>预览</div>}
            open={visible}
            onCancel={hideModal}
            width={800}
            footer={null}
            className={styles.previewModal}
        >
              
            <div className={styles.chunkPage}>
                <Spin spinning={loading}>
                    
                    {isPdf ? (
                        <DocumentPreview
                            highlights={highlights}
                            setWidthAndHeight={setWidthAndHeight}
                        />
                    ) : (
                        <div className={styles.textContent}>
                            {data.map((item) => (
                                <div key={item.chunk_id} className={styles.textItem}>
                                    <div className={styles.textTitle}> {item.content_with_weight}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </Spin>
            </div>
        </Modal>
    );
};

export default PreviewModal;
