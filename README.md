# Devoo Chat App 🔥

A modern, real-time chat application built with **React**, **TypeScript**, and **Firebase**.

## ✨ Features

- 🔐 **Authentication** - Email/Password login & registration
- 💬 **Real-time messaging** - Instant message updates with Firestore
- 🖼️ **Image sharing** - Upload and share images in chats
- 👤 **User profiles** - Customizable profile pictures
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS & DaisyUI
- 📱 **Responsive** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend Framework**: ![React.js](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white&logoWidth=12) + ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white&logoWidth=12)
- **State Management**: ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=zustand&logoColor=white&logoWidth=12)
- **Styling**: ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white&logoWidth=12) + ![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=flat&logo=daisyui&logoColor=white&logoWidth=12)
- **Backend/Database**: ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=white&logoWidth=12)
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Build Tool**: ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white&logoWidth=12)
- **Routing**: ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white&logoWidth=12)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is fine)

### 1. Clone & Install

```bash
git clone https://github.com/dirgaydtm/Devoo-App.git
cd Devoo-App
npm install
```

### 2. Setup Firebase

Follow the detailed guide in [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md) or:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Cloud Storage
6. Get your Firebase config

### 3. Configure Environment Variables

```bash
# Copy .env.example to .env
cp .env.example .env
```

Edit `.env` and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

## 📁 Project Structure

```
Devoo-App/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components (Auth, Home, Profile, etc.)
│   ├── store/           # Zustand state management
│   │   ├── useAuthStore.ts    # Authentication state
│   │   ├── useChatStore.ts    # Chat/messaging state
│   │   └── useThemeStore.ts   # Theme state
│   ├── lib/             # Utilities & configurations
│   │   └── firebase.ts  # Firebase initialization
│   └── App.tsx          # Main app component
├── public/              # Static assets
├── firestore.rules      # Firestore security rules
├── storage.rules        # Storage security rules
├── .env.example         # Environment variables template
└── FIREBASE_SETUP.md    # Detailed Firebase setup guide
```

## 🔒 Security

- Firestore security rules ensure users can only access their own data
- Firebase Authentication handles secure login
- Environment variables keep sensitive config safe
- Never commit `.env` file to git

## 📖 Documentation

- [Firebase Setup Guide](FIREBASE_SETUP.md) - Complete Firebase configuration
- [Firestore Rules](firestore.rules) - Database security rules
- [Storage Rules](storage.rules) - File storage security rules

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this project for learning or your own applications!

## 👨‍💻 Author

**Dirga Yuditama**
- GitHub: [@dirgaydtm](https://github.com/dirgaydtm)

---

Made with ❤️ and Firebase 🔥
```
