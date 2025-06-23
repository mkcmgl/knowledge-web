import { KnowledgeRouteKey } from '@/constants/knowledge';
import { IKnowledge } from '@/interfaces/database/knowledge';
import { formatDate } from '@/utils/date';
import { CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import { Badge, Card, Button } from 'antd';
import classNames from 'classnames';
import { useNavigate } from 'umi';

import OperateDropdown from '@/components/operate-dropdown';
import { useTheme } from '@/components/theme-provider';
import { useDeleteKnowledge } from '@/hooks/knowledge-hooks';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { useShowDeleteConfirm } from '@/hooks/common-hooks';
import styles from './index.less';

interface IProps {
  item: IKnowledge;
}

const KnowledgeCard = ({ item }: IProps) => {
  const navigate = useNavigate();
  const { data: userInfo } = useFetchUserInfo();
  const { theme } = useTheme();
  const { deleteKnowledge } = useDeleteKnowledge();
  const showDeleteConfirm = useShowDeleteConfirm();

  const removeKnowledge = async () => {
    return deleteKnowledge(item.id);
  };

  const handleDelete = () => {
    showDeleteConfirm({ onOk: removeKnowledge });
  };

  const handleCardClick = () => {
    navigate(`/knowledge/${KnowledgeRouteKey.Dataset}?id=${item.id}`, {
      state: { from: 'list' },
    });
  };

  return (
    <Badge.Ribbon
      text={item?.nickname}
      color={userInfo?.nickname === item?.nickname ? '#1677ff' : 'pink'}
      className={classNames(styles.ribbon, {
        [styles.hideRibbon]: item.permission !== 'team',
      })}
    >
      <Card className={styles.card} onClick={handleCardClick}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div>
              <CalendarOutlined className={styles.leftIcon} />
              <span
                className={theme === 'dark' ? styles.titledark : styles.title}
                style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {item.name}
              </span>
            </div>
            {/* <OperateDropdown deleteItem={removeKnowledge}></OperateDropdown> */}
          </div>
          <div className={styles.titleWrapper}>
            <div className='w-full flex justify-between'>
              <div className='text-center '>
                <div className='mb-2 font-bold'>文档</div>
                <div>{item.doc_num}</div>
              </div>
              <div className='text-center '>
                <div className='mb-2 font-bold'>嵌入模型</div>
                <div>{item.embd_id.split('@')[0]}</div>
              </div>
            </div>
            <span className={styles.time}>
              {formatDate(item.update_time)}
            </span>
          </div>
          <div className={styles.footer} >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={e => {
                  e.stopPropagation();
                  handleDelete();
                }}
                style={{ color: '#aaa', fontSize: 20, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'red')}
                onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
              />
          </div>
        </div>
      </Card>
    </Badge.Ribbon>
  );
};

export default KnowledgeCard;
