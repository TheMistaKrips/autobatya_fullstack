import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import { useDarkMode } from '../../context/DarkModeContext';
import * as AntdIcons from '@ant-design/icons';

const Sidebar = () => {
    const location = useLocation();
    const { darkMode } = useDarkMode();

    const items = routes.map(route => ({
        key: route.path,
        icon: route.icon ? React.createElement(AntdIcons[route.icon]) : null,
        label: <Link to={route.path}>{route.name}</Link>,
    }));

    return (
        <div className={`w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Меню
                </h2>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                className="border-r-0"
                theme={darkMode ? 'dark' : 'light'}
            />
        </div>
    );
};

export default Sidebar;