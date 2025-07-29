import { IModalProps } from '@/interfaces/common';
import { IReferenceChunk } from '@/interfaces/database/chat';
import { IChunk } from '@/interfaces/database/knowledge';
import { Drawer } from 'antd';
import DocumentPreviewer from '../pdf-previewer';

interface IProps extends IModalProps<any> {
  documentId: string;
  chunk: IChunk | IReferenceChunk;
}

export const PdfDrawer = ({
  visible = false,
  hideModal,
  documentId,
  chunk,
}: IProps) => {

console.log(`documentId,chunk----------`,documentId,chunk);

  // 处理抽屉关闭，清空文档内容
  const handleClose = () => {
    // 可以在这里添加清空文档内容的逻辑
    // DocumentPreviewer 会自动处理清空逻辑，因为 visible 会变为 false
    hideModal?.();
  };

  return (
    <Drawer
      title="查看文档"
      onClose={handleClose}
      open={visible}
      width={'50vw'}
      destroyOnHidden
    >
      <DocumentPreviewer
        documentId={documentId}
        chunk={chunk}
        visible={visible}
      ></DocumentPreviewer>
    </Drawer>
  );
};

export default PdfDrawer;
