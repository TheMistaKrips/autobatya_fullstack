import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '../../components/ui/DataTable';
import ModalForm from '../../components/ui/ModalForm';
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../../api';

const { TabPane } = Tabs;

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await getEmployees();
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            message.error('Ошибка при загрузке сотрудников');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            await createEmployee(values);
            setModalVisible(false);
            fetchEmployees();
            message.success('Сотрудник успешно добавлен');
        } catch (error) {
            console.error('Error creating employee:', error);
            message.error('Ошибка при добавлении сотрудника');
        }
    };

    const handleUpdate = async (values) => {
        try {
            await updateEmployee(currentEmployee.id, values);
            setModalVisible(false);
            fetchEmployees();
            message.success('Сотрудник успешно обновлен');
        } catch (error) {
            console.error('Error updating employee:', error);
            message.error('Ошибка при обновлении сотрудника');
        }
    };

    const handleDelete = async (employee) => {
        try {
            await deleteEmployee(employee.id);
            fetchEmployees();
            message.success('Сотрудник успешно удален');
        } catch (error) {
            console.error('Error deleting employee:', error);
            message.error('Ошибка при удалении сотрудника');
        }
    };

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Должность',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Зарплата',
            dataIndex: 'salary',
            key: 'salary',
            render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
        },
        {
            title: 'Дата приема',
            dataIndex: 'hire_date',
            key: 'hire_date',
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ];

    const formItems = [
        {
            name: 'name',
            label: 'Имя',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите имя' }],
        },
        {
            name: 'position',
            label: 'Должность',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите должность' }],
        },
        {
            name: 'salary',
            label: 'Зарплата',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите зарплату' }],
        },
        {
            name: 'hire_date',
            label: 'Дата приема',
            type: 'date',
            rules: [{ required: true, message: 'Пожалуйста, выберите дату' }],
        },
        {
            name: 'phone',
            label: 'Телефон',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите телефон' }],
        },
        {
            name: 'email',
            label: 'Email',
            type: 'text',
            rules: [{ type: 'email', message: 'Пожалуйста, введите корректный email' }],
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setCurrentEmployee(null);
                        setModalVisible(true);
                    }}
                >
                    Добавить сотрудника
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={employees}
                loading={loading}
                onEdit={(employee) => {
                    setCurrentEmployee(employee);
                    setModalVisible(true);
                }}
                onDelete={handleDelete}
            />

            <ModalForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={currentEmployee ? handleUpdate : handleCreate}
                title={currentEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
                initialValues={currentEmployee}
                formItems={formItems}
            />
        </div>
    );
};

export default EmployeesPage;