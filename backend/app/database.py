import sqlite3
import os
from contextlib import contextmanager
from typing import Generator

DATABASE_URL = "autobatya.db"

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """
    Контекстный менеджер для работы с базой данных.
    Автоматически закрывает соединение после использования.
    """
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row  # Возвращаем строки как словари
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """
    Инициализация базы данных - создание таблиц, если они не существуют.
    """
    if not os.path.exists(DATABASE_URL):
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Таблица сотрудников
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                position TEXT NOT NULL,
                salary REAL NOT NULL,
                hire_date TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT
            )
            """)
            
            # Таблица деталей
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS parts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                supplier TEXT
            )
            """)
            
            # Таблица услуг
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                duration REAL NOT NULL
            )
            """)
            
            # Таблица заказов
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_name TEXT NOT NULL,
                car_model TEXT NOT NULL,
                car_number TEXT NOT NULL,
                date TEXT NOT NULL,
                total_price REAL NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('в работе', 'завершен', 'отменен')),
                employee_id INTEGER NOT NULL,
                FOREIGN KEY (employee_id) REFERENCES employees (id)
            )
            """)
            
            # Таблица деталей заказа
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS order_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                service_id INTEGER,
                part_id INTEGER,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (service_id) REFERENCES services (id),
                FOREIGN KEY (part_id) REFERENCES parts (id)
            )
            """)
            
            # Таблица выплат зарплат
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS salary_payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                bonus REAL DEFAULT 0,
                FOREIGN KEY (employee_id) REFERENCES employees (id)
            )
            """)
            
            # Таблица расходов
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                category TEXT NOT NULL CHECK(category IN ('зарплаты', 'детали', 'аренда', 'другое'))
            )
            """)
            
            # Индексы для улучшения производительности
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_order_details_order_id ON order_details(order_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_salary_payments_employee_id ON salary_payments(employee_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category)")
            
            conn.commit()

def reset_db():
    """
    Удаление и пересоздание базы данных (для тестирования)
    """
    if os.path.exists(DATABASE_URL):
        os.remove(DATABASE_URL)
    init_db()