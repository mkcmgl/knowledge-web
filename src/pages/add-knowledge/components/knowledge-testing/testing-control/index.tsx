import Rerank from '@/components/rerank';
import SimilaritySlider from '@/components/similarity-slider';
import { useTranslate } from '@/hooks/common-hooks';
import { useChunkIsTesting } from '@/hooks/knowledge-hooks';
import { Button, Divider, Flex, Form, Input, InputNumber, Space, message } from 'antd';
import { FormInstance } from 'antd/lib';
import { LabelWordCloud } from './label-word-cloud';

import { CrossLanguageItem } from '@/components/cross-language-item';
import { UseKnowledgeGraphItem } from '@/components/use-knowledge-graph-item';
import styles from './index.less';
import DOMPurify from 'dompurify';
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import Editor, { loader } from '@monaco-editor/react';
import { useState } from 'react';


loader.config({ paths: { vs: '/vs' } });
type FieldType = {
  similarity_threshold?: number;
  vector_similarity_weight?: number;
  question: string;
  meta?: string;
};

interface IProps {
  form: FormInstance;
  handleTesting: (documentIds?: string[]) => Promise<any>;
  selectedDocumentIds: string[];
}

const TestingControl = ({
  form,
  handleTesting,
  selectedDocumentIds,
}: IProps) => {
  const question = Form.useWatch('question', { form, preserve: true });
  const loading = useChunkIsTesting();
  const { t } = useTranslate('knowledgeDetails');
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [questionList, setQuestionList] = useState<string[]>([]);
  const [questionInputError, setQuestionInputError] = useState<string | null>(null);
  const buttonDisabled =
    !question || (typeof question === 'string' && question.trim() === '');
  const handleAddQuestion = () => {
    const value = questionInput.trim();
    if (!value) {
      setQuestionInputError(t('testTextPlaceholder'));
      return;
    }
    setQuestionInputError(null);
    const newQuestionList = [...questionList, value];
    setQuestionList(newQuestionList);
    // 同步到 form 的 question 字段
    form.setFieldsValue({ question: newQuestionList });
    setQuestionInput('');
  };
  const handleDeleteQuestion = (idx: number) => {
    const newQuestionList = questionList.filter((_, i) => i !== idx);
    setQuestionList(newQuestionList);
    // 同步到 form 的 question 字段
    form.setFieldsValue({ question: newQuestionList });
  };

  const onClick = async () => {
    try {
      // 如果输入框有内容，先尝试加进去
      if (questionInput.trim()) {
        if (!questionInput.trim()) {
          setQuestionInputError(t('testTextPlaceholder'));
          return;
        } else {
          setQuestionInputError(null);
          const newQuestionList = [...questionList, questionInput.trim()];
          setQuestionList(newQuestionList);
          form.setFieldsValue({ question: newQuestionList });
          setQuestionInput('');
        }
      }
      await form.validateFields();
      const formQuestions = form.getFieldValue('question') || [];
      if (formQuestions.length === 0) {
        message.warning('请至少输入一个问题');
        return;
      }
      // 调用原有的handleTesting函数
      handleTesting(selectedDocumentIds);
    } catch (error) { }

  };

  return (
    <section className={styles.testingControlWrapper}>
      <div>
        <Flex justify='center' align='center' >
          <h3 style={{ color: '#1D2129', fontSize: "20px", fontWeight: 600, marginBottom: 16 }}>{t('testing')}</h3>
        </Flex>
      </div>
      <Flex justify='center' align='center' >
        <div className={styles.testingControlTip}>
          <div>  <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" style={{ width: 20, height: 20, marginRight: 8, }} viewBox="0 0 20 20">
            <defs>
              <clipPath id="master_svg0_2_7215">
                <rect x="0" y="0" width="20" height="20" rx="0" style={{ width: 20, height: 20, }} />
              </clipPath>
            </defs>
            <g clipPath="url(#master_svg0_2_7215)">
              <g>
                <path d="M10,1.25C14.8307,1.25,18.75,5.16387,18.75,10C18.75,14.8361,14.8361,18.75,10,18.75C5.16387,18.75,1.25,14.8361,1.25,10C1.25,5.16387,5.16934,1.25,10,1.25ZM11.09238,13.2826L8.90762,13.2826L8.90762,15.4674L11.09238,15.4674L11.09238,13.2826ZM11.09238,4.53262L8.90762,4.53262L8.90762,11.09238L11.09238,11.09238L11.09238,4.53262Z" fill="#F9CA06" fillOpacity="1" style={{ width: 20, height: 20, }} />
              </g>
            </g>
          </svg></div>
          <p className={styles.testingDescription}>{t('testingDescription')}</p>
        </div>
      </Flex>

      <section>
        <Form
          name="testing"
          layout="horizontal"
          form={form}
          // labelCol={{ span: 4 }}
          // wrapperCol={{ span: 20 }}
          labelCol={{ flex: '160px' }}
          labelWrap
          wrapperCol={{ flex: 1 }}
          labelAlign="right"
        >
          <div className={styles.formContent}>
            {/* 隐藏的 Form.Item 用于存储 question 数组 */}
            <Form.Item name="question" hidden>
              <Input />
            </Form.Item>

            <Form.Item label={t('testText')} required validateStatus={questionInputError ? 'error' : ''} help={questionInputError}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Input
                  value={questionInput}
                  onChange={e => {
                    setQuestionInput(e.target.value);
                    if (questionInputError) setQuestionInputError(null);
                  }}
                  placeholder={t('testTextPlaceholder')}
                  allowClear
                  style={{ flex: 1 }}
                  onPressEnter={handleAddQuestion}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion} />
              </div>
              {questionList.length > 0 && (
                <div >
                  {questionList.map((q, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', margin: '4px 0', background: '#f6f8fa', borderRadius: 4, padding: '4px 8px' }}>
                      <span style={{ flex: 1 }}>{q}</span>
                      <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} onClick={() => handleDeleteQuestion(idx)} />
                    </div>
                  ))}
                </div>
              )}
            </Form.Item>
            <Form.Item
              label={t('similarityThreshold')}
              name={'similarity_threshold'}
              tooltip={t('similarityThresholdTip')}
              initialValue={0.2}
              rules={[
                { required: true, message: t('pleaseInput') },
                {
                  validator: (_, value) => {
                    if (value < 0 || value > 1) {
                      return Promise.reject('请输入0-1之间的数值');
                    }
                    if (Math.round(value * 10) % 1 !== 0) {
                      return Promise.reject('请输入0.1的倍数，如0.1、0.2、0.3等');
                    }
                    return Promise.resolve();
                  },
                },
              ]}

            >
              <InputNumber
                min={0.1}
                max={1}
                step={0.1}
                precision={1}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              label={t('vectorSimilarityWeight')}
              name={'vector_similarity_weight'}
              initialValue={0.7}
              tooltip={t('vectorSimilarityWeightTip')}
              rules={[
                { required: true, message: t('pleaseInput') },
                {
                  validator: (_, value) => {
                    if (value < 0 || value > 1) {
                      return Promise.reject('请输入0-1之间的数值');
                    }
                    if (Math.round(value * 10) % 1 !== 0) {
                      return Promise.reject('请输入0.1的倍数，如0.1、0.2、0.3等');
                    }
                    return Promise.resolve();
                  },
                },
              ]}

            >
              <InputNumber
                min={0.1}
                max={1}
                step={0.1}
                precision={1}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              // label={
              //   <div
              //     style={{
              //       cursor: 'pointer',
              //       userSelect: 'none'
              //     }}
              //     onClick={() => setIsAdvancedFilterVisible(!isAdvancedFilterVisible)}
              //   >
              //     高级筛选

              //   </div>
              // }
              label='高级筛选'
              colon={false}
            >
              {isAdvancedFilterVisible ?
                <svg onClick={() => setIsAdvancedFilterVisible(!isAdvancedFilterVisible)}
                  style={{
                    marginLeft: 8, cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  t="1754459741571" className="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="2340" width="16" height="16"
                  xlink="http://www.w3.org/1999/xlink">
                  <path d="M325.456471 862.280661" fill="#272636" p-id="2341" />
                  <path d="M882.057788 862.280661" fill="#272636" p-id="2342" />
                  <path d="M236.028491 877.160382" fill="#272636" p-id="2343" />
                  <path d="M960.132455 877.160382" fill="#272636" p-id="2344" />
                  <path d="M63.683483 788.736998" fill="#272636" p-id="2345" />
                  <path d="M958.469023 788.736998" fill="#272636" p-id="2346" />
                  <path d="M64.77753 858.792098" fill="#272636" p-id="2347" />
                  <path d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z" fill="#575B66" p-id="2348" />
                  <path d="M959.523505 858.792098" fill="#272636" p-id="2349" />
                </svg>
                :

                <svg onClick={() => setIsAdvancedFilterVisible(!isAdvancedFilterVisible)}
                  style={{
                    marginLeft: 8, cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  t="1754459876883" classname="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4177" width="16" height="16">
                  <path d="M385.536 102.4l398.848 364.544c12.288 10.752 19.456 26.624 19.456 43.008s-7.168 32.256-19.456 43.008l-398.848 364.544c-18.944 17.92-46.08 23.552-70.656 14.336s-40.96-31.232-43.52-57.344V145.408c2.048-26.112 18.944-48.128 43.52-57.344 24.064-9.216 51.712-3.584 70.656 14.336z"
                    fill="#575B66" p-id="4178" />
                </svg>

              }
            </Form.Item>
            {isAdvancedFilterVisible && (<div>
              <Rerank></Rerank>
              <UseKnowledgeGraphItem filedName={['use_kg']}></UseKnowledgeGraphItem>
              <Form.Item
                label={t('setMetaData')}
                tooltip={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(t('documentMetaTips')),
                    }}
                  />
                }

              >
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
                              {
                                pattern: /^[a-zA-Z]*$/,
                                message: '字段名只能输入英文字母'
                              }
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
                        <Button
                          type="dashed"
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
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </div>)}


            <Button
              type="primary"
              onClick={onClick}
              // disabled={buttonDisabled}
              loading={loading}
              className={styles.testingButton}
            >
              {t('testingLabel')}
            </Button>
          </div>
        </Form>
      </section>

      <LabelWordCloud></LabelWordCloud>
      {/* <section>
        <div className={styles.historyTitle}>
          <Space size={'middle'}>
            <HistoryOutlined className={styles.historyIcon} />
            <b>Test history</b>
          </Space>
        </div>
        <Space
          direction="vertical"
          size={'middle'}
          className={styles.historyCardWrapper}
        >
          {list.map((x) => (
            <Card className={styles.historyCard} key={x}>
              <Flex justify={'space-between'} gap={'small'}>
                <span>{x}</span>
                <div className={styles.historyText}>
                  content dcjsjl snldsh svnodvn svnodrfn svjdoghdtbnhdo
                  sdvhodhbuid sldghdrlh
                </div>
                <Flex gap={'small'}>
                  <span>time</span>
                  <DeleteOutlined></DeleteOutlined>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Space>
      </section> */}
    </section>
  );
};

export default TestingControl;
