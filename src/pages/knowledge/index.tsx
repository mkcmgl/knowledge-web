import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Button,
  Empty,
  Flex,
  Input,
  Space,
  Spin,
  Pagination,
  Form,
  DatePicker,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useSaveKnowledge } from './hooks';
import KnowledgeCard from './knowledge-card';
// import ChatPage from './chat';
import KnowledgeCreatingModal from './knowledge-creating-modal';
import { useState } from 'react';
import styles from './index.less';
import { useFetchKnowledgeList } from '@/hooks/knowledge-hooks';
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
  const [searchFilters, setSearchFilters] = useState<{ name: string; model: string; dateRange: [string, string] | null }>({ name: '', model: '', dateRange: null });
  const { list, total, loading } = useFetchKnowledgeList(page, pageSize, searchFilters.name, searchFilters.model, searchFilters.dateRange);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setSearchFilters({
      name: values.name || '',
      model: values.model || '',
      dateRange: values.dateRange
        ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')]
        : null,
    });
    setPage(1);
  };
  const handleReset = () => {
    form.resetFields();
    setSearchFilters({ name: '', model: '', dateRange: null });
    setPage(1);
  };

  const nextList = list || [];

  return (
    <Flex className={styles.knowledge} vertical flex={1}>
      <div className={styles.topWrapper} >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginBottom:'30px' }} >
          <div></div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className={styles.topButton}
          >
            {t('createKnowledgeBase')}
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
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
          <div style={{ width: 200, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} >
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ marginRight: 8 }}>查询</Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset} >重置</Button>

          </div>
        </div>

      </div>
      <Spin spinning={loading}>
        <div style={{ padding: '0 16px' }}>
          <Flex
            gap={'large'}
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
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              align="end"
              pageSizeOptions={[5, 10, 20, 30, 50]}
              showTotal={total => `总共 ${total}`}
              onChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
              }}
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
    </Flex>
  );
};

export default KnowledgeList;
