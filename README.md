# Create README.md file in your project root
echo '# MERN Stack Ecommerce Website

A full-stack ecommerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

### For Customers:
- **User Authentication** - Register, login, and logout functionality
- **Product Browsing** - View products by categories with search functionality
- **Shopping Cart** - Add/remove products, update quantities
- **Order Management** - Place orders and view order history
- **Responsive Design** - Mobile-friendly interface

### For Sellers:
- **Seller Dashboard** - Manage your shop and products
- **Product Management** - Add, edit, and delete products
- **Order Tracking** - View and manage incoming orders
- **Sales Analytics** - Track total products, orders, and earnings

## 🛠️ Technologies Used

### Frontend:
- React.js
- React Router DOM
- Context API (Authentication & Cart)
- CSS3 with responsive design
- Axios for API calls

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

### Database:

- MongoDB

### Image Storing:

- cloudinary


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

2. **Install backend dependencies**

3. **Install frontend dependencies**

4. **Environment Variables**

Create a `.env` file in the server directory:

5. **Start the application**

Start the backend server and the frontend:


6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `PUT /api/auth/enable-seller` - Enable seller account

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Add new product (Seller only)
- `PUT /api/products/:id` - Update product (Seller only)
- `DELETE /api/products/:id` - Delete product (Seller only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/seller/orders` - Get seller orders
- `GET /api/orders/seller/stats` - Get seller statistics

## 🎯 Key Features Implemented

- **Authentication System** with JWT tokens
- **Role-based Access** (Customer/Seller)
- **Dynamic Category System** with background images
- **Shopping Cart** with persistent state
- **Order Management** system
- **Seller Dashboard** with analytics
- **Responsive Design** for all devices
- **Image Upload** functionality for products

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes for authenticated users
- Input validation and sanitization

## 🌟 Screenshots

![Home Page](client/public/images/electronics.jpg)
*Homepage with category browsing*


## 👨‍💻 Author

**Your Name**
- GitHub: [@lohit3050](https://github.com/lohit3050)
- LinkedIn: [Lohit Kokkirigedda](https://www.linkedin.com/in/lohit-kokkirigedda-05310b310/)

## 🙏 Acknowledgments

- Thanks to the MERN stack community
- Inspiration from various ecommerce platforms


---

⭐ Star this repo if you found it helpful!
' > README.md
