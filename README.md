# Rental Property Listing Website (MERN)

A professional full-stack MERN application for browsing and listing rental properties. Features comprehensive authentication with JWT, dynamic property management, image galleries, reviews, and advanced search filters. Built with modern best practices including Vite, React 18, Bootstrap 5, and MongoDB Compass (Local Database).

## 🌟 Features

### Authentication & Authorization
- User signup/login with bcryptjs password hashing and JWT authentication
- Protected routes with middleware authentication
- Persisted auth state using localStorage
- Secure token-based API communication
- Role-based access control for property listings

### Property Management
- Browse 20+ pre-seeded rental properties with full details
- Create new property listings with dynamic form validation
- Upload multiple property images (gallery support with 5 images per property)
- Advanced search filters by location, price range, property type, and amenities
- Dynamic state/city dropdown mapping (28 Indian states, 200+ cities)
- Property detail pages with image carousel and comprehensive information
- View counter and average rating system for properties
- Owner contact information (name, phone, email) with clickable tel/mailto links

### User Experience
- Clean, responsive Bootstrap 5 UI with modern design
- Professional image carousel with thumbnail gallery
- Sticky property details card on detail pages
- Amenity badges and property type indicators
- Real-time view count and rating display
- Search suggestions and auto-filtering

### Reviews & Ratings
- Leave reviews and ratings on properties
- Display average property ratings
- Review listing with user details
- Star-based rating system

### Database
- MongoDB Compass (Local MongoDB instance)
- 20 sample properties across major Indian cities
- Comprehensive data schema with validation
- Efficient querying with Mongoose ODM

## 📋 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite 5** - Lightning-fast build tool
- **React Router 6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Bootstrap 5** - Responsive CSS framework
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 4** - Web framework
- **MongoDB** - NoSQL database (Atlas cloud)
- **Mongoose** - ODM for MongoDB
- **JWT** - Stateless authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Folder Structure

```
fullstack-auth-app/
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

- Node.js 18 or higher
- npm or yarn package manager
- MongoDB Compass (local MongoDB database)
- Modern web browser

### Backend Setup

1. **Install and Start MongoDB Compass:**
   - Download from https://www.mongodb.com/products/compass
   - Install and launch MongoDB Compass
   - Default connection: `mongodb://127.0.0.1:27017`
   - Verify connection is successful

2. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/rental_app
   JWT_SECRET=your_super_secret_key_change_in_production
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174
   ```

5. **Install dependencies:**
   ```bash
   npm install
   ```

6. **Seed sample properties (20 listings with images):**
   ```bash
   npm run seed
   ```
   Output: "Seeded 20 properties"

7. **Start development server:**
   ```bash
   npm run dev
   ```
   Server runs at: **http://localhost:5000**

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Create `.env` file (optional, defaults work):**
   ```bash
   cp .env.example .env
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   App runs at: **http://localhost:5173**
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   App runs at: **http://localhost:5173**

## 📖 Usage Guide

### For Users

1. **Homepage**: Browse all available rental properties
   - Use search bar to filter by location
   - Filter by price range, property type, amenities
   - Click any property card to view full details

2. **Property Details**:
   - View property images in carousel
   - See amenities, specifications, and owner information
   - View and leave reviews
   - See view count and average rating

3. **Authentication**:
   - Sign up to create account
   - Login to access property listing feature
   - Auth state persists across sessions

4. **List a Property** (when logged in):
   - Click "List Property" in navbar
   - Fill in property details (title, description, price, location)
   - Select state (28 options) → auto-populate city dropdown
   - Enter property specifications (bedrooms, bathrooms, size)
   - Select furnishing and amenities
   - Add owner contact information (name, phone, email)
   - Add image URLs (main + up to 5 gallery images)
   - Submit to create listing

### For Developers

#### API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token

**Properties:**
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property details
- `GET /api/properties/:id/increment-view` - Increment view count
- `POST /api/properties` - Create new property (auth required)
- `PUT /api/properties/:id` - Update property (auth required)
- `DELETE /api/properties/:id` - Delete property (auth required)

**Reviews:**
- `GET /api/reviews/property/:propertyId` - Get property reviews
- `POST /api/reviews` - Add review (auth required)

#### Data Models

