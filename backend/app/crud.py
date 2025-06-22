from .database import get_db
from .models import *
from typing import List, Optional
from datetime import datetime

# ========== CRUD для сотрудников ==========
def create_employee(db, employee: EmployeeCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO employees (name, position, salary, hire_date, phone, email)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (employee.name, employee.position, employee.salary, 
         employee.hire_date, employee.phone, employee.email)
    )
    db.commit()
    return get_employee(db, cursor.lastrowid)

def get_employee(db, employee_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM employees WHERE id = ?", (employee_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_employees(db, skip: int = 0, limit: int = 100):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM employees LIMIT ? OFFSET ?", (limit, skip))
    return [dict(row) for row in cursor.fetchall()]

def update_employee(db, employee_id: int, employee: EmployeeCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE employees 
        SET name=?, position=?, salary=?, hire_date=?, phone=?, email=?
        WHERE id=?
        """,
        (employee.name, employee.position, employee.salary,
         employee.hire_date, employee.phone, employee.email, employee_id)
    )
    db.commit()
    return get_employee(db, employee_id)

def delete_employee(db, employee_id: int):
    cursor = db.cursor()
    cursor.execute("DELETE FROM employees WHERE id=?", (employee_id,))
    db.commit()
    return True

# ========== CRUD для деталей ==========
def create_part(db, part: PartCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO parts (name, price, quantity, supplier)
        VALUES (?, ?, ?, ?)
        """,
        (part.name, part.price, part.quantity, part.supplier)
    )
    db.commit()
    return get_part(db, cursor.lastrowid)

def get_part(db, part_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM parts WHERE id=?", (part_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_parts(db, skip: int = 0, limit: int = 100):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM parts LIMIT ? OFFSET ?", (limit, skip))
    return [dict(row) for row in cursor.fetchall()]

def update_part(db, part_id: int, part: PartCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE parts 
        SET name=?, price=?, quantity=?, supplier=?
        WHERE id=?
        """,
        (part.name, part.price, part.quantity, part.supplier, part_id)
    )
    db.commit()
    return get_part(db, part_id)

def delete_part(db, part_id: int):
    cursor = db.cursor()
    cursor.execute("DELETE FROM parts WHERE id=?", (part_id,))
    db.commit()
    return True

def check_part_availability(db, part_id: int, quantity: int):
    part = get_part(db, part_id)
    if not part:
        return False
    return part['quantity'] >= quantity

# ========== CRUD для услуг ==========
def create_service(db, service: ServiceCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO services (name, price, duration)
        VALUES (?, ?, ?)
        """,
        (service.name, service.price, service.duration)
    )
    db.commit()
    return get_service(db, cursor.lastrowid)

def get_service(db, service_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM services WHERE id=?", (service_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_services(db, skip: int = 0, limit: int = 100):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM services LIMIT ? OFFSET ?", (limit, skip))
    return [dict(row) for row in cursor.fetchall()]

def update_service(db, service_id: int, service: ServiceCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE services 
        SET name=?, price=?, duration=?
        WHERE id=?
        """,
        (service.name, service.price, service.duration, service_id)
    )
    db.commit()
    return get_service(db, service_id)

def delete_service(db, service_id: int):
    cursor = db.cursor()
    cursor.execute("DELETE FROM services WHERE id=?", (service_id,))
    db.commit()
    return True

# ========== CRUD для заказов ==========
def create_order(db, order: OrderCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO orders (client_name, car_model, car_number, date, total_price, status, employee_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (order.client_name, order.car_model, order.car_number,
         order.date, order.total_price, order.status, order.employee_id)
    )
    db.commit()
    return get_order(db, cursor.lastrowid)

def get_order(db, order_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM orders WHERE id=?", (order_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_orders(db, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    cursor = db.cursor()
    if status:
        cursor.execute("SELECT * FROM orders WHERE status=? LIMIT ? OFFSET ?", 
                      (status, limit, skip))
    else:
        cursor.execute("SELECT * FROM orders LIMIT ? OFFSET ?", (limit, skip))
    return [dict(row) for row in cursor.fetchall()]

def update_order(db, order_id: int, order: OrderCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE orders 
        SET client_name=?, car_model=?, car_number=?, date=?, 
            total_price=?, status=?, employee_id=?
        WHERE id=?
        """,
        (order.client_name, order.car_model, order.car_number,
         order.date, order.total_price, order.status, order.employee_id, order_id)
    )
    db.commit()
    return get_order(db, order_id)

def delete_order(db, order_id: int):
    cursor = db.cursor()
    cursor.execute("DELETE FROM orders WHERE id=?", (order_id,))
    db.commit()
    return True

