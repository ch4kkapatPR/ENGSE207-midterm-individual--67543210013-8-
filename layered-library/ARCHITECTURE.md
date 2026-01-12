# 🏗️ Architecture Diagram
Layered Architecture (3-Tier)

---

## C1 – Context Diagram

**Library Management System** เป็นระบบจัดการหนังสือที่ให้ผู้ใช้งานสามารถ  
เพิ่ม แก้ไข ลบ ยืม และคืนหนังสือ ผ่าน REST API

- Client (Browser / Postman) ติดต่อระบบผ่าน HTTP
- Backend พัฒนาด้วย Node.js และ Express
- ใช้ SQLite เป็นฐานข้อมูล

ระบบถูกออกแบบด้วย **Layered Architecture** เพื่อแยกความรับผิดชอบของแต่ละส่วนอย่างชัดเจน  
ทำให้โค้ดดูแลรักษาง่าย และลดการพึ่งพาซึ่งกันและกันระหว่างส่วนต่าง ๆ

---

## C2 – Container Diagram (Layered Architecture)
```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  ┌──────────────────────────────┐   │
│  │ Routes → Controllers         │   │
│  │ (HTTP Handling)              │   │
│  └──────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Business Logic Layer            │
│  ┌──────────────────────────────┐   │
│  │ Services → Validators        │   │
│  │ (Business Rules)             │   │
│  └──────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Data Access Layer               │
│  ┌──────────────────────────────┐   │
│  │ Repositories → Database      │   │
│  │ (SQL Queries)                │   │
│  └──────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
          ┌──────────┐
          │  SQLite  │
          └──────────┘

```
---

## 🎯 Responsibilities ของแต่ละ Layer

### 1️⃣ Presentation Layer  
**(Routes & Controllers)**

**หน้าที่**
- รับ HTTP Request จาก Client
- จัดการ Routing ของ API
- ส่งข้อมูลจาก Request ไปยัง Business Layer
- ส่ง HTTP Response กลับไปยัง Client

**ไม่ควรทำ**
- ไม่เขียน Business Logic
- ไม่เขียน SQL หรือเข้าถึงฐานข้อมูลโดยตรง

**ตัวอย่างไฟล์**
- `bookRoutes.js`
- `bookController.js`

---

### 2️⃣ Business Logic Layer  
**(Services & Validators)**

**หน้าที่**
- จัดการกฎทางธุรกิจ (Business Rules)
- ตรวจสอบความถูกต้องของข้อมูล (Validation)
- ตัดสินใจเชิง logic เช่น
  - หนังสือถูกยืมอยู่หรือไม่
  - สามารถลบหนังสือได้หรือไม่
- สื่อสารกับ Data Access Layer

**ตัวอย่างไฟล์**
- `bookService.js`
- `bookValidator.js`

---

### 3️⃣ Data Access Layer  
**(Repositories & Database)**

**หน้าที่**
- ติดต่อฐานข้อมูลโดยตรง
- เขียนและจัดการ SQL Queries
- ส่งข้อมูลกลับไปยัง Business Layer

**ไม่ควรทำ**
- ไม่ตัดสินใจทางธุรกิจ
- ไม่จัดการ HTTP Request/Response

**ตัวอย่างไฟล์**
- `bookRepository.js`
- `connection.js`

---

## 🔄 Data Flow (Request → Response)

ตัวอย่าง: **PUT /api/books/:id**

1. Client ส่ง HTTP Request พร้อม JSON Body
2. Route รับ request และส่งต่อไปยัง Controller
3. Controller เรียก Service ใน Business Layer
4. Service ตรวจสอบข้อมูลด้วย Validator
5. Service เรียก Repository เพื่ออัปเดตข้อมูลใน Database
6. Repository ติดต่อ SQLite และส่งผลลัพธ์กลับ
7. Controller ส่ง Response กลับไปยัง Client
8. หากเกิด Error จะถูกจัดการโดย `errorHandler`

---

