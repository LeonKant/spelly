# Spelly

Hey ya'll this is a project I made to learn more about Next.js, PostgreSQL, and Drizzle ORM. My friends and I came up with this game back in 7th grade and always argued about the rules (which word is valid, are business names considered valid, that's not how you spell that word etc, etc). Now most of those points of debate are gone since all that's handled by this app (hallelujah). The working demo should be up at [spelly.org](https://www.spelly.org); if there are issues with functionality, that might be because the Supabase project is paused due to inactivity lol. Thank you for checking it out and please enjoy the rest of this AI-generated readme.

Spelly is an interactive multiplayer word game built with **Next.js**, **TailwindCSS**, and **Supabase**. Players take turns adding letters to a growing word, trying to avoid being the one who can't continue the sequence. The goal is to accumulate the fewest points and outlast your opponents!

## Features

- **Authentication** – Sign up, log in, and manage account settings (powered by Supabase Auth)
- **Private Lobbies** – Create and join private game rooms
- **Realtime Gameplay** – Game updates instantly across players using Supabase Realtime
- **PostgreSQL + Drizzle ORM** – A structured and type-safe database solution for managing game sessions and user data
- more game modes and features coming soon

## Tech Stack

| Technology                               | Purpose                                                   |
| ---------------------------------------- | --------------------------------------------------------- |
| [Next.js](https://nextjs.org/)           | Frontend framework for a seamless user experience         |
| [TailwindCSS](https://tailwindcss.com/)  | Utility-first CSS framework for modern styling            |
| [Supabase](https://supabase.com/)        | Authentication, Realtime database, and PostgreSQL backend |
| [Drizzle ORM](https://orm.drizzle.team/) | TypeScript-first ORM for interacting with the database    |

## 🎮 Game Rules

1. Players take turns adding one letter to form a word.
2. A player **must** add a valid letter that keeps the word forming.
3. If a player cannot add a valid letter, they receive a point.
4. The game progresses **through every letter in the alphabet** before ending.
5. The player with the **least** points at the end wins!

## Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/LeonKant/spelly.git
   cd spelly
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env.local` file in the root directory and add the following:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_PROJECT_URL=
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   DATABASE_URL=
   CRON_SECRET=
   NODE_ENV=
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`
