# Project Management Web App

A comprehensive web application for managing projects, tasks, and teams with role-based access control. Built with **Express.js** (Backend), **MongoDB** (Database), and **React** (Frontend).

---

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Signup, Login, Logout with JWT
- ✅ **Project Management** - Create, read, update, delete projects
- ✅ **Team Management** - Add members, assign roles (Admin/Member)
- ✅ **Task Management** - Create, assign, track task status and priority
- ✅ **Dashboard** - Overview of tasks, status counts, and deadlines
- ✅ **Role-Based Access Control** - Admin and Member roles with specific permissions
- ✅ **Status Tracking** - Track overdue and upcoming tasks
- ✅ **Real-time Updates** - Context-based state management for seamless UX

### Backend
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- Role-based access control middleware
- Data validation with Zod
- JWT authentication
- Password encryption with bcryptjs

### Frontend
- React with modern hooks and Context API
- React Router v7 for navigation
- Axios for API communication
- SCSS for styling
- Fully responsive design

---

## 📋 Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: Enum["admin", "member"] (default: "member"),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  owner: ObjectId (ref: User),
  members: [{
    userId: ObjectId (ref: User),
    role: Enum["admin", "member"] (default: "member")
  }],
  status: Enum["active", "completed", "archived"] (default: "active"),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  project: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User, required),
  status: Enum["todo", "in-progress", "completed"] (default: "todo"),
  priority: Enum["low", "medium", "high"] (default: "medium"),
  dueDate: Date,
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Role-Based Access Control

### Admin Role (in a project)
- ✅ Create and edit projects
- ✅ Delete projects
- ✅ Manage team members
- ✅ Change member roles
- ✅ Create and edit tasks
- ✅ Delete tasks

### Member Role (in a project)
- ✅ View project details
- ✅ View tasks
- ✅ Update task status (only assigned tasks)
- ✅ Create tasks

### Owner (Project Creator)
- ✅ Full control over the project
- ✅ Can delete the project
- ✅ Can manage all members

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/logout            - Logout user
GET    /api/auth/get-me            - Get current user (Protected)
```

### Projects
```
POST   /api/projects               - Create project (Protected)
GET    /api/projects               - Get all user projects (Protected)
GET    /api/projects/:projectId    - Get single project (Protected)
PUT    /api/projects/:projectId    - Update project (Protected, Owner/Admin)
DELETE /api/projects/:projectId    - Delete project (Protected, Owner)

POST   /api/projects/:projectId/members              - Add member (Protected, Owner/Admin)
DELETE /api/projects/:projectId/members/:memberId   - Remove member (Protected, Owner/Admin)
PUT    /api/projects/:projectId/members/:memberId   - Update member role (Protected, Owner/Admin)
```

### Tasks
```
POST   /api/tasks/:projectId/tasks                  - Create task (Protected)
GET    /api/tasks/:projectId/tasks                  - Get project tasks (Protected)
GET    /api/tasks/:taskId                           - Get single task (Protected)
PUT    /api/tasks/:taskId                           - Update task (Protected)
DELETE /api/tasks/:taskId                           - Delete task (Protected)

GET    /api/tasks/dashboard/my                      - Get user dashboard (Protected)
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create .env File**
   ```bash
   MONGO_URI=mongodb://localhost:27017/project-manager
   JWT_SECRET=your-secret-key-here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Run Backend**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create .env File**
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run Frontend**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Auth logic
│   │   ├── project.controller.js    # Project CRUD & team management
│   │   └── task.controller.js       # Task CRUD & dashboard
│   ├── models/
│   │   ├── user.model.js            # User schema
│   │   ├── project.model.js         # Project schema
│   │   └── task.model.js            # Task schema
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification
│   │   └── rbac.middleware.js       # Role-based access control
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   └── task.routes.js
│   └── app.js                       # Express app setup
├── server.js                        # Entry point
└── package.json

Frontend/
├── src/
│   ├── features/
│   │   ├── auth/                    # Authentication feature
│   │   ├── project/                 # Project management
│   │   │   ├── components/
│   │   │   │   ├── ProjectsList.jsx
│   │   │   │   ├── CreateProjectForm.jsx
│   │   │   │   └── ProjectMembers.jsx
│   │   │   ├── pages/
│   │   │   │   ├── ProjectsPage.jsx
│   │   │   │   └── ProjectDetailPage.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useProject.js
│   │   │   ├── services/
│   │   │   │   └── project.api.js
│   │   │   ├── project.context.jsx
│   │   │   └── styles/
│   │   │       └── project.scss
│   │   ├── task/                    # Task management
│   │   │   ├── components/
│   │   │   │   ├── CreateTaskForm.jsx
│   │   │   │   ├── TasksList.jsx
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useTask.js
│   │   │   ├── services/
│   │   │   │   └── task.api.js
│   │   │   ├── task.context.jsx
│   │   │   └── styles/
│   │   │       ├── task.scss
│   │   │       └── dashboard.scss
│   │   └── interview/               # Interview feature (existing)
│   ├── App.jsx
│   ├── app.routes.jsx               # Route configuration
│   └── main.jsx
└── package.json
```

---

## 🔑 Key Features Explained

### 1. Project Management
- **Create Projects** - Users can create new projects with optional descriptions and due dates
- **View Projects** - See all projects where you're an owner or member
- **Edit Projects** - Update project details (Owner/Admin only)
- **Delete Projects** - Remove projects and all associated tasks (Owner only)

### 2. Team Management
- **Add Members** - Invite team members by email with role assignment
- **Manage Roles** - Change member roles between Admin and Member
- **Remove Members** - Remove team members from projects

### 3. Task Management
- **Create Tasks** - Create tasks with title, description, priority, and due date
- **Assign Tasks** - Assign tasks to team members
- **Update Status** - Track task progress (To Do → In Progress → Completed)
- **Priority Levels** - Low, Medium, High priority levels
- **Track Overdue** - Automatically mark tasks as overdue when past due date

### 4. Dashboard
- **Task Overview** - See all assigned tasks with status breakdown
- **Overdue Tasks** - List of overdue tasks for quick action
- **Upcoming Tasks** - Tasks due in the next 7 days
- **Quick Stats** - Total tasks, completed, in progress counts

---

## 🧪 Testing the App

### 1. Create User Accounts
- Register two users to test team collaboration
- One will be project owner, another team member

### 2. Create a Project
- Navigate to Projects page
- Click "Create Project"
- Fill in project details

### 3. Add Team Members
- Go to project details
- Click "Team" tab
- Add members by email
- Assign roles (Admin/Member)

### 4. Create Tasks
- Click "Tasks" tab
- Create multiple tasks with different priorities
- Assign tasks to team members

### 5. Update Task Status
- Change task status to "In Progress"
- Mark tasks as "Completed"
- Observe status updates in dashboard

### 6. View Dashboard
- Navigate to Dashboard
- See task overview and upcoming deadlines

---

## 🔒 Security Features

- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **JWT Tokens** - Secure authentication tokens
- ✅ **RBAC** - Role-based access control middleware
- ✅ **CORS** - Cross-origin resource sharing configured
- ✅ **Input Validation** - Zod schema validation
- ✅ **Protected Routes** - Frontend route protection

---

## 🚀 Deployment

### Backend (Vercel/Heroku)
```bash
# Add start script to package.json
"start": "node server.js"

# Deploy to Vercel
vercel deploy
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

---

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙋 Support

For issues and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**Happy Project Managing! 🎉**
