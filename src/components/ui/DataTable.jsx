import React from 'react';
import { Table, Space, Button, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const DataTable = ({
    columns,
    data,
    loading,
    onEdit,
    onDelete,
    onView,
    rowKey = 'id',
    showView = true,
    showEdit = true,
    showDelete = true
}) => {
    const actionColumn = {
        title: 'Действия',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle">
                {showView && (
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => onView(record)}
                    />
                )}
                {showEdit && (
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    />
                )}
                {showDelete && (
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record)}
                    />
                )}
            </Space>
        ),
    };

    return (
        <Table
            columns={[...columns, actionColumn]}
            dataSource={data}
            rowKey={rowKey}
            loading={loading}
            bordered
            pagination={{ pageSize: 10 }}
        />
    );
};

export default DataTable;