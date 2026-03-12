# Postman API Testing Data

## Base URL
```
http://localhost:5000/api
```

## 1. Register User (Donor)

**Endpoint:** `POST /auth/register`

**Headers:**
```json
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@gmail.com",
  "password": "password123",
  "phone": "9876543210",
  "bloodGroup": "O+",
  "city": "Mumbai",
  "age": 25,
  "gender": "male",
  "roleType": "donor"
}
```

---

## 2. Register User (Patient)

**Endpoint:** `POST /auth/register`

**Body (JSON):**
```json
{
  "name": "Priya Patel",
  "email": "priya.patel@gmail.com",
  "password": "password123",
  "phone": "9123456789",
  "bloodGroup": "A+",
  "city": "Delhi",
  "age": 30,
  "gender": "female",
  "roleType": "patient"
}
```

---

## 3. Login User

**Endpoint:** `POST /auth/login`

**Body (JSON):**
```json
{
  "email": "rahul.sharma@gmail.com",
  "password": "password123"
}
```

**Response:** Copy the `token` from response

---

## 4. Create Blood Request (Patient)

**Endpoint:** `POST /request/create`

**Headers:**
```json
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "bloodGroup": "O+",
  "units": 2,
  "hospitalName": "Apollo Hospital",
  "city": "Mumbai",
  "emergency": true
}
```

---

## 5. Get Donor Matches

**Endpoint:** `GET /request/donor/matches`

**Headers:**
```json
Authorization: Bearer YOUR_DONOR_TOKEN_HERE
```

---

## 6. Accept Request (Donor)

**Endpoint:** `POST /request/:requestId/accept`

**Headers:**
```json
Authorization: Bearer YOUR_DONOR_TOKEN_HERE
```

---

## 7. Admin Login

**Endpoint:** `POST /auth/login`

**Body (JSON):**
```json
{
  "email": "ajaymeena62408@gmail.com",
  "password": "admin9069"
}
```

---

## 8. Get Admin Dashboard Stats

**Endpoint:** `GET /admin/dashboard/stats`

**Headers:**
```json
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

---

## 9. Update Request Status (Admin)

**Endpoint:** `PUT /admin/requests/:requestId`

**Headers:**
```json
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

**Body (JSON) - Reject:**
```json
{
  "status": "rejected",
  "rejectionReason": "Insufficient blood stock available at the moment"
}
```

**Body (JSON) - Complete:**
```json
{
  "status": "completed"
}
```

---

## Quick Test Data (Copy-Paste Ready)

### Donor 1
```json
{
  "name": "Amit Kumar",
  "email": "amit.kumar@gmail.com",
  "password": "test1234",
  "phone": "9988776655",
  "bloodGroup": "B+",
  "city": "Bangalore",
  "age": 28,
  "gender": "male",
  "roleType": "donor"
}
```

### Donor 2
```json
{
  "name": "Sneha Reddy",
  "email": "sneha.reddy@gmail.com",
  "password": "test1234",
  "phone": "8877665544",
  "bloodGroup": "AB+",
  "city": "Hyderabad",
  "age": 26,
  "gender": "female",
  "roleType": "donor"
}
```

### Patient 1
```json
{
  "name": "Vikram Singh",
  "email": "vikram.singh@gmail.com",
  "password": "test1234",
  "phone": "7766554433",
  "bloodGroup": "O-",
  "city": "Pune",
  "age": 35,
  "gender": "male",
  "roleType": "patient"
}
```

### Patient 2
```json
{
  "name": "Anjali Verma",
  "email": "anjali.verma@gmail.com",
  "password": "test1234",
  "phone": "6655443322",
  "bloodGroup": "A-",
  "city": "Chennai",
  "age": 29,
  "gender": "female",
  "roleType": "patient"
}
```

---

## Testing Flow

1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Register Donor** → Copy token
3. **Register Patient** → Copy token
4. **Patient Login** → Create Blood Request
5. **Donor Login** → View Matches → Accept Request
6. **Admin Login** → View Dashboard → Update Status

---

## Expected Responses

### Success (200/201):
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error (400/401/500):
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```
