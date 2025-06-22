import React from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { useForm } from 'antd/es/form/Form';

const ModalForm = ({
    visible,
    onCancel,
    onOk,
    title,
    initialValues,
    formItems,
    width = 800,
    confirmLoading = false
}) => {
    const [form] = useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onOk(values);
        } catch (error) {
            message.error('Пожалуйста, заполните все обязательные поля');
        }
    };

    const renderFormItem = (item) => {
        switch (item.type) {
            case 'text':
                return (
                    <Form.Item
                        key={item.name}
                        label={item.label}
                        name={item.name}
                        rules={item.rules}
                    >
                        <Input />
                    </Form.Item>
                );
            case 'number':
                return (
                    <Form.Item
                        key={item.name}
                        label={item.label}
                        name={item.name}
                        rules={item.rules}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                );
            case 'select':
                return (
                    <Form.Item
                        key={item.name}
                        label={item.label}
                        name={item.name}
                        rules={item.rules}
                    >
                        <Select options={item.options} />
                    </Form.Item>
                );
            case 'date':
                return (
                    <Form.Item
                        key={item.name}
                        label={item.label}
                        name={item.name}
                        rules={item.rules}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}
            width={width}
            confirmLoading={confirmLoading}
            afterClose={() => form.resetFields()}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
            >
                {formItems.map(item => renderFormItem(item))}
            </Form>
        </Modal>
    );
};

export default ModalForm;