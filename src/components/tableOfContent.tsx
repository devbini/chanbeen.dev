import {AlignLeft} from "lucide-react";

export default function TableOfContents({
    headings,
}: {
    headings: { level: number; id: string; text: string }[];
}) {
    return (
        <nav className="mt-6 mb-6 p-6 border rounded-xl bg-white dark:bg-gray-900/50 dark:border-gray-800 text-sm leading-tight shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlignLeft size={20} className="text-blue-600 dark:text-blue-400" />
                목차
            </h3>
            <ul className="space-y-2 border-l border-gray-200 dark:border-gray-800 ml-2.5 pl-4">
                {headings.map((h) => {
                    const baseIndent = h.level === 2 ? 'ml-0' : h.level === 3 ? 'ml-3' : 'ml-6';
                    const fontClass =
                        h.level === 2
                            ? 'font-medium text-gray-800 dark:text-gray-200'
                            : 'font-normal text-gray-500 dark:text-gray-400';

                    return (
                        <li key={h.id} className={baseIndent}>
                            <a
                                href={`#${h.id}`}
                                className={`block px-2 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-gray-800 text-black dark:text-blue-400 transition-colors ${fontClass}`}
                            >
                                {h.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
