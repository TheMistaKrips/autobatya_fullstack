import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Spin } from 'antd'
import { routes } from '../../routes'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4">
                    <Suspense fallback={<Spin size="large" className="w-full mt-10" />}>
                        <Routes>
                            {routes.map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={route.element}
                                />
                            ))}
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

export default Layout