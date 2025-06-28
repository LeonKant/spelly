import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="animate-fade-slide-in space-y-4">
      <h1>About</h1>
      <hr className="border-white" />
      <p>
        Hey ya'll this is a project I made to learn more about Next.js,
        PostgreSQL, and Drizzle ORM. My friends and I came up with this game
        back in 7th grade and always argued about the rules (which word is
        valid, are business names considered valid, that's not how you spell
        that word etc, etc). Now most of those points of debate are gone since
        all that's handled by this app (hallelujah). Note, if there are issues
        with functionality, that might be because the Supabase project is paused
        due to inactivity lol.
      </p>
      <span>
        Check out the{" "}
        <Link
          href="https://github.com/LeonKant/spelly"
          target="_blank"
          className="text-blue-400 hover:underline"
        >
          Github Repo
        </Link>
        .
      </span>
    </div>
  );
}
