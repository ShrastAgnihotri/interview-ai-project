# Quick Start Guide - Project Management App

## ⚡ 5-Minute Setup

### Step 1: Backend Setup

```bash
# Navigate to Backend
cd Backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key

# Start the backend
npm run dev
```

✅ Backend running at: `http://localhost:5000`

---

### Step 2: Frontend Setup

```bash
# In a new terminal, navigate to Frontend
cd Frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# The API URL is already set to http://localhost:5000/api

# Start the frontend
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## 🎯 First Steps in the App

### 1. **Register & Login**
   - Go to `http://localhost:5173/register`
   - Create a new account
   - Login with your credentials

### 2. **Create Your First Project**
   - Navigate to `/projects`
   - Click "Create Project"
   - Fill in project name, description, and due date
   - Submit

### 3. **Add Team Members**
   - Open the project
   - Click "Team" tab
   - Click "Add Member"
   - Enter team member email and select role
   - Member receives access to the project

### 4. **Create Tasks**
   - In project, click "Tasks" tab
   - Click "Create New Task"
   - Fill in task details:
     - Title (required)
     - Description
     - Assign to a team member
     - Set priority (Low/Medium/High)
     - Set due date
   - Submit

### 5. **Track Progress**
   - Update task status (To Do → In Progress → Completed)
   - Check Dashboard for overview
   - Monitor overdue and upcoming tasks

---

## 📊 Dashboard

Visit `/dashboard` to see:
- **Total Tasks** - Count of all assigned tasks
- **Status Breakdown** - To Do, In Progress, Completed
- **Overdue Tasks** - Tasks past their due date
- **Upcoming Tasks** - Tasks due in next 7 days
- **Task Details** - List of all your tasks

---

## 🔑 Access Levels

### Owner (Project Creator)
- Full access to all project features
- Can delete projects
- Can manage all team members

### Admin (Assigned in project)
- Create and edit tasks
- Manage team members
- Update project details

### Member (Regular team member)
- View project and tasks
- Update status of assigned tasks
- Create tasks

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
# Update MONGO_URI in .env
# Make sure port 5000 is available

# If port in use:
# Linux/Mac: lsof -i :5000
# Windows: netstat -ano | findstr :5000
```

### Frontend won't connect to API
```bash
# Check VITE_API_URL in Frontend/.env.local
# Make sure backend is running on port 5000
# Check CORS settings in backend/src/app.js
```

### Tasks not showing up
```bash
# Make sure you're a member of the project
# Refresh the page
# Check browser console for errors
```

---

## 📱 Features Cheat Sheet

| Feature | Path | Access |
|---------|------|--------|
| Projects | `/projects` | Authenticated |
| Project Details | `/projects/:projectId` | Project members |
| Dashboard | `/dashboard` | Authenticated |
| Create Task | Project → Tasks tab | Project members |
| Manage Team | Project → Team tab | Project admin/owner |

---

## 🚀 Next Steps

1. **Customize Styling** - Update SCSS files in `Frontend/src/features/`
2. **Add Notifications** - Implement toast notifications
3. **Export Reports** - Add CSV/PDF export for tasks
4. **Team Chat** - Add real-time messaging
5. **File Attachments** - Allow uploading files to tasks

---

## 📞 Support

Need help? Check:
- `PROJECT_MANAGEMENT_README.md` - Complete documentation
- API endpoints in README
- Environment variables in `.env.example`

---

**Happy coding! 🎉**
