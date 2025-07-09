import MessageItem from '@/components/message-item';
import { MessageType } from '@/constants/chat';
import { Flex, Spin } from 'antd';
import {
  useCreateConversationBeforeUploadDocument,
  useGetFileIcon,
  useGetSendButtonDisabled,
  useSendButtonDisabled,
  useSendNextMessage,
} from '../hooks';
import { buildMessageItemReference } from '../utils';

import MessageInput from '@/components/message-input';
import PdfDrawer from '@/components/pdf-drawer';
import { useClickDrawer } from '@/components/pdf-drawer/hooks';
import {
  useFetchNextConversation,
  useGetChatSearchParams,
  useFetchNextDialog,
} from '@/hooks/chat-hooks';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { buildMessageUuidWithRole } from '@/utils/chat';
import { memo } from 'react';
import styles from './index.less';
import { ReactComponent as Robot } from '@/assets/svg/chat/robot.svg';
interface IProps {
  controller: AbortController;
}

const ChatContainer = ({ controller }: IProps) => {
  const { conversationId } = useGetChatSearchParams();
  const { data: conversation } = useFetchNextConversation();
  const { data: currentDialog } = useFetchNextDialog();


  const {
    value,
    ref,
    loading,
    sendLoading,
    derivedMessages,
    handleInputChange,
    handlePressEnter,
    regenerateMessage,
    removeMessageById,
    stopOutputMessage,
  } = useSendNextMessage(controller);

  const { visible, hideModal, documentId, selectedChunk, clickDocumentButton } =
    useClickDrawer();
  const disabled = useGetSendButtonDisabled();
  const sendDisabled = useSendButtonDisabled(value);
  useGetFileIcon();
  const { data: userInfo } = useFetchUserInfo();
  const { createConversationBeforeUploadDocument } =
    useCreateConversationBeforeUploadDocument();

  // 判断是否有消息
  const hasMessages = derivedMessages && derivedMessages.length > 1;

  return (
    <>
      <Flex
        flex={1}
        className={hasMessages ? styles.chatContainer : `${styles.chatContainer} ${styles.centeredChatContainer}`}
        vertical
      >
        <Flex
          flex={hasMessages ? 1 : 'unset'}
          vertical
          className={hasMessages ? styles.messageContainer : styles.messageContainerNoData}
        >
          {hasMessages ? (
            <div>
              <Spin spinning={loading}>
                {derivedMessages?.map((message, i) => (
                  <MessageItem
                    loading={
                      message.role === MessageType.Assistant &&
                      sendLoading &&
                      derivedMessages.length - 1 === i
                    }
                    key={buildMessageUuidWithRole(message)}
                    item={message}
                    nickname={userInfo.nickname}
                    avatar={userInfo.avatar}
                    avatarDialog={currentDialog.icon}
                    reference={buildMessageItemReference(
                      {
                        message: derivedMessages,
                        reference: conversation.reference,
                      },
                      message,
                    )}
                    clickDocumentButton={clickDocumentButton}
                    index={i}
                    removeMessageById={removeMessageById}
                    regenerateMessage={regenerateMessage}
                    sendLoading={sendLoading}
                  />
                ))}
              </Spin>
            </div>
          ) : (
            <div className="flex items-center justify-center" style={{
              marginBottom: 50, width: '100%', height: '100%',
              fontSize: 28,
              fontWeight: 600,
              color: ' #333333'
            }}>
              <Robot style={{ marginRight: 12 }} />
              <span>我是您的个人助理，有什么可以帮忙的吗?</span>

            </div>
          )}
          <div ref={ref} />
        </Flex>
        <MessageInput
          disabled={disabled}
          sendDisabled={sendDisabled}
          sendLoading={sendLoading}
          value={value}
          onInputChange={handleInputChange}
          onPressEnter={handlePressEnter}
          conversationId={conversationId}
          createConversationBeforeUploadDocument={
            createConversationBeforeUploadDocument
          }
          stopOutputMessage={stopOutputMessage}
        ></MessageInput>
      </Flex>
      <PdfDrawer
        visible={visible}
        hideModal={hideModal}
        documentId={documentId}
        chunk={selectedChunk}
      ></PdfDrawer>
    </>
  );
};

export default memo(ChatContainer);
