import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button, Tag } from 'antd';
import { DollarOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '../../components/ui/DataTable';
import ModalForm from '../../components/ui/ModalForm';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import {
    getFinancialStats,
    getSalaryPayments,
    createSalaryPayment,
    updateSalaryPayment,
    deleteSalaryPayment,
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} from '../../api';

const { TabPane } = Tab;

const FinancesPage = () => {
    const [financialData, setFinancialData] = useState({});
    const [salaryPayments, setSalaryPayments] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [salaryModalVisible, setSalaryModalVisible] = useState(false);
    const [expenseModalVisible, setExpenseModalVisible] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [currentExpense, setCurrentExpense] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [financial, payments, expensesData] = await Promise.all([
                getFinancialStats(),
                getSalaryPayments(),
                getExpenses()
            ]);
            setFinancialData(financial.data);
            setSalaryPayments(payments.data);
            setExpenses(expensesData.data);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSalary = async (values) => {
        try {
            await createSalaryPayment(values);
            setSalaryModalVisible(false);
            fetchData();
        } catch (error) {
            console.error('Error creating salary payment:', error);
        }
    };

    const handleUpdateSalary = async (values) => {
        try {
            await updateSalaryPayment(currentPayment.id, values);
            setSalaryModalVisible(false);
            fetchData();
        } catch (error) {
            console.error('Error updating salary payment:', error);
        }
    };

    const handleDeleteSalary = async (payment) => {
        try {
            await deleteSalaryPayment(payment.id);
            fetchData();
        } catch (error) {
            console.error('Error deleting salary payment:', error);
        }
    };

    const handleCreateExpense = async (values) => {
        try {
            await createExpense(values);
            setExpenseModalVisible(false);
            fetchData();
        } catch (error) {
            console.error('Error creating expense:', error);
        }
    };

    const handleUpdateExpense = async (values) => {
        try {
            await updateExpense(currentExpense.id, values);
            setExpenseModalVisible(false);
            fetchData();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (expense) => {
        try {
            await deleteExpense(expense.id);
            fetchData();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const salaryColumns = [
        {
            title: 'Сотрудник',
            dataIndex: 'employee_name',
            key: 'employee_name',
        },
        {
            title: 'Сумма',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
        },
        {
            title: 'Премия',
            dataIndex: 'bonus',
            key: 'bonus',
            render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    const expenseColumns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Сумма',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => `${value.toLocaleString('ru-RU')} ₽`,
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
            render: (value) => {
                const colors = {
                    'зарплаты': 'blue',
                    'детали': 'green',
                    'аренда': 'red',
                    'другое': 'orange'
                };
                return <Tag color={colors[value]}>{value}</Tag>;
            },
        },
    ];

    const salaryFormItems = [
        {
            name: 'employee_id',
            label: 'Сотрудник',
            type: 'select',
            rules: [{ required: true, message: 'Пожалуйста, выберите сотрудника' }],
            options: [] // Заполняется из API
        },
        {
            name: 'amount',
            label: 'Сумма',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите сумму' }]
        },
        {
            name: 'bonus',
            label: 'Премия',
            type: 'number',
            rules: []
        },
        {
            name: 'date',
            label: 'Дата',
            type: 'date',
            rules: [{ required: true, message: 'Пожалуйста, выберите дату' }]
        },
    ];

    const expenseFormItems = [
        {
            name: 'name',
            label: 'Название',
            type: 'text',
            rules: [{ required: true, message: 'Пожалуйста, введите название' }]
        },
        {
            name: 'amount',
            label: 'Сумма',
            type: 'number',
            rules: [{ required: true, message: 'Пожалуйста, введите сумму' }]
        },
        {
            name: 'date',
            label: 'Дата',
            type: 'date',
            rules: [{ required: true, message: 'Пожалуйста, выберите дату' }]
        },
        {
            name: 'category',
            label: 'Категория',
            type: 'select',
            rules: [{ required: true, message: 'Пожалуйста, выберите категорию' }],
            options: [
                { value: 'зарплаты', label: 'Зарплаты' },
                { value: 'детали', label: 'Детали' },
                { value: 'аренда', label: 'Аренда' },
                { value: 'другое', label: 'Другое' }
            ]
        },
    ];

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Обзор" key="1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Card title="Финансовая статистика">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded dark:bg-blue-900">
                                    <div className="text-blue-600 font-semibold dark:text-blue-200">Доход</div>
                                    <div className="text-2xl font-bold dark:text-white">
                                        {financialData.income?.toLocaleString('ru-RU') || 0} ₽
                                    </div>
                                </div>
                                <div className="bg-red-50 p-4 rounded dark:bg-red-900">
                                    <div className="text-red-600 font-semibold dark:text-red-200">Расход</div>
                                    <div className="text-2xl font-bold dark:text-white">
                                        {financialData.expenses?.toLocaleString('ru-RU') || 0} ₽
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded dark:bg-green-900">
                                    <div className="text-green-600 font-semibold dark:text-green-200">Прибыль</div>
                                    <div className={`text-2xl font-bold ${financialData.profit >= 0 ? 'text-green-600 dark:text-green-200' : 'text-red-600 dark:text-red-200'
                                        }`}>
                                        {financialData.profit?.toLocaleString('ru-RU') || 0} ₽
                                    </div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded dark:bg-purple-900">
                                    <div className="text-purple-600 font-semibold dark:text-purple-200">Зарплаты</div>
                                    <div className="text-2xl font-bold dark:text-white">
                                        {financialData.salaries?.toLocaleString('ru-RU') || 0} ₽
                                    </div>
                                </div>
                            </div>

                            <BarChart
                                data={[
                                    { name: 'Доход', value: financialData.income || 0 },
                                    { name: 'Расход', value: financialData.expenses || 0 },
                                    { name: 'Зарплаты', value: financialData.salaries || 0 },
                                    { name: 'Прибыль', value: financialData.profit || 0 }
                                ]}
                            />
                        </Card>

                        <Card title="Распределение расходов">
                            <PieChart
                                data={[
                                    { name: 'Зарплаты', value: financialData.salaries || 0 },
                                    { name: 'Детали', value: (financialData.expenses || 0) - (financialData.salaries || 0) }
                                ]}
                            />
                        </Card>
                    </div>
                </TabPane>

                <TabPane tab="Выплаты зарплат" key="2">
                    <div className="mb-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentPayment(null);
                                setSalaryModalVisible(true);
                            }}
                        >
                            Добавить выплату
                        </Button>
                    </div>

                    <DataTable
                        columns={salaryColumns}
                        data={salaryPayments}
                        loading={loading}
                        onEdit={(payment) => {
                            setCurrentPayment(payment);
                            setSalaryModalVisible(true);
                        }}
                        onDelete={handleDeleteSalary}
                    />
                </TabPane>

                <TabPane tab="Расходы" key="3">
                    <div className="mb-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentExpense(null);
                                setExpenseModalVisible(true);
                            }}
                        >
                            Добавить расход
                        </Button>
                    </div>

                    <DataTable
                        columns={expenseColumns}
                        data={expenses}
                        loading={loading}
                        onEdit={(expense) => {
                            setCurrentExpense(expense);
                            setExpenseModalVisible(true);
                        }}
                        onDelete={handleDeleteExpense}
                    />
                </TabPane>
            </Tabs>

            <ModalForm
                visible={salaryModalVisible}
                onCancel={() => setSalaryModalVisible(false)}
                onOk={currentPayment ? handleUpdateSalary : handleCreateSalary}
                title={currentPayment ? 'Редактировать выплату' : 'Добавить выплату'}
                initialValues={currentPayment}
                formItems={salaryFormItems}
            />

            <ModalForm
                visible={expenseModalVisible}
                onCancel={() => setExpenseModalVisible(false)}
                onOk={currentExpense ? handleUpdateExpense : handleCreateExpense}
                title={currentExpense ? 'Редактировать расход' : 'Добавить расход'}
                initialValues={currentExpense}
                formItems={expenseFormItems}
            />
        </div>
    );
};

export default FinancesPage;