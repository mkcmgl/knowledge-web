import SimilaritySlider from '@/components/similarity-slider';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ReactComponent as CromptEngine } from '@/assets/svg/chat/promptEngine.svg';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Switch,
  Table,
  TableProps,
  Tooltip,
} from 'antd';
import classNames from 'classnames';
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import {
  VariableTableDataType as DataType,
  IPromptConfigParameters,
  ISegmentedContentProps,
} from '../interface';
import { EditableCell, EditableRow } from './editable-cell';

import { CrossLanguageItem } from '@/components/cross-language-item';
import Rerank from '@/components/rerank';
import TopNItem from '@/components/top-n-item';
import { UseKnowledgeGraphItem } from '@/components/use-knowledge-graph-item';
import { useTranslate } from '@/hooks/common-hooks';
import { useSelectPromptConfigParameters } from '../hooks';
import styles from './index.less';

const PromptEngine = (
  { show }: ISegmentedContentProps,
  ref: ForwardedRef<Array<IPromptConfigParameters>>,
) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const parameters = useSelectPromptConfigParameters();
  const { t } = useTranslate('chat');

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleRemove = (key: string) => () => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const handleAdd = () => {
    setDataSource((state) => [
      ...state,
      {
        key: uuid(),
        variable: '',
        optional: true,
      },
    ]);
  };

  const handleOptionalChange = (row: DataType) => (checked: boolean) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      optional: checked,
    });
    setDataSource(newData);
  };

  useImperativeHandle(
    ref,
    () => {
      return dataSource
        .filter((x) => x.variable.trim() !== '')
        .map((x) => ({ key: x.variable, optional: x.optional }));
    },
    [dataSource],
  );

  const columns: TableProps<DataType>['columns'] = [
    {
      title: t('key'),
      dataIndex: 'variable',
      key: 'variable',
      onCell: (record: DataType) => ({
        record,
        editable: true,
        dataIndex: 'variable',
        title: 'key',
        handleSave,
      }),
    },
    {
      title: t('optional'),
      dataIndex: 'optional',
      key: 'optional',
      width: 80,
      align: 'center',
      render(text, record) {
        return (
          <Switch
            size="small"
            checked={text}
            onChange={handleOptionalChange(record)}
          />
        );
      },
    },
    {
      title: t('operation'),
      dataIndex: 'operation',
      width: 80,
      key: 'operation',
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return <CromptEngine onClick={handleRemove(record.key)} />;
      },
    },
  ];

  useEffect(() => {
    setDataSource(parameters);
  }, [parameters]);

  return (
    <section
      className={classNames({
        [styles.segmentedHidden]: !show,
      })}
    >
      <Form.Item
        label={t('system')}
        rules={[{ required: true, message: t('systemMessage') }]}
        tooltip={t('systemTip')}
        name={['prompt_config', 'system']}
        initialValue={t('systemInitialValue')}
      >
        <Input.TextArea autoSize={{ maxRows: 8, minRows: 5 }} />
      </Form.Item>
      <Divider></Divider>
      <SimilaritySlider isTooltipShown></SimilaritySlider>
      <TopNItem></TopNItem>
      <Form.Item
        label={t('multiTurn')}
        tooltip={t('multiTurnTip')}
        name={['prompt_config', 'refine_multiturn']}
        initialValue={false}
      >
        <Switch></Switch>
      </Form.Item>
      <UseKnowledgeGraphItem
        filedName={['prompt_config', 'use_kg']}
      ></UseKnowledgeGraphItem>
      <Form.Item
        label={t('reasoning')}
        tooltip={t('reasoningTip')}
        name={['prompt_config', 'reasoning']}
        initialValue={false}
      >
        <Switch></Switch>
      </Form.Item>
      <Rerank></Rerank>
      <CrossLanguageItem></CrossLanguageItem>
      <section className={classNames(styles.variableContainer)}>
        <Row align={'middle'} justify="end">
          <Col span={9} className={styles.variableAlign}>
            <label className={styles.variableLabel}>
              {t('variable')}
              <Tooltip title={t('variableTip')}>
                <QuestionCircleOutlined className={styles.variableIcon} />
              </Tooltip>
            </label>
          </Col>
          <Col span={15} className={styles.variableAlign}>
            <Button size="small" type="primary" onClick={handleAdd}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="12" height="12" viewBox="0 0 12 12">
                <defs>
                  <clipPath id="master_svg0_76_05007">
                    <rect x="0" y="0" width="12" height="12" rx="0" />
                  </clipPath>
                </defs>
                <g clipPath="url(#master_svg0_76_05007)">
                  <g>
                    <path d="M6,1.5C6.27614,1.5,6.5,1.723858,6.5,2L6.5,5.5L10,5.5C10.27614,5.5,10.5,5.72386,10.5,6C10.5,6.27614,10.27614,6.5,10,6.5L6.5,6.5L6.5,10C6.5,10.27614,6.27614,10.5,6,10.5C5.72386,10.5,5.5,10.27614,5.5,10L5.5,6.5L2,6.5C1.723858,6.5,1.5,6.27614,1.5,6C1.5,5.72386,1.723858,5.5,2,5.5L5.5,5.5L5.5,2C5.5,1.723858,5.72386,1.5,6,1.5Z"
                      fill="#FFFFFF" fillOpacity="1" />
                  </g>
                </g>
              </svg>
              {t('add')}
            </Button>
          </Col>
        </Row>
        {dataSource.length > 0 && (
          <Row>
            <Col span={7}> </Col>
            <Col span={17}>
              <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={'key'}
                className={styles.variableTable}
                components={components}
                style={{ overflowX: 'auto' }}
                rowClassName={() => styles.editableRow}
              />
            </Col>
          </Row>
        )}
      </section>
    </section>
  );
};

export default forwardRef(PromptEngine);
