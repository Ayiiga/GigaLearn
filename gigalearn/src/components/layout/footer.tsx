import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-giga-border bg-white dark:bg-giga-surface dark:border-giga-border-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎓</span>
              <span className="font-display text-xl font-bold text-gradient">GigaLearn</span>
            </div>
            <p className="text-sm text-giga-muted">
              Learn, Read, Speak, and Grow Smarter Every Day.
            </p>
            <p className="mt-2 text-xs text-giga-muted">
              GigaPhonics — our flagship phonics module
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-giga-muted">
              <li><Link href="/learn" className="hover:text-giga-purple">Learning Paths</Link></li>
              <li><Link href="/gigaphonics" className="hover:text-giga-purple">GigaPhonics</Link></li>
              <li><Link href="/stories" className="hover:text-giga-purple">Stories</Link></li>
              <li><Link href="/games" className="hover:text-giga-purple">Games</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">For Everyone</h4>
            <ul className="space-y-2 text-sm text-giga-muted">
              <li><Link href="/teachers" className="hover:text-giga-purple">Teachers</Link></li>
              <li><Link href="/parents" className="hover:text-giga-purple">Parents</Link></li>
              <li><Link href="/ai-tutor" className="hover:text-giga-purple">AI Tutor</Link></li>
              <li><Link href="/help" className="hover:text-giga-purple">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-giga-muted">
              <li><Link href="/login" className="hover:text-giga-purple">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-giga-purple">Create Account</Link></li>
              <li><Link href="/settings" className="hover:text-giga-purple">Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-giga-border pt-8 text-center text-sm text-giga-muted dark:border-giga-border-dark">
          <p>© {new Date().getFullYear()} GigaLearn. Safe, fun learning for children worldwide. 🌍</p>
        </div>
      </div>
    </footer>
  );
}
