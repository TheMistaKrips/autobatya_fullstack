import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button, Tag, message, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '../../components/ui/DataTable';
import ModalForm from '../../components/ui/ModalForm';
import {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderDetails,
    createOrderDetail,
    deleteOrderDetail,
    getEmployees,
    getParts,
    getServices
} from '../../api';

const { TabPane } = Tabs;

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [currentDetail, setCurrentDetail] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [parts, setParts] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersRes, employeesRes, partsRes, servicesRes] = await Promise.all([
                getOrders(),
                getEmployees(),
                getParts(),
                getServices()
            ]);

            setOrders(ordersRes.data);
            setEmployees(employeesRes.data);
            setParts(partsRes.data);
            setServices(servicesRes.data);

            // Загружаем детали для всех заказов
            const details = {};
            for (const order of ordersRes.data) {
                const detailsRes = await getOrderDetails(order.id);
                details[order.id] = detailsRes.data;
            }
            setOrderDetails(details);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Ошибка при загрузке данных');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            await createOrder(values);
            setModalVisible(false);
            fetchData();
            message.success('Заказ успешно создан');
        } catch (error) {
            console.error('Error creating order:', error);
            message.error('Ошибка при создании заказа');
        }
    };

    const handleUpdate = async (values) => {
        try {
            await updateOrder(currentOrder.id, values);
            setModalVisible(false);
            fetchData();
            message.success('Заказ успешно обновлен');
        } catch (error) {
            console.error('Error updating order:', error);
            message.error('Ошибка при обновлении заказа');
        }
    };

    const handleDelete = async (order) => {
        try {
            await deleteOrder(order.id);
            fetchData();
            message.success('Заказ успешно удален');
        } catch (error) {
            console.error('Error deleting order:', error);
            message.error('Ошибка при удалении заказа');
        }
    };

    const handleCreateDetail = async (values) => {
        try {
            await createOrderDetail({ ...values, order_id: currentOrder.id });
            setDetailModalVisible(false);
            fetchData();
            message.success('Деталь заказа успешно добавлена');
        } catch (error) {
            console.error('Error creating order detail:', error);
            message.error('Ошибка при добавлении детали заказа');
        }
    };

    const handleDeleteDetail = async (detail) => {
        try {
            await deleteOrderDetail(detail.id);
            fetchData();
            message.success('Деталь заказа успешно удалена');
        } catch (error) {
            console.error('Error deleting order detail:', error);
            message.error('Ошибка при удалении детали заказа');
        }
    };

    const statusColors = {
        'в работе': 'blue',
        'завершен': 'green',
        'отменен': 'red'
    };

    const columns = [
        {
            title: 'Клиент',
            dataIndex: 'client_name',
            key: 'client_name',
        },
        {
            title: 'Автомобиль',
            key: 'car',
            render: (_, record) => `${record.car_model} (${record.car_number})`,
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Сумма',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (value) => <Tag color={statusColors[value]}>{value}</Tag>,
        },
    ];

    const detailColumns = [
        {
            title: 'Тип',
            key: 'type',
            render: (_, record) => record.service_id ? 'Услуга' : 'Деталь',
        },
        {
            title: 'Название',
            key: 'name',
            render: (_, record) => {
                if (record.service_id) {
                    const service = services.find(s => s.id === record.service_id);
                    return service?.name || 'Услуга';
                } else {
                    const part = parts.find(p => p.id === record.part_id);
                    return part?.name || 'Деталь';
                }
            },
        },
        {
            title: 'Количество',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
            render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
        },
        {
            title: 'Сумма',
            key: 'sum',
            render: (_, record) => `${(record.price * record.quantity).toLocaleString('ru-RU')} ₽`,
        },
    ];

    const formItems = [
        {
            name: 'client_name',
            label: 'Имя клиента',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите имя клиента' }],
        },
        {
            name: 'car_model',
            label: 'Модель автомобиля',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите модель' }],
        },
        {
            name: 'car_number',
            label: 'Номер автомобиля',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите номер' }],
        },
        {
            name: 'date',
            label: 'Дата',
            type: 'date',
            rules: [{ required: true, message: 'Пожалуйста, выберите дату' }],
        },
        {
            name: 'status',
            label: 'Статус',
            type: 'select',
            rules: [{ required: true, message: 'Пожалуйста, выберите статус' }],
            options: [
                { value: 'в работе', label: 'В работе' },
                { value: 'завершен', label: 'Завершен' },
                { value: 'отменен', label: 'Отменен' },
            ],
        },
        {
            name: 'employee_id',
            label: 'Сотрудник',
            type: 'select',
            rules: [{ required: true, message: 'Пожалуйста, выберите сотрудника' }],
            options: employees.map(e => ({ value: e.id, label: e.name })),
        },
    ];

    const detailFormItems = [
        {
            name: 'type',
            label: 'Тип',
            type: 'select',
            rules: [{ required: true, message: 'Пожалуйста, выберите тип' }],
            options: [
                { value: 'service', label: 'Услуга' },
                { value: 'part', label: 'Деталь' },
            ],
        },
        {
            name: 'service_id',
            label: 'Услуга',
            type: 'select',
            dependencies: ['type'],
            rules: [
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (getFieldValue('type') !== 'service' || value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Пожалуйста, выберите услугу'));
                    },
                }),
            ],
            options: services.map(s => ({ value: s.id, label: s.name })),
        },
        {
            name: 'part_id',
            label: 'Деталь',
            type: 'select',
            dependencies: ['type'],
            rules: [
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (getFieldValue('type') !== 'part' || value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Пожалуйста, выберите деталь'));
                    },
                }),
            ],
            options: parts.map(p => ({ value: p.id, label: p.name })),
        },
        {
            name: 'quantity',
            label: 'Количество',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите количество' }],
        },
        {
            name: 'price',
            label: 'Цена',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите цену' }],
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setCurrentOrder(null);
                        setModalVisible(true);
                    }}
                >
                    Добавить заказ
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                loading={loading}
                onEdit={(order) => {
                    setCurrentOrder(order);
                    setModalVisible(true);
                }}
                onDelete={handleDelete}
                onView={(order) => {
                    setCurrentOrder(order);
                }}
            />

            {currentOrder && (
                <div className="mt-6">
                    <Card
                        title={`Детали заказа #${currentOrder.id}`}
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setCurrentDetail(null);
                                    setDetailModalVisible(true);
                                }}
                            >
                                Добавить деталь
                            </Button>
                        }
                    >
                        <DataTable
                            columns={detailColumns}
                            data={orderDetails[currentOrder.id] || []}
                            loading={loading}
                            onDelete={handleDeleteDetail}
                            showEdit={false}
                            showView={false}
                        />
                    </Card>
                </div>
            )}

            <ModalForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={currentOrder ? handleUpdate : handleCreate}
                title={currentOrder ? 'Редактировать заказ' : 'Добавить заказ'}
                initialValues={currentOrder}
                formItems={formItems}
            />

            <ModalForm
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                onOk={handleCreateDetail}
                title="Добавить деталь заказа"
                initialValues={currentDetail}
                formItems={detailFormItems}
            />
        </div>
    );
};

export default OrdersPage;