export default function TableOfContents({
    headings,
}: {
    headings: { level: number; id: string; text: string }[];
}) {
    return (
        <nav className="mt-6 mb-6 p-4 border rounded-xl bg-white dark:bg-gray-900/50 dark:border-gray-800 text-xs leading-tight shadow-sm">
            <h2 className="font-semibold text-black dark:text-gray-200 mb-3">📚 목차</h2>
            <ul className="space-y-1">
                {headings.map((h) => {
                    const baseIndent = h.level === 2 ? 'ml-0' : h.level === 3 ? 'ml-4' : 'ml-8';
                    const fontClass =
                        h.level === 2
                            ? 'font-medium'
                            : h.level === 3
                              ? 'font-normal'
                              : 'font-light';

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
