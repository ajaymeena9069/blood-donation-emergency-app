# 🩸 Blood Donation Emergency Help App

A comprehensive full-stack blood donation management system that connects blood donors with patients in need. Built with modern web technologies to facilitate life-saving blood donations through an intuitive platform.

![Blood Donation App](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration**: Separate registration for Donors and Patients with email verification
- **Secure Login**: JWT-based authentication with Argon2 password hashing
- **Role-Based Access**: Three distinct roles (Admin, Donor, Patient) with specific permissions
- **Role Switching**: Users can switch between Donor and Patient roles seamlessly
- **Password Recovery**: Forgot password and reset password functionality

### 🩸 For Donors
- **Dashboard**: Personalized dashboard showing donation statistics and history
- **Blood Request Matching**: Automatic matching with patients based on blood group and location
- **Request Management**: View, accept, or decline blood donation requests
- **Donation History**: Track all past donations with dates and details
- **Availability Status**: Toggle availability for blood donation
- **Donation Timer**: 90-day cooldown period between donations (auto-calculated)
- **Profile Management**: Update personal information, blood group, and contact details
- **Notifications**: Real-time notifications for new matching requests
- **Mobile Navigation**: Quick access to matches, history, and profile

### 🏥 For Patients
- **Dashboard**: Overview of all blood requests and their status
- **Create Blood Request**: Submit requests with hospital details, blood group, and units needed
- **Emergency Requests**: Mark urgent requests for priority matching
- **Request Tracking**: Monitor request status (Pending → Accepted → Completed)
- **Edit Requests**: Modify pending requests (hospital name, city, units)
- **Delete Requests**: Remove pending or accepted requests
- **Donor Notifications**: Get notified when donors are matched
- **Request History**: View all past requests with complete details
- **Rejection Reasons**: View detailed reasons if request is rejected by admin
- **Mobile Navigation**: Quick access to requests, create new, and profile

### 👨‍💼 For Admins
- **Comprehensive Dashboard**: 
  - Overview tab with key statistics and recent activities
  - Requests management with filtering and bulk operations
  - User management with CRUD operations
  - Analytics with charts and graphs
- **Statistics**: 
  - Total users, donors, patients, and available donors
  - Request statistics (total, pending, accepted, completed, emergency)
  - Blood group distribution
  - City-wise donor/patient distribution
- **Request Management**:
  - View all blood requests with detailed information
  - Update request status (Pending, Accepted, Completed, Rejected)
  - Reject requests with mandatory reason (min 10 characters)
  - Delete requests with validation
  - Bulk delete operations
  - Filter by status, emergency, search
  - Export functionality (coming soon)
- **User Management**:
  - View all users with role-based filtering
  - Create new users with auto-generated credentials
  - Update user information and status
  - Delete users with active request validation
  - Bulk delete operations
  - Send credentials via email
- **Analytics**:
  - Weekly/Monthly activity charts
  - Blood group availability graphs
  - City-wise distribution charts
  - Request trends over time
- **Mobile Navigation**: Quick access to all admin sections

### 📧 Email Notifications
- **Welcome Email**: Sent on successful registration
- **Request Rejection**: Detailed email with rejection reason
- **New User Credentials**: Auto-generated password sent to admin-created users
- **Request Updates**: Notifications for status changes

### 🔔 In-App Notifications
- **Real-time Updates**: Instant notifications for all important events
- **Notification Center**: Centralized view of all notifications
- **Mark as Read**: Individual or bulk mark as read
- **Delete Notifications**: Remove unwanted notifications
- **Unread Count**: Badge showing unread notification count
- **Role-Specific**: Separate notifications for Donor and Patient roles

### 🎨 UI/UX Features
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Modern UI**: Clean and intuitive interface with Tailwind CSS
- **Smooth Animations**: Framer Motion for delightful interactions
- **Loading States**: Skeleton loaders and spinners for better UX
- **Flash Messages**: Toast notifications for user feedback
- **Confirmation Modals**: Prevent accidental actions
- **Form Validation**: Real-time validation with helpful error messages
- **Mobile Bottom Navigation**: Easy navigation on mobile devices
- **Dark Mode Ready**: Prepared for dark mode implementation

### 🔍 Search & Filter
- **Request Filtering**: Filter by status, emergency, blood group, city
- **User Search**: Search users by name, email, phone, blood group
- **Pagination**: Efficient data loading with pagination
- **Sorting**: Sort by date, status, priority

### 🛡️ Security Features
- **Password Hashing**: Argon2 for secure password storage
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Zod schema validation on both frontend and backend
- **Rate Limiting**: Prevent brute force attacks
- **MongoDB Injection Protection**: Sanitized queries
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Redux Toolkit**: State management with RTK Query for API calls
- **React Router v6**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **Zod**: Schema validation for forms
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client (via RTK Query)

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Argon2**: Password hashing algorithm
- **Nodemailer**: Email sending service
- **Zod**: Schema validation
- **dotenv**: Environment variable management

### DevOps & Tools
- **Git**: Version control
- **ESLint**: Code linting
- **Prettier**: Code formatting (optional)
- **Postman**: API testing

## 📁 Project Structure

```
Blood-Donation-Emergency-Help-App/
├── client/                      # Frontend React Application
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── app/                 # Redux store configuration
│   │   ├── assets/              # Images, icons, etc.
│   │   ├── component/           # React components
│   │   │   ├── admin/           # Admin dashboard components
│   │   │   ├── common/          # Shared components
│   │   │   ├── donor/           # Donor-specific components
│   │   │   ├── patient/         # Patient-specific components
│   │   │   └── ui/              # UI components
│   │   ├── features/            # Redux slices and API
│   │   │   ├── api/             # RTK Query API definitions
│   │   │   └── auth/            # Auth slice
│   │   ├── pages/               # Page components
│   │   ├── validators/          # Zod validation schemas
│   │   ├── App.jsx              # Main App component
│   │   ├── routes.jsx           # Route definitions
│   │   └── main.jsx             # Entry point
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Node.js Application
│   ├── config/                  # Configuration files
│   │   ├── db.js                # MongoDB connection
│   │   ├── emailConfig.js       # Nodemailer setup
│   │   └── env.js               # Environment variables
│   ├── controllers/             # Route controllers
│   │   ├── adminController.js   # Admin operations
│   │   ├── donorController.js   # Donor operations
│   │   ├── patientController.js # Patient operations
│   │   ├── requestController.js # Blood request operations
│   │   ├── userController.js    # User operations
│   │   ├── notificationController.js
│   │   └── statsController.js   # Statistics
│   ├── middlewares/             # Express middlewares
│   │   ├── auth.js              # JWT verification
│   │   ├── isAdmin.js           # Admin authorization
│   │   ├── validate.js          # Zod validation
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/                  # Mongoose schemas
│   │   ├── userModel.js         # User schema
│   │   ├── requestModel.js      # Blood request schema
│   │   └── notificationModel.js # Notification schema
│   ├── routes/                  # Express routes
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── userRoutes.js        # User routes
│   │   ├── requestRoutes.js     # Request routes
│   │   ├── adminRoutes.js       # Admin routes
│   │   ├── donorRoutes.js       # Donor routes
│   │   ├── patientRoutes.js     # Patient routes
│   │   ├── notification.routes.js
│   │   └── statsRoutes.js       # Statistics routes
│   ├── utils/                   # Utility functions
│   │   ├── emailService.js      # Email templates
│   │   └── createNotification.js
│   ├── validators/              # Zod validation schemas
│   │   └── user.validator.js
│   ├── .env                     # Environment variables (not in git)
│   ├── .env.example             # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── seedAdmin.js             # Admin seeding script
│   └── server.js                # Entry point
│
├── DEPLOYMENT_CHECKLIST.md      # Deployment guide
└── README.md                    # This file
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher) or MongoDB Atlas account
- Gmail account for email service
- Git

### Clone Repository
```bash
git clone https://github.com/yourusername/blood-donation-app.git
cd blood-donation-app
```

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables (see [Environment Variables](#-environment-variables))

5. Seed admin user:
```bash
node seedAdmin.js
```

6. Start server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/blood-donation
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### Gmail App Password Setup
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not enabled)
3. App Passwords → Generate new app password
4. Copy the 16-character password to `EMAIL_PASSWORD`

## 📖 Usage

### Admin Access
**Default Admin Credentials:**
- Email: `ajaymeena62408@gmail.com`
- Password: `admin9069`

⚠️ **Important**: Change the admin password immediately after first login!

### User Registration
1. Visit the registration page
2. Fill in required details:
   - Name, Email, Password
   - Phone (10 digits)
   - Blood Group
   - City, Age (18-65), Gender
   - Select Role: Donor or Patient
3. Submit and verify email
4. Login with credentials

### Creating Blood Request (Patient)
1. Login as Patient
2. Click "Create New Request"
3. Fill in details:
   - Blood Group
   - Units needed
   - Hospital Name
   - City
   - Mark as Emergency (if urgent)
4. Submit request
5. Wait for donor matching

### Accepting Request (Donor)
1. Login as Donor
2. View matched requests in dashboard
3. Click "View Details" on any request
4. Review patient information
5. Click "Accept Request"
6. Contact patient via provided details

### Admin Operations
1. Login as Admin
2. **Dashboard**: View overall statistics
3. **Requests Tab**: 
   - View all requests
   - Update status
   - Reject with reason
   - Delete requests
4. **Users Tab**:
   - View all users
   - Create new users
   - Update user info
   - Delete users
5. **Analytics Tab**: View charts and trends

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "bloodGroup": "O+",
  "city": "Mumbai",
  "age": 25,
  "gender": "male",
  "roleType": "donor"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Request Endpoints (Protected)

#### Create Blood Request
```http
POST /request/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "bloodGroup": "A+",
  "units": 2,
  "hospitalName": "City Hospital",
  "city": "Mumbai",
  "emergency": true
}
```

#### Get Donor Matches
```http
GET /request/donor/matches
Authorization: Bearer <token>
```

#### Accept Request
```http
POST /request/:id/accept
Authorization: Bearer <token>
```

### Admin Endpoints (Protected + Admin Role)

#### Get Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer <token>
```

