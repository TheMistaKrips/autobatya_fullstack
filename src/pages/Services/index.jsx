import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '../../components/ui/DataTable';
import ModalForm from '../../components/ui/ModalForm';
import {
    getServices,
    createService,
    updateService,
    deleteService
} from '../../api';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await getServices();
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            message.error('Ошибка при загрузке услуг');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            await createService(values);
            setModalVisible(false);
            fetchServices();
            message.success('Услуга успешно добавлена');
        } catch (error) {
            console.error('Error creating service:', error);
            message.error('Ошибка при добавлении услуги');
        }
    };

    const handleUpdate = async (values) => {
        try {
            await updateService(currentService.id, values);
            setModalVisible(false);
            fetchServices();
            message.success('Услуга успешно обновлена');
        } catch (error) {
            console.error('Error updating service:', error);
            message.error('Ошибка при обновлении услуги');
        }
    };

    const handleDelete = async (service) => {
        try {
            await deleteService(service.id);
            fetchServices();
            message.success('Услуга успешно удалена');
        } catch (error) {
            console.error('Error deleting service:', error);
            message.error('Ошибка при удалении услуги');
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
            title: 'Длительность (часы)',
            dataIndex: 'duration',
            key: 'duration',
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
            name: 'duration',
            label: 'Длительность (часы)',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите длительность' }],
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setCurrentService(null);
                        setModalVisible(true);
                    }}
                >
                    Добавить услугу
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={services}
                loading={loading}
                onEdit={(service) => {
                    setCurrentService(service);
                    setModalVisible(true);
                }}
                onDelete={handleDelete}
            />

            <ModalForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={currentService ? handleUpdate : handleCreate}
                title={currentService ? 'Редактировать услугу' : 'Добавить услугу'}
                initialValues={currentService}
                formItems={formItems}
            />
        </div>
    );
};

export default ServicesPage;