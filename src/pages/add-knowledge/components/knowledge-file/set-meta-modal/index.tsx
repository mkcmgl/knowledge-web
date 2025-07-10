import { Form, Input, Button, Modal, message, Flex } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import styles from './index.less';
interface SetMetaModalProps {
  visible: boolean;
  onOk: (meta: string) => void;
  hideModal: () => void;
  initialMetaData?: Record<string, string> | string;
  loading?: boolean;
}

interface MetaItem {
  key: string;
  value: string;
}

const SetMetaModal = ({ visible, onOk, hideModal, initialMetaData = {}, loading = false }: SetMetaModalProps) => {
  const [form] = Form.useForm();

  // 兼容 initialMetaData 可能为 string 的情况
  let metaObj: Record<string, string> = {};
  console.log(`initialMetaData`,initialMetaData);
  if (typeof initialMetaData === 'string') {
    try {
      const parsed = JSON.parse(initialMetaData);
      if (typeof parsed === 'object' && parsed !== null) {
        metaObj = parsed;
      }
    } catch {
      metaObj = {};
    }
  } else if (typeof initialMetaData === 'object' && initialMetaData !== null) {
    metaObj = initialMetaData;
  }
  const metaListInit: MetaItem[] = Object.entries(metaObj).map(([key, value]) => ({ key, value }));

  // 打开时设置初始值
  useEffect(() => {
    form.setFieldsValue({ metaList: metaListInit.length ? metaListInit : [{ key: '', value: '' }] });
  }, [initialMetaData, visible]);

  // 提交处理
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 转为对象
      const metaObj: Record<string, string> = {};
      (values.metaList || []).forEach((item: MetaItem) => {
        if (item.key) metaObj[item.key] = item.value;
      });
      // 序列化
      const metaStr = JSON.stringify(metaObj, null, 4);
      onOk(metaStr); // 传给父组件
    } catch (e) {
      // 校验失败
    }
  };

  return (
    <Modal
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
      title={
        <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
          <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
          <span className='pl-2 text-[16px] font-bold'> 设置元数据</span>
        </div>
      }
      okButtonProps={{ loading }}
      destroyOnHidden
      width={700}
      className={styles.myModal}
    >
      <Form form={form} layout="horizontal">
        <Form.List name="metaList">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Flex key={key} style={{ marginBottom: 8, width: '100%' }} align="center" gap={8}>
                  <Form.Item
                    label="字段名"
                    {...restField}
                    name={[name, 'key']}
                    rules={[
                      { pattern: /^[a-zA-Z]*$/, message: '字段名只能输入英文字母' }
                    ]}
                    style={{ flex: 1, marginBottom: 0 }}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <Input placeholder="请输入字段名" allowClear />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="数据"
                    name={[name, 'value']}
                    rules={[{ message: '请输入数据' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                  >
                    <Input placeholder="请输入数据" allowClear />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ cursor: 'pointer', color: '#ff4d4f' }}
                  />
                </Flex>
              ))}
              <Form.Item>
                <div className='text-center mt-4'>
                  <Button
                    type="dashed"
                    style={{ width: 120, }}
                    onClick={() => {
                      if (fields.length < 50) {
                        add();
                      } else {
                        message.warning('最多只能添加50行数据');
                      }
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加元数据
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default SetMetaModal;
