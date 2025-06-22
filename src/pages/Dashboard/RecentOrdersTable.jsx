// src/pages/Dashboard/RecentOrdersTable.jsx
import React from 'react';
import { Table, Tag } from 'antd';
import { getOrders } from '../../api';

const RecentOrdersTable = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders({ status: 'завершен', limit: 5 });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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

    return (
        <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            pagination={false}
        />
    );
};

export default RecentOrdersTable;