**User:**
```javascript
{
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

**Property:**
```javascript
{
  title: String,
  description: String,
  price: Number,
  location: String,
  city: String,
  state: String,
  pincode: String,
  bedrooms: Number,
  bathrooms: Number,
  sizeSqft: Number,
  type: String,
  furnishing: String,
  amenities: [String],
  imageUrl: String,
  gallery: [String],
  ownerName: String,
  ownerPhone: String,
  ownerEmail: String,
  createdBy: ObjectId,
  views: Number,
  averageRating: Number,
  createdAt: Date
}
```

**Review:**
```javascript
{
  property: ObjectId,
  user: ObjectId,
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

## 🔐 Security Features

- JWT-based stateless authentication
- Password hashing with bcryptjs (salt rounds: 10)
- Protected routes with middleware verification
- CORS configuration for API access
- Secure environment variable management
- Input validation on forms and API endpoints

## 🌍 Supported Locations

**28 Indian States with 200+ Cities:**
- Andaman and Nicobar Islands, Andhra Pradesh, Arunachal Pradesh
- Assam, Bihar, Chhattisgarh, Chandigarh, Dadra & Nagar Haveli
- Daman & Diu, Delhi, Goa, Gujarat, Haryana, Himachal Pradesh
- Jharkhand, Karnataka, Kerala, Ladakh, Lakshadweep, Madhya Pradesh
- Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha
- Punjab, Puducherry, Rajasthan, Sikkim, Tamil Nadu, Telangana
- Tripura, Uttar Pradesh, Uttarakhand, West Bengal

## 🏗️ Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
npm run preview
```

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or Render
2. Set environment variables in production dashboard
3. **For production**: Replace MongoDB Compass with MongoDB Atlas
   - Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
   - Get connection string and add to environment variables
   - Configure IP whitelist for your deployment server
4. Update `CLIENT_ORIGIN` for CORS with your frontend URL

### Environment Variables (Production)
```
# For Production: Use MongoDB Atlas
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rental_app
JWT_SECRET=long_random_secure_secret_key_minimum_32_chars
PORT=5000
CLIENT_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production
```

### Environment Variables (Local Development)
```
# For Local Development: Use MongoDB Compass
MONGO_URI=mongodb://127.0.0.1:27017/rental_app
JWT_SECRET=dev_secret_key
PORT=5000
CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174
```

## 📊 Database Setup

### Local Development (MongoDB Compass)
1. Download and install MongoDB Compass: https://www.mongodb.com/products/compass
2. Open Compass and connect to default: `mongodb://127.0.0.1:27017`
3. Database will be created automatically on first run
4. Run `npm run seed` to populate 20 sample properties

### Production (MongoDB Atlas)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Get connection string
4. Set `MONGO_URI` in production environment variables

## 📊 Database Seeding

The `npm run seed` command:
- Connects to MongoDB (local or Atlas)
- Clears existing properties collection
- Inserts 20 sample properties
- Each property includes:
  - 5 Unsplash image URLs (main + gallery)
````
```

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or Render
2. Set environment variables in production dashboard
3. Ensure MongoDB Atlas is configured with IP whitelist
4. Update `CLIENT_ORIGIN` for CORS

### Environment Variables (Production)
```
MONGO_URI=mongodb+srv://user:pass@prod-cluster.mongodb.net/db
JWT_SECRET=long_random_secure_secret_key_minimum_32_chars
PORT=5000
CLIENT_ORIGIN=https://your-domain.com
NODE_ENV=production
```

## 📊 Database Seeding

The `npm run seed` command:
- Connects to MongoDB Atlas
- Clears existing properties collection
- Inserts 20 sample properties
- Each property includes:
  - 5 Unsplash image URLs (main + gallery)
  - Realistic owner contact information
  - Complete property specifications
  - Geographic distribution across Indian cities

## 🔄 State & City Mapping

Properties support dynamic filtering with:
- 28 Indian states
- 200+ cities across states
- Frontend automatically populates available cities based on selected state
- Backend validates location data

## 🎯 Future Enhancements

- [ ] User profile page with listing history
- [ ] Advanced search with radius filtering
- [ ] Map integration (Google Maps API)
- [ ] Image upload to cloud storage (Cloudinary/AWS S3)
- [ ] Email notifications for saved properties
- [ ] Admin dashboard for moderation
- [ ] Payment integration for premium listings
- [ ] Booking/scheduling feature
- [ ] Property favorites/wishlist
- [ ] Social sharing functionality
- [ ] Mobile app using React Native
- [ ] Real-time chat with property owners

## 📝 License

MIT - Feel free to use this project for personal and commercial purposes.

## 👨‍💻 Contributors

IFSD Semester 5 Final Project - Rental Property Listing Platform

## 📞 Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Status:** Production Ready