#### Update Request Status
```http
PUT /admin/requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "rejected",
  "rejectionReason": "Insufficient blood stock available"
}
```

#### Get All Users
```http
GET /admin/users?role=donor&available=true
Authorization: Bearer <token>
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 👥 User Roles

### 🩸 Donor
**Permissions:**
- View matched blood requests
- Accept/Decline requests
- View donation history
- Update availability status
- Manage profile
- Switch to Patient role

**Restrictions:**
- Cannot create blood requests
- Cannot donate within 90 days of last donation
- Must be 18-65 years old

### 🏥 Patient
**Permissions:**
- Create blood requests
- Edit pending requests
- Delete requests
- View request status
- Manage profile
- Switch to Donor role

**Restrictions:**
- Cannot view other patients' requests
- Cannot accept donation requests

### 👨‍💼 Admin
**Permissions:**
- Full access to all features
- Manage all users (CRUD)
- Manage all requests (CRUD)
- Update request status
- Reject requests with reason
- View analytics and statistics
- Create users with auto-generated credentials
- Bulk operations

**Restrictions:**
- Cannot be deleted by other admins
- Cannot switch roles

## 🎨 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Donor Dashboard
![Donor Dashboard](screenshots/donor-dashboard.png)

### Patient Dashboard
![Patient Dashboard](screenshots/patient-dashboard.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### Blood Request Form
![Request Form](screenshots/request-form.png)

### Mobile View
![Mobile View](screenshots/mobile.png)

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Create account on deployment platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy from `server` directory
5. Run seed script: `node seedAdmin.js`

### Frontend Deployment (Vercel/Netlify)

1. Update API base URL in `client/src/features/api/bloodApi.js`:
```javascript
baseUrl: "https://your-backend-url.com/api"
```

2. Build project:
```bash
cd client
npm run build
```

3. Deploy `dist` folder to Vercel/Netlify

### Environment Variables (Production)
- Use strong JWT_SECRET (32+ characters)
- Use MongoDB Atlas for database
- Enable MongoDB IP whitelist
- Use environment-specific email credentials
- Enable HTTPS/SSL

See `DEPLOYMENT_CHECKLIST.md` for detailed deployment guide.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ajay Meena**
- Email: ajaymeena62408@gmail.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Blood donation organizations for inspiration
- Open source community for amazing tools
- All contributors who helped improve this project

## 📞 Support

For support, email ajaymeena62408@gmail.com or create an issue in the repository.

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Complete blood donation management system
- Admin, Donor, and Patient roles
- Email notifications
- Mobile responsive design
- Request rejection with reasons
- Mobile bottom navigation

---

**Made with ❤️ for saving lives through blood donation**
