import Link from 'next/link';
import { Github, Linkedin, Rss } from 'lucide-react';

export default function Header() {
    return (
        <header className="flex justify-between items-center py-3 border-b dark:border-gray-800">
            <Link href="/" className="text-xl font-bold tracking-tighter hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-blue-600 to-pink-500 transition-all duration-300">
                김찬빈.dev 💻
            </Link>
            <nav className="flex items-center space-x-4">
                <a href="https://github.com/devbini" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"><Github size={20} /></a>
                <a href="https://linkedin.com/in/devbini/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"><Linkedin size={20} /></a>
                <Link href="/rss.xml" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"><Rss size={20} /></Link>
            </nav>
        </header>
    );
}