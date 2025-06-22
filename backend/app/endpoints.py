from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from .database import get_db, init_db
from .models import *
from .crud import *
from typing import List, Optional
from datetime import date

app = FastAPI(title="Авто Батя API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация БД при старте
init_db()

# Dependency
def get_db_conn():
    with get_db() as db:
        yield db

# ========== Employees Endpoints ==========
@app.post("/employees/", response_model=Employee)
def create_employee_endpoint(employee: EmployeeCreate, db = Depends(get_db_conn)):
    return create_employee(db, employee)

@app.get("/employees/", response_model=List[Employee])
def read_employees(skip: int = 0, limit: int = 100, db = Depends(get_db_conn)):
    return get_employees(db, skip, limit)

@app.get("/employees/{employee_id}", response_model=Employee)
def read_employee(employee_id: int, db = Depends(get_db_conn)):
    employee = get_employee(db, employee_id)
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@app.put("/employees/{employee_id}", response_model=Employee)
def update_employee_endpoint(employee_id: int, employee: EmployeeCreate, db = Depends(get_db_conn)):
    return update_employee(db, employee_id, employee)

@app.delete("/employees/{employee_id}")
def delete_employee_endpoint(employee_id: int, db = Depends(get_db_conn)):
    if not delete_employee(db, employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted"}

# ========== Parts Endpoints ==========
@app.post("/parts/", response_model=Part)
def create_part_endpoint(part: PartCreate, db = Depends(get_db_conn)):
    return create_part(db, part)

@app.get("/parts/", response_model=List[Part])
def read_parts(skip: int = 0, limit: int = 100, db = Depends(get_db_conn)):
    return get_parts(db, skip, limit)

@app.get("/parts/{part_id}", response_model=Part)
def read_part(part_id: int, db = Depends(get_db_conn)):
    part = get_part(db, part_id)
    if part is None:
        raise HTTPException(status_code=404, detail="Part not found")
    return part

@app.put("/parts/{part_id}", response_model=Part)
def update_part_endpoint(part_id: int, part: PartCreate, db = Depends(get_db_conn)):
    return update_part(db, part_id, part)

@app.delete("/parts/{part_id}")
def delete_part_endpoint(part_id: int, db = Depends(get_db_conn)):
    if not delete_part(db, part_id):
        raise HTTPException(status_code=404, detail="Part not found")
    return {"message": "Part deleted"}

@app.get("/parts/check/{part_id}")
def check_part_availability(part_id: int, quantity: int = Query(..., gt=0), db = Depends(get_db_conn)):
    available = check_part_availability(db, part_id, quantity)
    return {"available": available}

# ========== Services Endpoints ==========
@app.post("/services/", response_model=Service)
def create_service_endpoint(service: ServiceCreate, db = Depends(get_db_conn)):
    return create_service(db, service)

@app.get("/services/", response_model=List[Service])
def read_services(skip: int = 0, limit: int = 100, db = Depends(get_db_conn)):
    return get_services(db, skip, limit)

@app.get("/services/{service_id}", response_model=Service)
def read_service(service_id: int, db = Depends(get_db_conn)):
    service = get_service(db, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.put("/services/{service_id}", response_model=Service)
def update_service_endpoint(service_id: int, service: ServiceCreate, db = Depends(get_db_conn)):
    return update_service(db, service_id, service)

@app.delete("/services/{service_id}")
def delete_service_endpoint(service_id: int, db = Depends(get_db_conn)):
    if not delete_service(db, service_id):
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}

# ========== Orders Endpoints ==========
@app.post("/orders/", response_model=Order)
def create_order_endpoint(order: OrderCreate, db = Depends(get_db_conn)):
    return create_order(db, order)

@app.get("/orders/", response_model=List[Order])
def read_orders(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db = Depends(get_db_conn)
):
    return get_orders(db, skip, limit, status)

@app.get("/orders/{order_id}", response_model=Order)
def read_order(order_id: int, db = Depends(get_db_conn)):
    order = get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.put("/orders/{order_id}", response_model=Order)
def update_order_endpoint(order_id: int, order: OrderCreate, db = Depends(get_db_conn)):
    return update_order(db, order_id, order)

@app.delete("/orders/{order_id}")
def delete_order_endpoint(order_id: int, db = Depends(get_db_conn)):
    if not delete_order(db, order_id):
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted"}

@app.post("/orders/{order_id}/calculate", response_model=float)
def calculate_order_total_endpoint(order_id: int, db = Depends(get_db_conn)):
    return calculate_order_total(db, order_id)

# ========== Order Details Endpoints ==========
@app.post("/order_details/", response_model=OrderDetail)
def create_order_detail_endpoint(order_detail: OrderDetailCreate, db = Depends(get_db_conn)):
    return create_order_detail(db, order_detail)

@app.get("/order_details/", response_model=List[OrderDetail])
def read_order_details(order_id: int = Query(...), db = Depends(get_db_conn)):
    return get_order_details(db, order_id)

@app.get("/order_details/{order_detail_id}", response_model=OrderDetail)
def read_order_detail(order_detail_id: int, db = Depends(get_db_conn)):
    order_detail = get_order_detail(db, order_detail_id)
    if order_detail is None:
        raise HTTPException(status_code=404, detail="Order detail not found")
    return order_detail

@app.put("/order_details/{order_detail_id}", response_model=OrderDetail)
def update_order_detail_endpoint(
    order_detail_id: int,
    order_detail: OrderDetailCreate,
    db = Depends(get_db_conn)
):
    return update_order_detail(db, order_detail_id, order_detail)

@app.delete("/order_details/{order_detail_id}")
def delete_order_detail_endpoint(order_detail_id: int, db = Depends(get_db_conn)):
    if not delete_order_detail(db, order_detail_id):
        raise HTTPException(status_code=404, detail="Order detail not found")
    return {"message": "Order detail deleted"}

# ========== Finances Endpoints ==========
@app.get("/stats/financial", response_model=FinancialStats)
def get_financial_stats_endpoint(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db = Depends(get_db_conn)
):
    return get_financial_stats(db, start_date, end_date)

@app.get("/stats/employees", response_model=EmployeeStats)
def get_employee_stats_endpoint(db = Depends(get_db_conn)):
    return get_employee_stats(db)

@app.get("/salary_payments/", response_model=List[SalaryPayment])
def read_salary_payments(
    employee_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db = Depends(get_db_conn)
):
    return get_salary_payments(db, employee_id, skip, limit)

@app.post("/salary_payments/", response_model=SalaryPayment)
def create_salary_payment_endpoint(salary_payment: SalaryPaymentCreate, db = Depends(get_db_conn)):
    return create_salary_payment(db, salary_payment)

@app.get("/salary_payments/{salary_payment_id}", response_model=SalaryPayment)
def read_salary_payment(salary_payment_id: int, db = Depends(get_db_conn)):
    salary_payment = get_salary_payment(db, salary_payment_id)
    if salary_payment is None:
        raise HTTPException(status_code=404, detail="Salary payment not found")
    return salary_payment

@app.put("/salary_payments/{salary_payment_id}", response_model=SalaryPayment)
def update_salary_payment_endpoint(
    salary_payment_id: int,
    salary_payment: SalaryPaymentCreate,
    db = Depends(get_db_conn)
):
    return update_salary_payment(db, salary_payment_id, salary_payment)

@app.delete("/salary_payments/{salary_payment_id}")
def delete_salary_payment_endpoint(salary_payment_id: int, db = Depends(get_db_conn)):
    if not delete_salary_payment(db, salary_payment_id):
        raise HTTPException(status_code=404, detail="Salary payment not found")
    return {"message": "Salary payment deleted"}

@app.get("/expenses/", response_model=List[Expense])
def read_expenses(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db = Depends(get_db_conn)
):
    return get_expenses(db, category, skip, limit)

@app.post("/expenses/", response_model=Expense)
def create_expense_endpoint(expense: ExpenseCreate, db = Depends(get_db_conn)):
    return create_expense(db, expense)

@app.get("/expenses/{expense_id}", response_model=Expense)
def read_expense(expense_id: int, db = Depends(get_db_conn)):
    expense = get_expense(db, expense_id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@app.put("/expenses/{expense_id}", response_model=Expense)
def update_expense_endpoint(expense_id: int, expense: ExpenseCreate, db = Depends(get_db_conn)):
    return update_expense(db, expense_id, expense)

@app.delete("/expenses/{expense_id}")
def delete_expense_endpoint(expense_id: int, db = Depends(get_db_conn)):
    if not delete_expense(db, expense_id):
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted"}

# ========== Reports Endpoints ==========
@app.get("/reports/parts", response_model=List[PartsReportItem])
def get_parts_report_endpoint(
    min_quantity: int = Query(5, gt=0),
    db = Depends(get_db_conn)
):
    return get_parts_report(db, min_quantity)

@app.get("/reports/orders", response_model=List[OrdersReportItem])
def get_orders_report_endpoint(
    status: str = 'завершен',
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db = Depends(get_db_conn)
):
    return get_orders_report(db, status, start_date, end_date)