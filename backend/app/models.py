from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from enum import Enum

class StatusEnum(str, Enum):
    in_progress = "в работе"
    completed = "завершен"
    canceled = "отменен"

class CategoryEnum(str, Enum):
    salary = "зарплаты"
    parts = "детали"
    rent = "аренда"
    other = "другое"

# ========== Модели для сотрудников ==========
class EmployeeBase(BaseModel):
    name: str
    position: str
    salary: float
    hire_date: date
    phone: str

class EmployeeCreate(EmployeeBase):
    email: Optional[str] = None

class Employee(EmployeeCreate):
    id: int

    class Config:
        orm_mode = True

# ========== Модели для деталей ==========
class PartBase(BaseModel):
    name: str
    price: float
    quantity: int

class PartCreate(PartBase):
    supplier: Optional[str] = None

class Part(PartCreate):
    id: int

    class Config:
        orm_mode = True

# ========== Модели для услуг ==========
class ServiceBase(BaseModel):
    name: str
    price: float
    duration: float  # в часах

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceCreate):
    id: int

    class Config:
        orm_mode = True

# ========== Модели для заказов ==========
class OrderBase(BaseModel):
    client_name: str
    car_model: str
    car_number: str
    date: date
    status: StatusEnum
    employee_id: int

class OrderCreate(OrderBase):
    total_price: float = 0.0

class Order(OrderCreate):
    id: int

    class Config:
        orm_mode = True

# ========== Модели для деталей заказа ==========
class OrderDetailBase(BaseModel):
    order_id: int
    quantity: int
    price: float

class OrderDetailCreate(OrderDetailBase):
    service_id: Optional[int] = None
    part_id: Optional[int] = None

class OrderDetail(OrderDetailCreate):
    id: int

    class Config:
        orm_mode = True

# ========== Модели для выплат зарплат ==========
class SalaryPaymentBase(BaseModel):
    employee_id: int
    amount: float
    date: date

class SalaryPaymentCreate(SalaryPaymentBase):
    bonus: Optional[float] = 0.0

class SalaryPayment(SalaryPaymentCreate):
    id: int

    class Config:
        orm_mode = True

# ========== Модели для расходов ==========
class ExpenseBase(BaseModel):
    name: str
    amount: float
    date: date
    category: CategoryEnum

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseCreate):
    id: int

    class Config:
        orm_mode = True

# ========== Модели для отчетов и статистики ==========
class FinancialStats(BaseModel):
    income: float
    expenses: float
    salaries: float
    profit: float

class EmployeeStats(BaseModel):
    employee_count: int
    average_salary: float

class PartsReportItem(BaseModel):
    name: str
    quantity: int
    price: float

class OrdersReportItem(BaseModel):
    id: int
    client_name: str
    total_price: float
    employee_name: str