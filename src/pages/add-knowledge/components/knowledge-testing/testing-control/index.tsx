import Rerank from '@/components/rerank';
import SimilaritySlider from '@/components/similarity-slider';
import { useTranslate } from '@/hooks/common-hooks';
import { useChunkIsTesting } from '@/hooks/knowledge-hooks';
import { Button, Card, Divider, Flex, Form, Input, InputNumber } from 'antd';
import { FormInstance } from 'antd/lib';
import { LabelWordCloud } from './label-word-cloud';

import { CrossLanguageItem } from '@/components/cross-language-item';
import { UseKnowledgeGraphItem } from '@/components/use-knowledge-graph-item';
import styles from './index.less';
import DOMPurify from 'dompurify';
import Editor, { loader } from '@monaco-editor/react';



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

  const buttonDisabled =
    !question || (typeof question === 'string' && question.trim() === '');

  const onClick = () => {
    handleTesting(selectedDocumentIds);
  };

  return (
    <section className={styles.testingControlWrapper}>
      <div>

        <Flex justify={'space-between'} align={'center'} gap={'small'}>
          <b>{t('testing')}</b>
          <Button
            type="primary"
            size="small"
            onClick={onClick}
            disabled={buttonDisabled}
            loading={loading}
          >
            {t('testingLabel')}
          </Button>
        </Flex>
      </div>
      <p>{t('testingDescription')}</p>

      <Divider></Divider>
      <section>
        <Form name="testing" layout="vertical" form={form}>
          <div className={styles.formContent}>
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
                min={0}
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
                min={0}
                max={1}
                step={0.1}
                precision={1}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={t('testText')}
              name={'question'}
              rules={[{ required: true, message: t('testTextPlaceholder') }]}
            >
              <Input.TextArea
                placeholder={t('testTextPlaceholder')}
                allowClear
                // showCount maxLength={100}
                // autoSize={{ minRows: 8 }}
                style={{ height: 34, resize: 'vertical' }}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item<FieldType>
              label={t('setMetaData')}
              name={'meta'}
              rules={[{ message: t('testSetMetaDataPlaceholder') },
              {
                validator(rule, value) {
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch (error) {
                    return Promise.reject(
                    );
                  }
                },
              },
              ]}
              tooltip={
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      t('documentMetaTips'),
                    ),
                  }}
                ></div>
              }
            >
              <Editor height={200} defaultLanguage="json" theme="vs-dark" />
            </Form.Item>


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
