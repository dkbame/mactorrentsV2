# MacTorrents - Free macOS Apps & Games Distribution Platform

A modern, Apple-styled torrent index website for distributing free macOS applications and games through BitTorrent protocol.

## ✨ Features

- **Modern macOS-inspired UI** with glassmorphism design
- **Official Apple App Store categories** for organized browsing
- **Real-time torrent tracker** with live seeder/leecher stats
- **Public registration** system with user profiles
- **Advanced search and filtering** capabilities
- **Responsive design** optimized for all devices
- **BitTorrent protocol compliance** with magnet link support

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Modern icon library

### Backend
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Auth** - Authentication and user management
- **Node.js Tracker** - Custom BitTorrent tracker implementation
- **Next.js API Routes** - RESTful API endpoints

### Deployment
- **Netlify** - Frontend hosting and serverless functions
- **Supabase Cloud** - Database and authentication
- **Custom VPS** - Torrent tracker hosting (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd mactorrents
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Copy the environment template:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure your environment variables in \`.env.local\`:
\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Tracker Configuration  
TRACKER_PORT=8080
TRACKER_ANNOUNCE_URL=http://localhost:8080/announce

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=MacTorrents
NEXT_PUBLIC_SITE_DESCRIPTION=Free macOS Apps and Games Distribution Platform
\`\`\`

### 4. Database Setup

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and keys to \`.env.local\`

#### Run Database Migrations
Execute the SQL files in your Supabase SQL editor:

1. **Schema Setup**: Run \`database/schema.sql\`
2. **Seed Categories**: Run \`database/seed-categories.sql\`

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

### 6. Start Torrent Tracker (Optional)
For local development with tracker functionality:
\`\`\`bash
# In a separate terminal
npm run build  # Build the project first
node tracker-server.js
\`\`\`

## 📁 Project Structure

\`\`\`
mactorrents/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── torrent/          # Torrent-specific components
│   │   └── ui/               # Reusable UI components
│   ├── data/                 # Static data
│   │   └── categories.ts     # macOS App Store categories
│   ├── lib/                  # Utility libraries
│   │   ├── supabase.ts      # Supabase client configuration
│   │   ├── torrent.ts       # Torrent parsing utilities
│   │   ├── tracker.ts       # BitTorrent tracker implementation
│   │   └── utils.ts         # General utilities
│   └── types/               # TypeScript type definitions
│       └── database.ts      # Database schema types
├── database/                # Database files
│   ├── schema.sql          # Database schema
│   └── seed-categories.sql # Category seed data
├── public/                 # Static assets
├── tracker-server.js      # Standalone tracker server
└── README.md             # This file
\`\`\`

## 🎨 Design System

### Color Palette
- **Primary**: Apple Blue (#007AFF / #0A84FF)
- **Success**: Apple Green (#34C759)
- **Warning**: Apple Orange (#FF9500)
- **Destructive**: Apple Red (#FF3B30 / #FF453A)
- **Gray Scale**: Apple Gray system colors

### Typography
- **Font**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- **Smoothing**: Antialiased with proper font features

### Components
- **Glass morphism**: Backdrop blur with subtle transparency
- **Rounded corners**: Consistent border radius system
- **Smooth animations**: 200ms transitions with easing
- **Focus states**: Apple-style focus rings

## 🔧 API Endpoints

### Categories
- \`GET /api/categories\` - List all active categories

### Torrents
- \`GET /api/torrents\` - List torrents with pagination and filtering
- \`POST /api/torrents\` - Create new torrent (authenticated)

### Tracker
- \`GET /announce\` - BitTorrent announce endpoint
- \`GET /scrape\` - BitTorrent scrape endpoint
- \`GET /stats\` - Tracker statistics

## 📊 Database Schema

### Core Tables
- **users** - User profiles and authentication
- **categories** - Official macOS App Store categories
- **torrents** - Torrent metadata and information
- **torrent_files** - Individual files within torrents
- **peers** - Active BitTorrent peers
- **downloads** - Download tracking and statistics

### Features
- **Row Level Security** (RLS) for data protection
- **Real-time triggers** for automatic stat updates
- **Efficient indexing** for fast queries
- **UUID primary keys** for scalability

## 🚀 Deployment

### Frontend (Netlify)
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with automatic builds on push

### Database (Supabase)
- Already cloud-hosted with your Supabase project
- Automatic backups and scaling

### Tracker (VPS)
1. Deploy tracker server to a VPS or cloud instance
2. Update \`TRACKER_ANNOUNCE_URL\` in environment
3. Ensure port 8080 is accessible

## 🔒 Security Features

- **Row Level Security** on all database tables
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **CORS protection** for cross-origin requests
- **Secure file upload** handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 Legal

This platform is designed for distributing **free and legally distributable** macOS software only. Users are responsible for ensuring they have the right to distribute any content they upload.

- Only open-source, freeware, or explicitly authorized software
- DMCA compliance with takedown procedures
- Clear terms of service and privacy policy
- Content moderation and review processes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Create an issue for bug reports
- Join discussions for feature requests  
- Check the wiki for additional documentation

---

**MacTorrents** - Built with ❤️ for the macOS community