import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Divider } from 'antd';
import { DollarOutlined, ShopOutlined, TeamOutlined, CarOutlined } from '@ant-design/icons';
import { getFinancialStats, getEmployeeStats } from '../../api'
import StatCard from '../../components/common/StatCard';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import RecentOrdersTable from './RecentOrdersTable';

const Dashboard = () => {
    const [stats, setStats] = useState({
        income: 0,
        expenses: 0,
        salaries: 0,
        profit: 0,
        employeeCount: 0,
        avgSalary: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [financial, employees] = await Promise.all([
                    getFinancialStats(),
                    getEmployeeStats()
                ]);

                setStats({
                    income: financial.data.income,
                    expenses: financial.data.expenses,
                    salaries: financial.data.salaries,
                    profit: financial.data.profit,
                    employeeCount: employees.data.employee_count,
                    avgSalary: employees.data.average_salary
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-8">Загрузка...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Панель управления</h1>

            <Row gutter={16}>
                <Col span={6}>
                    <StatCard
                        title="Доход"
                        value={stats.income}
                        icon={<DollarOutlined />}
                        color="green"
                    />
                </Col>
                <Col span={6}>
                    <StatCard
                        title="Расход"
                        value={stats.expenses}
                        icon={<ShopOutlined />}
                        color="red"
                    />
                </Col>
                <Col span={6}>
                    <StatCard
                        title="Прибыль"
                        value={stats.profit}
                        icon={<DollarOutlined />}
                        color={stats.profit >= 0 ? 'blue' : 'red'}
                    />
                </Col>
                <Col span={6}>
                    <StatCard
                        title="Сотрудники"
                        value={stats.employeeCount}
                        icon={<TeamOutlined />}
                        color="purple"
                        suffix=""
                    />
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Финансовая статистика">
                        <BarChart
                            data={[
                                { name: 'Доход', value: stats.income },
                                { name: 'Расход', value: stats.expenses },
                                { name: 'Зарплаты', value: stats.salaries },
                                { name: 'Прибыль', value: stats.profit }
                            ]}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Распределение расходов">
                        <PieChart
                            data={[
                                { name: 'Зарплаты', value: stats.salaries },
                                { name: 'Детали', value: stats.expenses - stats.salaries }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Последние заказы">
                <RecentOrdersTable />
            </Card>
        </div>
    );
};

export default Dashboard;