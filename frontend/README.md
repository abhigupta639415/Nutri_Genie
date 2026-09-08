# NutriGenie Frontend

Modern, responsive React frontend for the AI-powered fitness and diet platform.

## 🚀 Features

- **Modern UI**: Built with React and Tailwind CSS
- **Dark Mode**: Full dark mode support with theme toggle
- **Responsive Design**: Mobile-first, works on all devices
- **Real-time Charts**: Progress visualization with Recharts
- **AI Chatbot**: Interactive chat interface with NutriBot
- **Authentication**: Secure JWT-based authentication
- **Protected Routes**: Route guards for authenticated pages

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `${process.env.REACT_APP_API_URL}`

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `${process.env.REACT_APP_API_URL}`

## 📱 Pages

### Public Pages
- **Landing Page** (`/`) - Marketing page with features and CTA
- **Login** (`/login`) - User login
- **Register** (`/register`) - New user registration

### Protected Pages (Require Authentication)
- **Dashboard** (`/dashboard`) - Overview of user stats and progress
- **Diet Plan** (`/diet`) - Personalized Indian meal plans
- **Workout** (`/workout`) - Custom exercise routines
- **Progress** (`/progress`) - Charts and analytics
- **Chatbot** (`/chatbot`) - AI assistant chat interface

## 🎨 Tech Stack

- **React** 18.2.0 - UI library
- **React Router** 6.20.1 - Routing
- **Tailwind CSS** 3.4.0 - Styling
- **Recharts** 2.10.3 - Charts and graphs
- **Lucide React** 0.294.0 - Icons
- **Axios** 1.6.2 - API requests

## 🎨 Theme

The app supports both light and dark modes. Users can toggle between themes using the sun/moon icon in the navbar. The preference is saved in localStorage.

### Colors
- **Primary**: Green (#22c55e)
- **Secondary**: Various contextual colors for different components

## 📦 Build

To create a production build:
```bash
npm run build
```

The optimized files will be in the `build/` directory.

## 🔧 Configuration

The API base URL is configured in each component as:
```javascript
${process.env.REACT_APP_API_URL}
```

For production, update this to your deployed backend URL or use environment variables.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Build
```bash
npm run build
```

Then serve the `build` folder with any static hosting service.

## 📄 License

MIT
