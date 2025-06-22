import { lazy } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Employees = lazy(() => import('./pages/Employees'))
const Orders = lazy(() => import('./pages/Orders'))
const Parts = lazy(() => import('./pages/Parts'))
const Services = lazy(() => import('./pages/Services'))
const Finances = lazy(() => import('./pages/Finances'))

export const routes = [
    {
        path: '/',
        element: <Dashboard />,
        name: 'Панель управления',
        icon: 'DashboardOutlined',
    },
    {
        path: '/employees',
        element: <Employees />,
        name: 'Сотрудники',
        icon: 'TeamOutlined',
    },
    {
        path: '/orders',
        element: <Orders />,
        name: 'Заказы',
        icon: 'ShoppingCartOutlined',
    },
    {
        path: '/parts',
        element: <Parts />,
        name: 'Детали',
        icon: 'ToolOutlined',
    },
    {
        path: '/services',
        element: <Services />,
        name: 'Услуги',
        icon: 'CarOutlined',
    },
    {
        path: '/finances',
        element: <Finances />,
        name: 'Финансы',
        icon: 'DollarOutlined',
    },
]