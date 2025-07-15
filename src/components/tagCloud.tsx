import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

type TagCount = {
    tag: string;
    count: number;
};

export default function TagCloud({ tags }: { tags: TagCount[] }) {
    return (
        <div className="p-6 mt-8 rounded-xl border bg-white dark:bg-gray-900/50 dark:border-gray-800">
            <h3 className="font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map(({ tag, count }) => (
                    <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                        <Badge variant="secondary" className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {tag} <span className="ml-1.5 text-gray-400">{count}</span>
                        </Badge>
                    </Link>
                ))}
            </div>
        </div>
    );
}