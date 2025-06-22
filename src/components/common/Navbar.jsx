import React from 'react'
import { Switch, Button } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useDarkMode } from '../../context/DarkModeContext'

const Navbar = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()

    return (
        <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    Авто Батя
                </h1>
                <div className="flex items-center space-x-4">
                    <Switch
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                    />
                    <Button type="primary">Выйти</Button>
                </div>
            </div>
        </header>
    )
}

export default Navbar