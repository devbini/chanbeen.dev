import Link from 'next/link';
import {AppWindow, Coffee, FolderGit2, Layers, Server} from "lucide-react";

const categories = [
    { name: 'Backend', slug: 'backend', icon: Server },
    { name: 'Frontend', slug: 'frontend', icon: AppWindow },
    { name: 'DevOps & Cloud', slug: 'devops', icon: FolderGit2 },
    { name: 'Essay', slug: 'essay', icon: Coffee },
]

export default function CategoryList() {
    return (
        <div className="p-6 mb-6 rounded-xl border bg-white dark:bg-gray-900/50 dark:border-gray-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Layers size={18} /> Categories
            </h3>
            <ul className="space-y-1">
                {categories.map((cat) => (
                    <li key={cat.slug}>
                        <Link
                            href={`/categories/${cat.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                        >
                            <cat.icon size={18} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}