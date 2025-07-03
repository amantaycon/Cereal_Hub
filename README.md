# 🌾 Cereal Hub

**Cereal Hub** is a full-stack web application built using Django (backend) and React with Vite (frontend). It is designed for farmers, distributors, and buyers to explore, list, and manage cereal products easily in one central hub.
## 📌 Features

- 🏷️ List and explore different cereal products
- 🛒 Add to cart / place orders (if e-commerce is enabled)
- 📊 Dashboard for sellers to manage listings and orders
- 👤 User authentication and role-based access (Admin, Seller, Buyer)
- 📦 Inventory management (Admin/Seller)

## 🛠️ Tech Stack

**Frontend**:
- HTML5, CSS3, JavaScript
- React (with Vite)  
- Axios (for API calls)  
- React Router DOM 

**Backend**:  
- Django & Django REST Framework  

**Database**:
- MySQL

**Other Tools**:
- Git & GitHub for version control
- Postman for API testing

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amantaycon/Cereal_Hub.git
cd cereal-hub


Backend Setup (Django)
cd backend
python -m venv env
source env/bin/activate  # For Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

in settings.py
SECRET_KEY=your_secret_key
DEBUG=True
DB_NAME=cerealhub
DB_USER=your_db_user
DB_PASSWORD=your_db_password

Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev


**Project Structure**
cereal-hub/
│
├── backend/                # Django project
│   ├── cerealhub/          # Main Django settings and URLs
│   ├── dashboard/                # App for API endpoints
|   ├── login/
│   ├── manage.py
│   └── ...
│
├── frontend/cereal_hub               # React + Vite project
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md

