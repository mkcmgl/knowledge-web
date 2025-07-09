import {
    Typography,
    Checkbox,
    Upload,
    Button,
    Input,
    Space,
    message,
    Form,
    CheckboxProps
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import noData from "@/assets/svg/noData.svg"
import { useOCRRecognition } from '@/hooks/tools-hooks';
const { Text } = Typography;
const { TextArea } = Input;

const OCR = () => {
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [recognitionResult, setRecognitionResult] = useState('');
    const { mutateAsync: ocrRecognition, isPending: isProcessing } = useOCRRecognition();

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
    const handleOCRRecognition = async () => {
        if (uploadedFiles.length === 0) {
            message.error('请先上传图片！');
            return;
        }

        // 获取表单数据
        const formData = form.getFieldsValue();
        const isFormatting = formData.formatOutput ? 1 : 0;
        const isHtml = formData.textOutputHtml ? 1 : 0;

        setRecognitionResult('');

        try {
            // 这里只处理第一个文件，如需多文件可自行扩展
            const result = await ocrRecognition({
                file: uploadedFiles[0],
                isFormatting,
                isHtml,
            });
            setRecognitionResult(result?.data || result || '无识别结果');
            message.success('OCR识别完成！');
        } catch (error: any) {
            message.error(error.message || '识别失败');
        }
    };

    return (
        <div >
            <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
                <div style={{ width: "100%", backgroundColor: '#fff', borderRadius: '4px', padding: '16px 20px' }}>
                    {/* 全选Checkbox */}

                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                        全选
                    </Checkbox>


                    <div style={{ display: 'flex', marginTop: '16px', alignItems: 'center', gap: '32px' }}>
                        <span style={{ minWidth: '80px' }}>识别配置：</span>
                        <Space size={32}>
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
                </div>
                <div style={{ display: 'flex', marginTop: '20px', gap: '20px' }}>
                    {/* 左侧配置区域 */}
                    <div style={{
                        background: '#fff',
                        padding: '20px 0',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        height: '500px',
                        overflow: 'auto',
                        flex: 1
                    }}>
                        <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
                            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
                            <span className='pl-2 text-[16px] font-bold'>上传图片</span>
                        </div>
                        <Space direction="vertical" style={{ width: '100%', height: 'calc(100% - 40px)', justifyContent: 'center', alignItems: 'center', }}>
                            <Form.Item style={{ width: '100%', textAlign: 'center' }}>
                                <Space direction="vertical" >
                                    {/* 上传按钮 - 始终显示 */}
                                    <Upload {...uploadProps} >
                                        <Button
                                            style={{ width: '300px', height: '200px', borderStyle: 'dashed' }}
                                        >
                                            <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="48" height="48" viewBox="0 0 48 48">
                                                    <defs>
                                                        <clipPath id="master_svg0_23_8218">
                                                            <rect x="0" y="0" width="48" height="48" rx="0" />
                                                        </clipPath>
                                                    </defs>
                                                    <g clipPath="url(#master_svg0_23_8218)">
                                                        <g>
                                                            <path d="M15.72000244140625,20.64041015625C17.52000244140625,20.64041015625,19.08000244140625,19.20041015625,19.08000244140625,17.28041015625C19.08000244140625,15.48041015625,17.64000244140625,13.92041015625,15.72000244140625,13.92041015625C13.92000244140625,13.92041015625,12.36000244140625,15.36041015625,12.36000244140625,17.28041015625C12.48000244140625,19.20041015625,13.92000244140625,20.64041015625,15.72000244140625,20.64041015625ZM30.60000244140625,18.60041015625L20.880002441406248,32.400410156250004L15.84000244140625,25.32041015625L7.44000244140625,37.20041015625L40.44000244140625,37.20041015625L30.60000244140625,18.60041015625Z" fill="#0689FF" fillOpacity="1" style={{ mixBlendMode: "normal" }} />
                                                        </g>
                                                        <g>
                                                            <path d="M43.799989013671876,5.0400390625L4.199989013671875,5.0400390625C3.2399890136718748,5.0400390625,2.519989013671875,5.7600390625,2.519989013671875,6.7200390625L2.519989013671875,41.4000390625C2.519989013671875,42.3600390625,3.2399890136718748,43.0800390625,4.199989013671875,43.0800390625L43.799989013671876,43.0800390625C44.75998901367188,43.0800390625,45.479989013671876,42.3600390625,45.479989013671876,41.4000390625L45.479989013671876,6.7200390625C45.479989013671876,5.7600390625,44.75998901367188,5.0400390625,43.799989013671876,5.0400390625ZM42.119989013671876,39.7200390625L5.879989013671874,39.7200390625L5.879989013671874,8.2800390625L42.239989013671874,8.2800390625L42.239989013671874,39.7200390625L42.119989013671876,39.7200390625Z" fill="#0689FF" fillOpacity="1" style={{ mixBlendMode: "normal" }} />
                                                        </g>
                                                    </g>
                                                </svg>
                                                <p className='mt-2' style={{ fontSize: '16px' }}>点击或将图片拖拽到这里上传</p>
                                                <p style={{ fontSize: '14px', color: '#999', marginTop: "10px" }}>
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
                                            {/* 重新上传按钮，仅在有文件时显示 */}
                                            <div style={{ marginTop: '12px', textAlign: 'center' }} className='flex justify-center'>
                                                <Button
                                                    onClick={() => setUploadedFiles([])}
                                                    type="default"
                                                    style={{ minWidth: '120px' }}
                                                >
                                                    重新上传
                                                </Button>
                                                {uploadedFiles.length > 0 && (
                                                    <Button
                                                        type="primary"
                                                        onClick={handleOCRRecognition}
                                                        loading={isProcessing}
                                                        style={{ minWidth: '120px', marginLeft: '10px' }}
                                                    >
                                                        {isProcessing ? '识别中...' : 'OCR识别'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Space>
                            </Form.Item>
                        </Space>

                    </div>
                    {/* 右侧结果区域 */}
                    <div style={{
                        background: '#fff',
                        padding: '20px 0',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                    }}>

                        <div style={{ width: '100%', borderBottom: "1px solid #E5E6EB", paddingBottom: '12px', paddingLeft: '20px' }}>
                            <i style={{ height: '100%', borderLeft: "4px solid #0C7CFF", borderRadius: '4px' }}></i>
                            <span className='pl-2 text-[16px] font-bold'>识别结果</span>
                        </div>
                        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {uploadedFiles.length === 0 ? (
                                <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={noData} alt="无数据" style={{ width: 100, marginBottom: 16 }} />
                                    <div style={{ color: 'rgba(29, 33, 41, 0.55)', fontSize: 14 }}>上传图片进行识别后，显示相关结果</div>
                                </div>
                            ) : (
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
                            )}
                        </div>
                    </div>
                </div>




            </Form>
            {/* 底部识别按钮 */}

        </div>
    );
};

export default OCR; 