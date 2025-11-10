
# 🏠 Rental Property Listing Website (MERN)

**Live Demo:** 👉 [https://frontend-for-rental-property-listin.vercel.app/](https://frontend-for-rental-property-listin.vercel.app/)  

**Demo Credentials for Testing:**

Email: parth@gmail.com
Password: admin@123

A professional full-stack **MERN application** for browsing and listing rental properties.  
Includes secure authentication, dynamic property management, image galleries, reviews, and advanced search filters.  
Built with **Vite, React 18, Bootstrap 5, Node.js, Express, and MongoDB Atlas** using modern best practices.

---

## 🌟 Features

### 🔐 Authentication & Authorization
- User signup/login with bcryptjs password hashing and JWT authentication  
- Protected routes with middleware verification  
- Persisted auth state using localStorage  
- Secure token-based API communication  
- Role-based access control for property listings  

### 🏘️ Property Management
- Browse **20+ pre-seeded rental properties** with full details  
- Create new property listings with dynamic form validation  
- Upload multiple property images (gallery support up to 5 images per property)  
- Advanced search filters by location, price range, property type, and amenities  
- Dynamic state/city dropdown mapping (28 Indian states, 200+ cities)  
- Property detail pages with carousel, amenities, and contact info  
- Real-time view counter and average rating system  

### 💬 Reviews & Ratings
- Leave reviews and ratings on properties  
- Display average property ratings and user details  
- Star-based interactive rating system  

### 🎨 User Experience
- Clean, responsive **Bootstrap 5** UI with modern layout  
- Professional image carousel and thumbnail gallery  
- Sticky property details card on property view pages  
- Amenity badges and property type indicators  
- Real-time filtering and suggestions  

### 🗄️ Database
- **MongoDB Atlas** (cloud-hosted)  
- 20+ sample properties pre-seeded across major Indian cities  
- Comprehensive data schema with validation  
- Efficient querying and relationships with **Mongoose ODM**

---

## 🧪 Test the Website

You can directly explore and test the live deployed version here:  
👉 **[https://frontend-for-rental-property-listin.vercel.app/](https://frontend-for-rental-property-listin.vercel.app/)**  

Use the demo credentials below to log in and experience full app functionality:  

Email: parth@gmail.com
Password: admin@123

---

## 📋 Tech Stack

### 🖥️ Frontend
- **React 18** – Modern UI library  
- **Vite 5** – Lightning-fast build tool  
- **React Router 6** – SPA routing  
- **Axios** – HTTP client with interceptors  
- **Bootstrap 5** – Responsive CSS framework  
- **Lucide React** – Modern icon library  

### ⚙️ Backend
- **Node.js 18+** – JavaScript runtime  
- **Express 4** – Web framework  
- **MongoDB (Atlas)** – NoSQL cloud database  
- **Mongoose** – ODM for schema management  
- **JWT** – Stateless authentication  
- **bcryptjs** – Password hashing  
- **CORS** – API cross-origin access  
- **dotenv** – Environment variable management  

---

## 📁 Folder Structure

```
Rental_Property_Listing_Website/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic (signup/login)
│   │   ├── propertyController.js # Property CRUD operations
│   │   └── reviewController.js   # Review management
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Property.js           # Property schema with owner details
│   │   └── Review.js             # Review schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── propertyRoutes.js     # Property endpoints
│   │   └── reviewRoutes.js       # Review endpoints
│   ├── scripts/
│   │   └── seed.js               # Seed 20 properties with images
│   ├── utils/
│   │   └── generateToken.js      # JWT token generation
│   ├── server.js                 # Express server setup
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ProtectedRoute.jsx # Auth guard
│   │   │   ├── PropertyCard.jsx  # Property listing card
│   │   │   └── ReviewSection.jsx # Reviews component
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Property listing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Registration page
│   │   │   ├── NewProperty.jsx   # Create property form
│   │   │   └── PropertyDetail.jsx # Property detail view
│   │   ├── services/
│   │   │   └── api.js            # Axios instance with interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+  
- npm or yarn  
- MongoDB Atlas account  

### Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

Server runs at http://localhost:5000
Frontend Setup
cd frontend
cp .env.example .env
npm install
npm run dev

App runs at http://localhost:5173

📖 Usage Guide
For Users


Homepage: Browse all available rental properties


Filter by price, location, property type, or amenities


Click any property to view its details




Property Details:


View carousel images and amenities


Read/write reviews


See owner contact details and ratings




Authentication:


Sign up or login


Auth persists across sessions




Add New Property:


Fill property form (details, pricing, contact, images)


Select state → auto-populated cities


Submit to create new listing





🔐 Security Features


JWT-based authentication


Password hashing with bcryptjs (salt rounds: 10)


Protected routes with middleware


CORS and env-based configuration


Input and form validation



🌍 Supported Locations
Covers 28 Indian states and 200+ cities, including:
Andhra Pradesh, Maharashtra, Gujarat, Karnataka, Tamil Nadu, Delhi, Rajasthan, West Bengal, Punjab, Kerala, and many more.

🏗️ Production Deployment
Frontend
cd frontend
npm run build
npm run preview

Backend
Deploy to Heroku, Railway, or Render
Set environment variables in production dashboard
Whitelist MongoDB Atlas IP
Update CLIENT_ORIGIN for CORS
Production .env Example:
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rental_app
JWT_SECRET=long_random_secure_secret_key_minimum_32_chars
PORT=5000
CLIENT_ORIGIN=https://your-domain.com
NODE_ENV=production


📊 Database Seeding
npm run seed:


Clears old data


Adds 20 sample properties


Each property has 5 images, realistic data, and owner info



🔄 State & City Mapping


28 Indian states


200+ cities dynamically loaded


Backend validation ensures correct data



🎯 Future Enhancements


 User profile page with listing history


 Map integration (Google Maps API)


 Cloud image upload (Cloudinary/AWS S3)


 Admin dashboard


 Premium listing payments


 Booking & scheduling system


 Favorites/wishlist


 Real-time chat with owners


 Mobile app (React Native)



📞 Support
For questions or issues, please refer to the documentation or open an issue in the repository.

Last Updated: November 2025
Version: 1.0.0
Status: Production Ready
Live Demo: https://frontend-for-rental-property-listin.vercel.app/

---

✅ **You can copy-paste this entire block directly into your `README.md`.**  
It now includes:
- Live demo link (top + bottom)  
- Demo credentials  
- Clean section layout  
- Ready for GitHub or documentation display.
