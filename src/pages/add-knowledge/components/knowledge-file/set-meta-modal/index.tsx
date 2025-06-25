import { IModalProps } from '@/interfaces/common';
import { IDocumentInfo } from '@/interfaces/database/document';
import Editor from '@monaco-editor/react';

import { Form, Modal } from 'antd';
import DOMPurify from 'dompurify';
import { useCallback, useEffect } from 'react';


type FieldType = {
  meta?: string;
};

export function SetMetaModal({
  visible,
  hideModal,
  onOk,
  initialMetaData,
}: IModalProps<any> & { initialMetaData?: IDocumentInfo['meta_fields'] }) {
  const [form] = Form.useForm();

  const handleOk = useCallback(async () => {
    const values = await form.validateFields();
    onOk?.(values.meta);
  }, [form, onOk]);

  useEffect(() => {
    form.setFieldValue('meta', JSON.stringify(initialMetaData, null, 4));
  }, [form, initialMetaData]);

  return (
    <Modal
      title='设置元数据'
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
    >
      <Form
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        layout={'vertical'}
        form={form}
      >
        <Form.Item<FieldType>
          label='元数据'
          name="meta"
          rules={[
            {
              required: true,
              validator(rule, value) {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(
                    new Error('请输入JSON'),
                  );
                }
              },
            },
          ]}
          tooltip={
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  `<p>元数据为 Json 格式（不可搜索）。如果提示中包含此文档的任何块，它将被添加到 LLM 的提示中。</p>
<p>示例：</p>
<b>元数据为：</b><br>
<code>
{
“作者”：“mengguolin”，
“日期”：“2024-11-12”
}
</code><br>
<b>提示将为：</b><br>
<p>文档：the_name_of_document</p>
<p>作者：mengguolin</p>
<p>日期：2024-11-12</p>
<p>相关片段如下：</p>
<ul>
<li> 这是块内容....</li>
<li> 这是块内容....</li>
</ul>
`
                ),
              }}
            ></div>
          }
        >
          <Editor height={200} defaultLanguage="json" theme="vs-dark" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
