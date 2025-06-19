import {
    Typography,
    Checkbox,
    Upload,
    Button,
    Input,
    Space,
    Row,
    Col,
    Divider,
    message,
    Form,
    CheckboxProps
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Text } = Typography;
const { TextArea } = Input;

const OCR = () => {
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [recognitionResult, setRecognitionResult] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // 全选相关逻辑
    const outputOptions = [
        { label: '格式化输出', value: 'formatOutput' },
        { label: '文本输出HTML', value: 'textOutputHtml' },
    ];

    // 组件内部（假设在函数组件体内）
    const [checkedList, setCheckedList] = useState<string[]>(() => {
        const init: string[] = [];
        if (form.getFieldValue('formatOutput')) init.push('formatOutput');
        if (form.getFieldValue('textOutputHtml')) init.push('textOutputHtml');
        return init;
    });

    // 监听表单变化，保持checkedList和form同步
    const onFormValuesChange = (changedValues: any, allValues: any) => {
        const list: string[] = [];
        if (allValues.formatOutput) list.push('formatOutput');
        if (allValues.textOutputHtml) list.push('textOutputHtml');
        setCheckedList(list);
    };

    const checkAll = outputOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < outputOptions.length;

    const onOutputChange = (list: string[]) => {
        setCheckedList(list);
        // 同步到Form
        form.setFieldsValue({
            formatOutput: list.includes('formatOutput'),
            textOutputHtml: list.includes('textOutputHtml'),
        });
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        const checked = e.target.checked;
        const list = checked ? outputOptions.map(opt => opt.value) : [];
        setCheckedList(list);
        form.setFieldsValue({
            formatOutput: checked,
            textOutputHtml: checked,
        });
    };

    // 删除上传的文件
    const handleDeleteFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        message.success('文件已删除');
    };

    // 文件上传配置
    const uploadProps = {
        accept: '.jpg,.jpeg,.png,.bmp',
        maxSize: 10 * 1024 * 1024, // 10MB
        beforeUpload: (file: File) => {
            const isValidFormat = /\.(jpg|jpeg|png|bmp)$/i.test(file.name);
            const isValidSize = file.size <= 10 * 1024 * 1024;

            if (!isValidFormat) {
                message.error('只支持 JPG、JPEG、PNG、BMP 格式的图片！');
                return false;
            }

            if (!isValidSize) {
                message.error('图片大小不能超过 10MB！');
                return false;
            }

            // 检查是否已存在同名文件
            const isDuplicate = uploadedFiles.some(f => f.name === file.name);
            if (isDuplicate) {
                message.error('文件已存在，请选择其他文件！');
                return false;
            }

            setUploadedFiles(prev => [...prev, file]);
            message.success('图片上传成功！');
            return false; // 阻止自动上传
        },
        showUploadList: false,
    };

    // OCR识别处理
    const handleOCRRecognition = () => {
        console.log('当前表单所有值:', form.getFieldsValue());
        if (uploadedFiles.length === 0) {
            message.error('请先上传图片！');
            return;
        }

        // 获取表单数据
        const formData = form.getFieldsValue();

        // 控制台输出配置信息
        console.log('=== OCR识别配置信息 ===');
        console.log('表单数据:', formData);
        console.log('格式化输出:', formData.formatOutput);
        console.log('文本输出HTML:', formData.textOutputHtml);
        console.log('上传文件信息:', uploadedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        })));
        console.log('识别时间:', new Date().toLocaleString());
        console.log('========================');

        setIsProcessing(true);

        // 模拟OCR识别过程
        setTimeout(() => {
            const filesInfo = uploadedFiles.map(file =>
                `- 文件名：${file.name}，大小：${(file.size / 1024 / 1024).toFixed(2)} MB`
            ).join('\n');

            const configInfo = `
识别配置信息：
- 格式化输出：${formData.formatOutput ? '是' : '否'}
- 文本输出HTML：${formData.textOutputHtml ? '是' : '否'}

上传图片信息：
${filesInfo}

识别结果示例：
这是一个示例的OCR识别结果。
支持中文和英文混合识别。

识别时间：${new Date().toLocaleString()}`;

            setRecognitionResult(configInfo);
            setIsProcessing(false);
            message.success('OCR识别完成！');
        }, 2000);
    };

    return (
        <div >

            <Row gutter={24} style={{ marginTop: '20px' }}>
                {/* 左侧配置区域 */}
                <Col span={12}>
                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        height: '500px',
                        overflow: 'auto'
                    }}>
                        <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {/* 全选Checkbox */}
                                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                    全选
                                </Checkbox>


                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ minWidth: '80px' }}>识别配置：</span>
                                    <Space>
                                        <Form.Item name="formatOutput" valuePropName="checked" noStyle>
                                            <Checkbox
                                                checked={checkedList.includes('formatOutput')}
                                                onChange={e => onOutputChange(
                                                    e.target.checked
                                                        ? [...checkedList, 'formatOutput']
                                                        : checkedList.filter(v => v !== 'formatOutput')
                                                )}
                                            >
                                                格式化输出
                                            </Checkbox>
                                        </Form.Item>
                                        <Form.Item name="textOutputHtml" valuePropName="checked" noStyle>
                                            <Checkbox
                                                checked={checkedList.includes('textOutputHtml')}
                                                onChange={e => onOutputChange(
                                                    e.target.checked
                                                        ? [...checkedList, 'textOutputHtml']
                                                        : checkedList.filter(v => v !== 'textOutputHtml')
                                                )}
                                            >
                                                文本输出HTML
                                            </Checkbox>
                                        </Form.Item>
                                    </Space>
                                </div>

                                <Divider style={{ margin: '16px 0' }} />

                                {/* 图片上传区域 */}
                                <Form.Item label="上传图片" style={{ width: '100%', textAlign: 'center' }}>
                                    <Space direction="vertical" >
                                        {/* 上传按钮 - 始终显示 */}
                                        <Upload {...uploadProps} >
                                            <Button
                                                style={{ width: '300px', height: '200px', borderStyle: 'dashed' }}
                                            >
                                                <div>
                                                    <PlusOutlined />
                                                    <p>上传图片</p>
                                                    <p style={{ fontSize: '12px', color: '#999', marginTop: "10px" }}>
                                                        支持 JPG、JPEG、PNG、BMP 格式，
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: '#999' }}>
                                                        图片大小不超过 10MB
                                                    </p>
                                                </div>
                                            </Button>
                                        </Upload>

                                        {/* 已上传文件列表 */}
                                        {uploadedFiles.length > 0 && (
                                            <div style={{ marginTop: '8px' }}>
                                                <Text strong>已上传文件 ({uploadedFiles.length})：</Text>
                                                {uploadedFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            border: '1px dashed #d9d9d9',
                                                            borderRadius: '6px',
                                                            padding: '12px',
                                                            background: '#fafafa',
                                                            marginTop: '8px'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div>
                                                                <Text strong>{file.name}</Text>
                                                                <br />
                                                                <Text type="secondary">
                                                                    大小: {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                </Text>
                                                            </div>
                                                            <Button
                                                                type="text"
                                                                danger
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => handleDeleteFile(index)}
                                                            >
                                                                删除
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Space>
                                </Form.Item>
                            </Space>
                        </Form>
                    </div>
                </Col>

                {/* 右侧结果区域 */}
                <Col span={12}>
                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ marginBottom: '20px' }}>
                            <Text strong style={{ fontSize: '16px' }}>识别结果</Text>
                        </div>
                        <div style={{ flex: 1, overflow: 'auto' }}>
                            <TextArea
                                value={recognitionResult}
                                placeholder="识别结果将在这里显示..."
                                style={{
                                    height: '100%',
                                    resize: 'none',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    border: 'none',
                                    background: 'transparent'
                                }}
                                readOnly
                            />
                        </div>
                    </div>
                </Col>
            </Row>

            {/* 底部识别按钮 */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleOCRRecognition}
                    loading={isProcessing}
                    style={{ minWidth: '120px' }}
                >
                    {isProcessing ? '识别中...' : 'OCR识别'}
                </Button>
            </div>
        </div>
    );
};

export default OCR; 