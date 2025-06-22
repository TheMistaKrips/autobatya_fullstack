import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, message, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '../../components/ui/DataTable';
import ModalForm from '../../components/ui/ModalForm';
import {
    getParts,
    createPart,
    updatePart,
    deletePart
} from '../../api';

const PartsPage = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPart, setCurrentPart] = useState(null);

    useEffect(() => {
        fetchParts();
    }, []);

    const fetchParts = async () => {
        setLoading(true);
        try {
            const response = await getParts();
            setParts(response.data);
        } catch (error) {
            console.error('Error fetching parts:', error);
            message.error('Ошибка при загрузке деталей');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            await createPart(values);
            setModalVisible(false);
            fetchParts();
            message.success('Деталь успешно добавлена');
        } catch (error) {
            console.error('Error creating part:', error);
            message.error('Ошибка при добавлении детали');
        }
    };

    const handleUpdate = async (values) => {
        try {
            await updatePart(currentPart.id, values);
            setModalVisible(false);
            fetchParts();
            message.success('Деталь успешно обновлена');
        } catch (error) {
            console.error('Error updating part:', error);
            message.error('Ошибка при обновлении детали');
        }
    };

    const handleDelete = async (part) => {
        try {
            await deletePart(part.id);
            fetchParts();
            message.success('Деталь успешно удалена');
        } catch (error) {
            console.error('Error deleting part:', error);
            message.error('Ошибка при удалении детали');
        }
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
            render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
        },
        {
            title: 'Количество',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value) => (
                <Badge
                    count={value}
                    style={{
                        backgroundColor: value < 5 ? '#ff4d4f' : '#52c41a'
                    }}
                />
            ),
        },
        {
            title: 'Поставщик',
            dataIndex: 'supplier',
            key: 'supplier',
        },
    ];

    const formItems = [
        {
            name: 'name',
            label: 'Название',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите название' }],
        },
        {
            name: 'price',
            label: 'Цена',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите цену' }],
        },
        {
            name: 'quantity',
            label: 'Количество',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите количество' }],
        },
        {
            name: 'supplier',
            label: 'Поставщик',
            type: 'text',
            rules: [],
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setCurrentPart(null);
                        setModalVisible(true);
                    }}
                >
                    Добавить деталь
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={parts}
                loading={loading}
                onEdit={(part) => {
                    setCurrentPart(part);
                    setModalVisible(true);
                }}
                onDelete={handleDelete}
            />

            <ModalForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={currentPart ? handleUpdate : handleCreate}
                title={currentPart ? 'Редактировать деталь' : 'Добавить деталь'}
                initialValues={currentPart}
                formItems={formItems}
            />
        </div>
    );
};

export default PartsPage;