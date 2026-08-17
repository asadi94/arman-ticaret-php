# آرمان تجارت - نسخه PHP

وب‌سایت معرفی و کاتالوگ محصولات صنعتی با بک‌اند PHP و دیتابیس MySQL

---

## 📋 درباره پروژه

این پروژه نسخه PHP وب‌سایت **آرمان تجارت** است که با استفاده از:

- **PHP 7.4+** (بک‌اند)
- **MySQL** (دیتابیس)
- **HTML/CSS/JS** (فرانت‌اند)
- **REST API** (ارتباط بین فرانت و بک)

طراحی شده است.

---

## 🗄️ دیتابیس

نام دیتابیس: `arman_tejarat`

### جدول‌ها:
- `products` - محصولات
- `content` - محتوای سایت
- `users` - کاربران

---

## 📁 ساختار پروژه
Arman Ticaret - PHP/
├── index.html
├── products.html
├── contact.html
├── admin.html
├── api/
│ ├── index.php
│ ├── config.php
│ ├── products.php
│ └── content.php
├── css/
├── js/
├── assets/
└── database.sql

---

## 🚀 نصب و راه‌اندازی

### ۱. ایجاد دیتابیس
```sql
CREATE DATABASE arman_tejarat;
