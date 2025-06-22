import React from 'react';

const StatCard = ({ title, value, icon, color, prefix = '', suffix = '₽' }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-2xl font-bold dark:text-white">
                        {prefix}{value.toLocaleString('ru-RU')}{suffix}
                    </p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
        </div>
    );
};

export default StatCard;