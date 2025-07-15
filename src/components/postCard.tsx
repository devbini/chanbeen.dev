import { Post } from "@/lib/posts";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }: { post: Post }) {
    return (
        <article className="
            group flex items-start space-x-6
            p-4 rounded-xl border
            bg-white dark:bg-gray-900/50
            dark:border-gray-800 shadow-sm
            transition-all duration-300
            hover:bg-gray-100 dark:hover:bg-gray-800/50
            hover:shadow-md
        ">
            {post.thumbnail && (
                <div className="flex-shrink-0 w-32 h-20 relative">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${post.thumbnail}`}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
            )}
            <div className="flex-grow">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{post.date}</p>
                <Link href={`/posts/${post.id}`}>
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {post.excerpt}
                    </p>
                </Link>
            </div>
        </article>
    );
}