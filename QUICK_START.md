# Quick Start Guide

## Easy Start (Windows)

### Option 1: Use Batch Files
1. Double-click `start-backend.bat` to start the backend server
2. Double-click `start-frontend.bat` to start the frontend server
3. Wait for both servers to fully start
4. Navigate to http://localhost:3000

### Option 2: Manual Start

## Running the Backend (Port 8080)

1. Open terminal in `backend` directory
2. Run: `npm install` (if not done already)
3. Run: `npm run start:dev`
4. Backend should start on http://localhost:8080

### Test Backend APIs:
- GET http://localhost:8080/patients
- GET http://localhost:8080/medications  
- GET http://localhost:8080/assignments

## Running the Frontend (Port 3000)

1. Open terminal in `frontend` directory
2. Run: `npm install` (if not done already)
3. Run: `npm run dev`
4. Frontend should start on http://localhost:3000

## Troubleshooting

### "Failed to load patients data" Error:
1. Make sure backend is running on port 8080
2. Check backend console for errors
3. Verify CORS is enabled (already configured)
4. Check browser network tab for actual error

### Common Issues:
- Backend not starting: Check if port 8080 is free
- Frontend not loading: Check if port 3000 is free
- API errors: Check backend logs for detailed error messages

## Testing the Application

1. Start backend server first
2. Start frontend server
3. Navigate to http://localhost:3000
4. You should see the dashboard with statistics
5. Try creating a patient first, then a medication, then an assignment

## API Endpoints Available:

### Patients
- GET /patients - List all patients
- POST /patients - Create patient
- GET /patients/:id - Get specific patient
- PATCH /patients/:id - Update patient
- DELETE /patients/:id - Delete patient

### Medications  
- GET /medications - List all medications
- POST /medications - Create medication
- GET /medications/:id - Get specific medication
- PATCH /medications/:id - Update medication
- DELETE /medications/:id - Delete medication

### Assignments
- GET /assignments - List all assignments (with remaining days)
- POST /assignments - Create assignment
- GET /assignments/:id - Get specific assignment
- PATCH /assignments/:id - Update assignment
- DELETE /assignments/:id - Delete assignment

## Features Working

### ✅ Completed Features:
- **Dashboard**: Overview with statistics and debug connection tools
- **Patients**: List, Create, Edit, Delete patients
- **Medications**: List, Create, Edit, Delete medications  
- **Assignments**: List, Create, Edit, Delete treatment assignments
- **Remaining Days Calculation**: Automatic calculation of remaining treatment days
- **Validation**: Form validation on both frontend and backend
- **Error Handling**: Detailed error messages and user feedback
- **Responsive Design**: Mobile-friendly interface

### 🔧 Edit Pages:
- **Edit Patient**: `/patients/[id]/edit` - Edit patient name and date of birth
- **Edit Medication**: `/medications/[id]/edit` - Edit medication details and frequency  
- **Edit Assignment**: `/assignments/[id]/edit` - Edit start date and duration (patient/medication locked)

### 🎯 Key Features:
1. **CRUD Operations**: Full Create, Read, Update, Delete for all entities
2. **Data Validation**: Class-validator with proper type conversion
3. **Remaining Days**: Real-time calculation based on start date and duration
4. **Clean UI**: Modern, responsive interface with Tailwind CSS
5. **Error Handling**: Comprehensive error messages and loading states
