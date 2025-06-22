import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Employees
export const getEmployees = () => api.get('/employees/');
export const createEmployee = (data) => api.post('/employees/', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Parts
export const getParts = () => api.get('/parts/');
export const createPart = (data) => api.post('/parts/', data);
export const updatePart = (id, data) => api.put(`/parts/${id}`, data);
export const deletePart = (id) => api.delete(`/parts/${id}`);
export const checkPartAvailability = (id, quantity) =>
    api.get(`/parts/check/${id}`, { params: { quantity } });

// Services
export const getServices = () => api.get('/services/');
export const createService = (data) => api.post('/services/', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Orders
export const getOrders = (status) =>
    api.get('/orders/', { params: { status } });
export const createOrder = (data) => api.post('/orders/', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
export const calculateOrderTotal = (id) => api.post(`/orders/${id}/calculate`);

// Order Details
export const getOrderDetails = (orderId) =>
    api.get('/order_details/', { params: { order_id: orderId } });
export const createOrderDetail = (data) => api.post('/order_details/', data);
export const updateOrderDetail = (id, data) => api.put(`/order_details/${id}`, data);
export const deleteOrderDetail = (id) => api.delete(`/order_details/${id}`);

// Finances
export const getFinancialStats = (startDate, endDate) =>
    api.get('/stats/financial', { params: { start_date: startDate, end_date: endDate } });
export const getEmployeeStats = () => api.get('/stats/employees');
export const getSalaryPayments = (employeeId) =>
    api.get('/salary_payments/', { params: { employee_id: employeeId } });
export const createSalaryPayment = (data) => api.post('/salary_payments/', data);
export const updateSalaryPayment = (id, data) => api.put(`/salary_payments/${id}`, data);
export const deleteSalaryPayment = (id) => api.delete(`/salary_payments/${id}`);
export const getExpenses = (category) =>
    api.get('/expenses/', { params: { category } });
export const createExpense = (data) => api.post('/expenses/', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Reports
export const getPartsReport = (minQuantity) =>
    api.get('/reports/parts', { params: { min_quantity: minQuantity } });
export const getOrdersReport = (status, startDate, endDate) =>
    api.get('/reports/orders', {
        params: {
            status,
            start_date: startDate,
            end_date: endDate,
        },
    });

export default api;