# My Inventory - Full Stack Application

A complete inventory management system built with FastAPI (Python) backend and React frontend.

## 📋 Features

- **Inventory Management**: Manage products, stock levels, and SKUs
- **Customer Management**: Keep track of customers and their details
- **Order Management**: Create and manage customer orders
- **Dashboard**: Get overview statistics and metrics
- **Responsive UI**: Modern React-based user interface
- **REST API**: Comprehensive REST API with FastAPI
- **Docker Support**: Easy deployment with Docker and Docker Compose

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- Python 3.11+ (for local development)
- Node.js 18+ (for frontend development)
- PostgreSQL 15+ (for local database)

### Quick Start with Docker

1. Clone the repository
```bash
cd My_Inventory
```

2. Configure environment variables
```bash
cp .env.example .env
```

3. Start all services with Docker Compose
```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database: localhost:5432

### Local Development

#### Backend Setup

1. Navigate to backend directory
```bash
cd backend/app
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run the server
```bash
python main.py
# or
uvicorn main:app --reload
```

Backend will be available at: http://localhost:8000

#### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## 📁 Project Structure

```
My_Inventory/
├── frontend/                 # React application
│   ├── src/
│   │   ├── api/             # API client services
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── app.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── dist/                # Built files
│   ├── package.json
│   ├── vite.config.js
│   └── dockerfile
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── routers/         # API route handlers
│   │   │   ├── customers.py
│   │   │   ├── orders.py
│   │   │   └── products.py
│   │   ├── __init__.py
│   │   ├── database.py      # Database configuration
│   │   ├── main.py          # FastAPI app
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── .dockerignore
├── docker-compose.yml       # Docker services configuration
├── main.py                  # Entry point for local development
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── .dockerignore           # Docker ignore rules
└── README.md               # This file

```

## 🔌 API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

## 🛠️ Development

### Build Commands

**Frontend:**
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

**Backend:**
```bash
cd backend/app
python main.py  # Run development server
```

### Environment Variables

See `.env.example` for all available environment variables:
- `VITE_API_URL` - Frontend API endpoint
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Secret key for JWT tokens
- `DEBUG` - Debug mode (True/False)

## 🐳 Docker Deployment

Build and run all services:
```bash
docker-compose up -d
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

Rebuild services:
```bash
docker-compose up -d --build
```

## 📦 Dependencies

### Backend
- FastAPI 0.104.1
- Uvicorn 0.24.0
- SQLAlchemy 2.0.23
- Pydantic 2.5.0
- python-dotenv 1.0.0

### Frontend
- React 18.2.0
- Vite 5.0.0
- Axios 1.6.0

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please create an issue on GitHub or contact the development team.