def calculate_order_total(db, order_id: int):
    cursor = db.cursor()
    cursor.execute(
        """
        SELECT SUM(price * quantity) 
        FROM order_details 
        WHERE order_id=?
        """,
        (order_id,)
    )
    total = cursor.fetchone()[0] or 0
    cursor.execute(
        "UPDATE orders SET total_price=? WHERE id=?",
        (total, order_id)
    )
    db.commit()
    return total

# ========== CRUD для деталей заказа ==========
def create_order_detail(db, order_detail: OrderDetailCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO order_details (order_id, service_id, part_id, quantity, price)
        VALUES (?, ?, ?, ?, ?)
        """,
        (order_detail.order_id, order_detail.service_id, 
         order_detail.part_id, order_detail.quantity, order_detail.price)
    )
    db.commit()
    
    # Обновляем общую сумму заказа
    calculate_order_total(db, order_detail.order_id)
    
    # Если это деталь, уменьшаем количество на складе
    if order_detail.part_id:
        cursor.execute(
            "UPDATE parts SET quantity=quantity-? WHERE id=?",
            (order_detail.quantity, order_detail.part_id)
        )
        db.commit()
    
    return get_order_detail(db, cursor.lastrowid)

def get_order_detail(db, order_detail_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM order_details WHERE id=?", (order_detail_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_order_details(db, order_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM order_details WHERE order_id=?", (order_id,))
    return [dict(row) for row in cursor.fetchall()]

def update_order_detail(db, order_detail_id: int, order_detail: OrderDetailCreate):
    old_detail = get_order_detail(db, order_detail_id)
    
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE order_details 
        SET order_id=?, service_id=?, part_id=?, quantity=?, price=?
        WHERE id=?
        """,
        (order_detail.order_id, order_detail.service_id, 
         order_detail.part_id, order_detail.quantity, 
         order_detail.price, order_detail_id)
    )
    db.commit()
    
    # Обновляем общую сумму заказа
    calculate_order_total(db, order_detail.order_id)
    
    # Если изменялась деталь, корректируем остатки
    if old_detail['part_id']:
        # Возвращаем старую деталь на склад
        cursor.execute(
            "UPDATE parts SET quantity=quantity+? WHERE id=?",
            (old_detail['quantity'], old_detail['part_id'])
        )
        db.commit()
    
    if order_detail.part_id:
        # Берем новую деталь со склада
        cursor.execute(
            "UPDATE parts SET quantity=quantity-? WHERE id=?",
            (order_detail.quantity, order_detail.part_id)
        )
        db.commit()
    
    return get_order_detail(db, order_detail_id)

def delete_order_detail(db, order_detail_id: int):
    order_detail = get_order_detail(db, order_detail_id)
    if not order_detail:
        return False
    
    cursor = db.cursor()
    cursor.execute("DELETE FROM order_details WHERE id=?", (order_detail_id,))
    db.commit()
    
    # Обновляем общую сумму заказа
    calculate_order_total(db, order_detail['order_id'])
    
    # Если это была деталь, возвращаем на склад
    if order_detail['part_id']:
        cursor.execute(
            "UPDATE parts SET quantity=quantity+? WHERE id=?",
            (order_detail['quantity'], order_detail['part_id'])
        )
        db.commit()
    
    return True

# ========== CRUD для выплат зарплат ==========
def create_salary_payment(db, salary_payment: SalaryPaymentCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO salary_payments (employee_id, amount, date, bonus)
        VALUES (?, ?, ?, ?)
        """,
        (salary_payment.employee_id, salary_payment.amount, 
         salary_payment.date, salary_payment.bonus)
    )
    db.commit()
    return get_salary_payment(db, cursor.lastrowid)

def get_salary_payment(db, salary_payment_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM salary_payments WHERE id=?", (salary_payment_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_salary_payments(db, employee_id: Optional[int] = None, 
                       skip: int = 0, limit: int = 100):
    cursor = db.cursor()
    if employee_id:
        cursor.execute(
            "SELECT * FROM salary_payments WHERE employee_id=? LIMIT ? OFFSET ?",
            (employee_id, limit, skip)
        )
    else:
        cursor.execute(
            "SELECT * FROM salary_payments LIMIT ? OFFSET ?",
            (limit, skip)
        )
    return [dict(row) for row in cursor.fetchall()]

def update_salary_payment(db, salary_payment_id: int, salary_payment: SalaryPaymentCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE salary_payments 
        SET employee_id=?, amount=?, date=?, bonus=?
        WHERE id=?
        """,
        (salary_payment.employee_id, salary_payment.amount,
         salary_payment.date, salary_payment.bonus, salary_payment_id)
    )
    db.commit()
    return get_salary_payment(db, salary_payment_id)

