# CTF Connect

CTF Connect is a social platform designed to help cybersecurity enthusiasts connect, collaborate, and participate in Capture The Flag (CTF) competitions together.

## Features

- 🔐 User Authentication with Supabase
- 👤 Detailed User Profiles
- 🤝 Team Matching System
- 📅 CTF Event Calendar
- 💡 Open Project Board
- 💬 Team Collaboration Tools

## Tech Stack

- **Frontend:** Next.js 14 with TypeScript and Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time Features:** Supabase Realtime

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ctf-connect.git
   cd ctf-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update the `.env.local` file with your Supabase credentials

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Create a new project in Supabase
2. Run the database migrations (instructions in `/supabase/migrations`)
3. Configure authentication providers in Supabase dashboard

## Deployment

The application can be deployed using Vercel:

1. Push your code to GitHub
2. Import the project to Vercel
3. Configure environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.