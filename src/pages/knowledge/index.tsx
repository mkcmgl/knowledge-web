import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Empty,
  Flex,
  Form,
  Input,
  Pagination,
  Space,
  Spin,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useSaveKnowledge } from './hooks';
import KnowledgeCard from './knowledge-card';
// import ChatPage from './chat';
import knowledgeListImg from '@/assets/imgs/knowledgeList.png';
import knowledgeFileImg from '@/assets/imgs/knowledgeFile.png';
import knowledgeModelImg from '@/assets/imgs/knowledgeModel.png';
import { useFetchKnowledgeList } from '@/hooks/knowledge-hooks';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './index.less';
import KnowledgeCreatingModal from './knowledge-creating-modal';
import type { PaginationProps } from 'antd';
// import { useFetchUserInfo } from '@/hooks/user-hooks';

const KnowledgeList = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'knowledgeList' });
  const {
    visible,
    hideModal,
    showModal,
    onCreateOk,
    loading: creatingLoading,
  } = useSaveKnowledge();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState<{
    name: string;
    model: string;
    dateRange: [string, string] | null;
  }>({ name: '', model: '', dateRange: null });
  const { list, total, loading } = useFetchKnowledgeList(
    page,
    pageSize,
    searchFilters.name,
    searchFilters.model,
    searchFilters.dateRange,
  );

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setSearchFilters({
      name: values.name || '',
      model: values.model || '',
      dateRange: values.dateRange
        ? [
          values.dateRange[0].format('YYYY-MM-DD'),
          values.dateRange[1].format('YYYY-MM-DD'),
        ]
        : null,
    });
    setPage(1);
  };
  const handleReset = () => {
    form.resetFields();
    setSearchFilters({ name: '', model: '', dateRange: null });
    setPage(1);
  };
  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>上一页</a>;
    }
    if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  };
  const nextList = list || [];

  return (
    <section className={styles.knowledge}>
      <div className={styles.topWrapper}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className={styles.topButton}
          >
            {t('createKnowledgeBase')}
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Form
            form={form}
            layout="inline"
            className="flex-wrap"
            labelCol={{ style: { width: 80, textAlign: 'left' } }}
          >
            <Space size="middle" align="center" wrap style={{ columnGap: '0' }}>
              <Form.Item name="name" label="名称">
                <Input
                  placeholder="请输入知识库名称"
                  style={{ width: 190 }}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="model" label="嵌入模型">
                {/* 下拉选择模式，后续如需恢复可取消注释
                <Select
                  placeholder="请选择嵌入模型"
                  style={{ width: 190 }}
                  allowClear
                  options={[]}
                />
                */}
                <Input
                  placeholder="请输入嵌入模型"
                  style={{ width: 190 }}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="dateRange" label="创建时间">
                <DatePicker.RangePicker
                  style={{ width: 190 }}
                  format="YYYY-MM-DD"
                  allowClear
                />
              </Form.Item>
            </Space>
          </Form>
          <div
            style={{
              width: 172,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{ marginRight: 8 }}
            >
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.topUsrNum}>
        <div className={styles.topNumContent}>
          <div
            className={classNames(styles.knowledgeList, 'flex-1 text-center items-center')}
          >
            <div className="py-10 flex-1 text-left">
              <div style={{ color: '#1D2129', fontSize: 20, fontWeight: 500 }}>
                知识库
              </div>
              <div>
                <span className="font-semibold text-[18px]">
                  {Number(1999).toLocaleString()}
                </span>
                <span className="text-xs">个</span>
              </div>
            </div>
            <img
              src={knowledgeListImg}
              className={styles.responsiveImg}
              alt="知识库"
            />
          </div>
          <div
            className={classNames(styles.knowledgeList, 'flex-1 text-center  items-center')}
          >
            <div className="py-5 flex-1 text-left">
              <div style={{ color: '#1D2129', fontSize: 20, fontWeight: 500 }}>
                文档
              </div>
              <div>
                <span className="font-semibold text-[18px]">
                  {Number(1999).toLocaleString()}
                </span>
                <span className="text-xs">个</span>
              </div>
            </div>
            <img
              src={knowledgeFileImg}
              className={styles.responsiveImg}
              alt="文档"
            />
          </div>{' '}
          <div
            className={classNames(styles.knowledgeList, 'flex-1 text-center  items-center')}
          >
            <div className="py-5 flex-1 text-left">
              <div style={{ color: '#1D2129', fontSize: 20, fontWeight: 500 }}>
                嵌入模型
              </div>
              <div>
                <span className="font-semibold text-[18px]">
                  {Number(1999).toLocaleString()}
                </span>
                <span className="text-xs">个</span>
              </div>
            </div>
            <img
              src={knowledgeModelImg}
              className={styles.responsiveImg}
              alt="嵌入模型"
            />
          </div>{' '}

        </div>
      </div>
      <Spin spinning={loading}>
        <div >
          <Flex
            gap={'20px'}
            justify="center"
            wrap="wrap"
            className={styles.knowledgeCardContainer}
          >
            {nextList?.length > 0 ? (
              nextList.map((item: any, index: number) => {
                return (
                  <KnowledgeCard
                    item={item}
                    key={`${item?.name}-${index}`}
                  ></KnowledgeCard>
                );
              })
            ) : (
              <Empty className={styles.knowledgeEmpty}></Empty>
            )}
          </Flex>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              showQuickJumper
              itemRender={itemRender}
              // itemRender={(page, type, originalElement) => {
              //   if (type === 'prev') {
              //     return <a>上一页</a>;
              //   }
              //   if (type === 'next') {
              //     return <a>下一页</a>;
              //   }
              //   return originalElement;
              // }}
              align="center"
              pageSizeOptions={[5, 10, 20, 30, 50]}
              showTotal={(total) => (
                <span style={{
                  color: '#86909C',
                  lineHeight: '32px', marginRight: 16,
                }}>总共 {total} 页</span>
              )}
              onChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
              }}

            // itemRender={(page, type, originalElement) => {
            //   if (type === 'prev' || type === 'next') {
            //     const isDisabled =
            //       !!(originalElement && typeof originalElement === 'object' && 'props' in originalElement && originalElement.props?.disabled);
            //     return (
            //       <button
            //         type="button"
            //         disabled={isDisabled}
            //         style={{
            //           borderRadius: 4,
            //           background: isDisabled ? '#F5F5F6' : '#F2F3F5',
            //           color: isDisabled ? '#ff4d4f' : '#4E5969',
            //           border: 'none',
            //           padding: '0 12px',
            //           height: 32,
            //         }}
            //       >
            //         {type === 'prev' ? '上一页' : '下一页'}
            //       </button>
            //     );
            //   }
            //   return originalElement;
            // }}

            />
          </div>
        </div>
      </Spin>
      <KnowledgeCreatingModal
        loading={creatingLoading}
        visible={visible}
        hideModal={hideModal}
        onOk={onCreateOk}
      ></KnowledgeCreatingModal>
      {/* <span className={styles.title}>
        {t('welcome')}, {userInfo?.nickname}
      </span> */}
    </section>
  );
};

export default KnowledgeList;
