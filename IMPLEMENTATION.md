# Health Management System

A full-stack application for managing patients, medications, and treatment assignments built with NestJS and Next.js.

## 🏗️ Architecture

### Backend (NestJS - Port 8080)
- **Database**: SQLite with TypeORM
- **Validation**: class-validator and class-transformer
- **Structure**: Modular architecture with entities, DTOs, services, and controllers
- **Testing**: Jest with unit tests for core business logic

### Frontend (Next.js - Port 3000)
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **API Communication**: Axios with interceptors
- **Structure**: Feature-based organization with reusable components

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or later)
- npm

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```
The backend will be available at `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

## 🏛️ Backend Architecture

### Entities
- **Patient**: Stores patient information (name, date of birth)
- **Medication**: Stores medication details (name, dosage, frequency)
- **Assignment**: Links patients to medications with treatment duration

### API Endpoints

#### Patients (`/patients`)
- `GET /patients` - List all patients with their assignments
- `GET /patients/:id` - Get specific patient
- `POST /patients` - Create new patient
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

#### Medications (`/medications`)
- `GET /medications` - List all medications
- `GET /medications/:id` - Get specific medication
- `POST /medications` - Create new medication
- `PATCH /medications/:id` - Update medication
- `DELETE /medications/:id` - Delete medication

#### Assignments (`/assignments`)
- `GET /assignments` - List all assignments with remaining days calculated
- `GET /assignments/:id` - Get specific assignment
- `POST /assignments` - Create new assignment
- `PATCH /assignments/:id` - Update assignment
- `DELETE /assignments/:id` - Delete assignment

### Key Features
- **Remaining Days Calculation**: Automatically calculates remaining treatment days
- **Input Validation**: Comprehensive validation using DTOs
- **Error Handling**: Proper HTTP status codes and error messages
- **Database Relations**: Proper foreign key relationships with cascade options

## 🎨 Frontend Architecture

### Pages
- **Dashboard** (`/`): Overview with statistics and recent assignments
- **Patients** (`/patients`): List and manage patients
- **Medications** (`/medications`): List and manage medications
- **Assignments** (`/assignments`): List and manage treatment assignments

### Components Structure
```
components/
├── ui/                    # Reusable UI components
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── SuccessMessage.tsx
└── Navigation.tsx         # Main navigation component

lib/
├── config.ts             # API configuration
├── api-client.ts         # Axios configuration
└── utils.ts              # Utility functions

services/
├── patient.service.ts    # Patient API calls
├── medication.service.ts # Medication API calls
└── assignment.service.ts # Assignment API calls

types/
├── patient.ts           # Patient interfaces
├── medication.ts        # Medication interfaces
└── assignment.ts        # Assignment interfaces
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

The backend includes comprehensive unit tests for the assignment service, specifically testing the remaining days calculation logic with various scenarios:
- Positive remaining days for ongoing treatments
- Zero remaining days for treatments ending today
- Negative remaining days for expired treatments
- Future treatment start dates
- Single day treatments

### Test Coverage
- Assignment service calculation logic
- Edge cases for date calculations
- Proper error handling

## 🔧 Development

### Backend Development
```bash
cd backend
npm run start:dev    # Development server with hot reload
npm run build        # Build for production
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📊 Features

### Patient Management
- Add, edit, and delete patients
- View patient age calculation
- Track patient's medication assignments
- View remaining treatment days per patient

### Medication Management
- Add, edit, and delete medications
- Define dosage and frequency
- Track medication usage across assignments

### Assignment Management
- Assign medications to patients
- Set treatment start date and duration
- **Automatic remaining days calculation**
- Visual indicators for treatment status:
  - 🟢 Green: 7+ days remaining
  - 🟡 Yellow: 4-7 days remaining
  - 🟠 Orange: 1-3 days remaining
  - 🔴 Red: Expired treatments

### Dashboard Overview
- Total patients count
- Total assignments count
- Active treatments count
- Recent assignments with treatment status
- Quick action buttons for common tasks

## 🎯 Key Implementation Details

### Remaining Days Calculation
The core business logic calculates remaining treatment days using the formula:
```
remaining_days = (start_date + number_of_days) - today
```

This calculation:
- Returns positive numbers for ongoing treatments
- Returns zero for treatments ending today
- Returns negative numbers for expired treatments
- Handles future start dates correctly

### Data Validation
- **Backend**: Uses class-validator for DTO validation
- **Frontend**: Form validation with user-friendly error messages
- **Database**: Proper constraints and relationships

### Error Handling
- **API**: Proper HTTP status codes and structured error responses
- **Frontend**: User-friendly error messages and loading states
- **Global**: Axios interceptors for consistent error handling

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive tables and forms
- Touch-friendly interface elements

## 🔗 API Integration

The frontend uses a centralized API client with:
- Base URL configuration in `lib/config.ts`
- Axios interceptors for request/response handling
- Consistent error handling across all services
- TypeScript interfaces for type safety

## 🚨 Production Considerations

For production deployment:
1. Update CORS settings in backend
2. Set proper environment variables
3. Use production database (PostgreSQL/MySQL)
4. Add authentication and authorization
5. Implement proper logging
6. Add API rate limiting
7. Use environment-specific configurations

## 📝 Future Enhancements

- User authentication and role-based access
- Email notifications for medication reminders
- Export functionality for reports
- Medication inventory management
- Mobile application
- Advanced analytics and reporting
- Integration with external health systems