def delete_salary_payment(db, salary_payment_id: int):
    cursor = db.cursor()
    cursor.execute("DELETE FROM salary_payments WHERE id=?", (salary_payment_id,))
    db.commit()
    return True

# ========== CRUD для расходов ==========
def create_expense(db, expense: ExpenseCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        INSERT INTO expenses (name, amount, date, category)
        VALUES (?, ?, ?, ?)
        """,
        (expense.name, expense.amount, expense.date, expense.category)
    )
    db.commit()
    return get_expense(db, cursor.lastrowid)

def get_expense(db, expense_id: int):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM expenses WHERE id=?", (expense_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_expenses(db, category: Optional[str] = None, 
                skip: int = 0, limit: int = 100):
    cursor = db.cursor()
    if category:
        cursor.execute(
            "SELECT * FROM expenses WHERE category=? LIMIT ? OFFSET ?",
            (category, limit, skip)
        )
    else:
        cursor.execute(
            "SELECT * FROM expenses LIMIT ? OFFSET ?",
            (limit, skip)
        )
    return [dict(row) for row in cursor.fetchall()]

def update_expense(db, expense_id: int, expense: ExpenseCreate):
    cursor = db.cursor()
    cursor.execute(
        """
        UPDATE expenses 
        SET name=?, amount=?, date=?, category=?
        WHERE id=?
        """,
        (expense.name, expense.amount, expense.date, expense.category, expense_id)
    )
    db.commit()
    return get_expense(db, expense_id)

def delete_expense(db, expense_id: int):
    cursor = db.cursor()
    cursor.execute("DELETE FROM expenses WHERE id=?", (expense_id,))
    db.commit()
    return True

# ========== Статистика и отчеты ==========
def get_financial_stats(db, start_date: Optional[str] = None, end_date: Optional[str] = None):
    cursor = db.cursor()
    
    # Доходы
    if start_date and end_date:
        cursor.execute(
            """
            SELECT SUM(total_price) 
            FROM orders 
            WHERE status='завершен' AND date BETWEEN ? AND ?
            """,
            (start_date, end_date)
        )
    else:
        cursor.execute(
            "SELECT SUM(total_price) FROM orders WHERE status='завершен'"
        )
    income = cursor.fetchone()[0] or 0
    
    # Расходы
    if start_date and end_date:
        cursor.execute(
            "SELECT SUM(amount) FROM expenses WHERE date BETWEEN ? AND ?",
            (start_date, end_date)
        )
    else:
        cursor.execute("SELECT SUM(amount) FROM expenses")
    expenses = cursor.fetchone()[0] or 0
    
    # Зарплаты
    if start_date and end_date:
        cursor.execute(
            """
            SELECT SUM(amount + bonus) 
            FROM salary_payments 
            WHERE date BETWEEN ? AND ?
            """,
            (start_date, end_date)
        )
    else:
        cursor.execute("SELECT SUM(amount + bonus) FROM salary_payments")
    salaries = cursor.fetchone()[0] or 0
    
    return {
        "income": income,
        "expenses": expenses,
        "salaries": salaries,
        "profit": income - expenses
    }

def get_employee_stats(db):
    cursor = db.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM employees")
    count = cursor.fetchone()[0] or 0
    
    cursor.execute("SELECT AVG(salary) FROM employees")
    avg_salary = cursor.fetchone()[0] or 0
    
    return {
        "employee_count": count,
        "average_salary": avg_salary
    }

def get_parts_report(db, min_quantity: int = 5):
    cursor = db.cursor()
    cursor.execute(
        """
        SELECT name, quantity, price 
        FROM parts 
        WHERE quantity < ?
        ORDER BY quantity ASC
        """,
        (min_quantity,)
    )
    return [dict(row) for row in cursor.fetchall()]

def get_orders_report(db, status: str = 'завершен', 
                     start_date: Optional[str] = None, 
                     end_date: Optional[str] = None):
    cursor = db.cursor()
    
    if start_date and end_date:
        cursor.execute(
            """
            SELECT o.id, o.client_name, o.total_price, e.name as employee_name
            FROM orders o
            JOIN employees e ON o.employee_id = e.id
            WHERE o.status=? AND o.date BETWEEN ? AND ?
            ORDER BY o.date DESC
            """,
            (status, start_date, end_date)
        )
    else:
        cursor.execute(
            """
            SELECT o.id, o.client_name, o.total_price, e.name as employee_name
            FROM orders o
            JOIN employees e ON o.employee_id = e.id
            WHERE o.status=?
            ORDER BY o.date DESC
            """,
            (status,)
        )
    
    return [dict(row) for row in cursor.fetchall()]