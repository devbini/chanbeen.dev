'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import styles from './photo.module.css';
import { getPhotoTopics, PHOTO_TOPICS } from './photo-topics';
import type { PhotoTopic } from './photo-topics';

type PhotoTheme = 'midnight' | 'cloud';

type PhotoItem = {
    id: string;
    takenAt: string;
    aspectRatio: '21/9' | '16/9' | '3/2' | '2/3' | '1/1' | '4/5' | '5/4' | '3/4' | '4/3';
    orientation: 'panorama' | 'landscape' | 'square' | 'portrait';
    widthClass: string;
    theme: PhotoTheme;
    isFavorite: boolean;
    metadata: {
        camera: string;
        lens: string;
        iso: string;
        aperture: string;
        focalLength: string;
        shutterSpeed: string;
    };
    src?: string;
    thumbnailSrc?: string;
    alt?: string;
    topics: PhotoTopic[];
};

const INITIAL_RENDER_COUNT = 20;
const RENDER_BATCH_SIZE = 20;

const getFileNameFromSrc = (src: string) => {
    try {
        return new URL(src, 'https://photo.local').pathname.split('/').pop() || null;
    } catch {
        return src.split('?')[0].split('/').pop() || null;
    }
};

const isAbsoluteUrl = (src: string) => src.startsWith('http://') || src.startsWith('https://');

const buildImageUrl = (baseUrl: string, src: string) => {
    if (isAbsoluteUrl(src)) return src;
    if (!baseUrl) return src.startsWith('/') ? src : `/${src}`;
    return `${baseUrl.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
};

const getAspectRatioStyle = (photo: PhotoItem) => {
    return photo.aspectRatio.replace('/', ' / ');
};

export default function PhotoClientPage() {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');
    const [activeTopic, setActiveTopic] = useState<PhotoTopic | 'ALL'>('ALL');
    const [renderCount, setRenderCount] = useState(INITIAL_RENDER_COUNT);
    const [columnCount, setColumnCount] = useState(2);
    const [loadAttempt, setLoadAttempt] = useState(0);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLDialogElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
    const years = useMemo(
        () =>
            Array.from(new Set(photos.map((photo) => photo.takenAt.slice(0, 4)))).sort(
                (a, b) => Number(b) - Number(a),
            ),
        [photos],
    );
    const visiblePhotos = useMemo(
        () =>
            photos.filter(
                (photo) =>
                    (activeFilter === 'ALL' || photo.takenAt.startsWith(activeFilter)) &&
                    (activeTopic === 'ALL' || photo.topics.includes(activeTopic)),
            ),
        [photos, activeFilter, activeTopic],
    );
    const selectedPhoto = selectedIndex === null ? null : visiblePhotos[selectedIndex];
    const isDetailOpen = !!selectedPhoto;
    const hasMore = renderCount < visiblePhotos.length;
    const photoColumns = useMemo(() => {
        const columns: { photo: PhotoItem; index: number }[][] = Array.from(
            { length: columnCount },
            () => [],
        );
        const heights = Array<number>(columnCount).fill(0);
        visiblePhotos.slice(0, renderCount).forEach((photo, index) => {
            const shortestColumn = heights.indexOf(Math.min(...heights));
            const [width, height] = photo.aspectRatio.split('/').map(Number);
            columns[shortestColumn].push({ photo, index });
            heights[shortestColumn] += height / width;
        });
        return columns;
    }, [visiblePhotos, renderCount, columnCount]);

    useEffect(() => {
        const controller = new AbortController();
        const photosJsonUrl = imageBaseUrl ? '/api/photos' : '/photos/photos.json';
        setIsLoading(true);
        setLoadError(null);

        async function loadPhotos() {
            try {
                const response = await fetch(photosJsonUrl, {
                    cache: 'no-cache',
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`Failed to load photos.json: ${response.status}`);
                }

                const data = (await response.json()) as Omit<PhotoItem, 'topics'>[];
                if (!Array.isArray(data)) throw new Error('Invalid photo archive.');
                if (controller.signal.aborted) return;
                setPhotos(
                    data
                        .map((photo) => ({ ...photo, topics: getPhotoTopics(photo) }))
                        .sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
                );
            } catch (error) {
                if (controller.signal.aborted) return;
                setLoadError(error instanceof Error ? error.message : 'Failed to load photos.');
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }

        void loadPhotos();
        return () => controller.abort();
    }, [imageBaseUrl, loadAttempt]);

    useEffect(() => {
        const queries = [640, 1280].map((width) => window.matchMedia(`(min-width: ${width}px)`));
        const updateColumns = () => {
            setColumnCount(2 + queries.filter((query) => query.matches).length);
        };
        updateColumns();
        queries.forEach((query) => query.addEventListener('change', updateColumns));
        return () => queries.forEach((query) => query.removeEventListener('change', updateColumns));
    }, []);

    const loadMore = useCallback(() => {
        setRenderCount((current) => Math.min(current + RENDER_BATCH_SIZE, visiblePhotos.length));
    }, [visiblePhotos.length]);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || !hasMore || isDetailOpen || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    loadMore();
                }
            },
            { rootMargin: '600px 0px' },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMore, isDetailOpen, loadMore, renderCount]);

    useEffect(() => {
        const dialog = detailRef.current;
        if (!isDetailOpen || !dialog) return;

        const previousFocus =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        const previousPadding = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const bodyPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0)
            document.body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;
        dialog.showModal();
        closeButtonRef.current?.focus({ preventScroll: true });
        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            document.body.style.paddingRight = previousPadding;
            previousFocus?.focus({ preventScroll: true });
        };
    }, [isDetailOpen]);

    const changeFilter = (filter: string) => {
        setActiveFilter(filter);
        setRenderCount(INITIAL_RENDER_COUNT);
        setSelectedIndex(null);
    };

    const changeTopic = (topic: PhotoTopic | 'ALL') => {
        setActiveTopic(topic);
        setRenderCount(INITIAL_RENDER_COUNT);
        setSelectedIndex(null);
    };

    const getImageSrc = useCallback(
        (photo: PhotoItem) => {
            if (!photo.src) return null;
            return buildImageUrl(imageBaseUrl, photo.src);
        },
        [imageBaseUrl],
    );

    const getThumbnailSrc = useCallback(
        (photo: PhotoItem) => {
            if (photo.thumbnailSrc) {
                return buildImageUrl(imageBaseUrl, photo.thumbnailSrc);
            }

            if (!photo.src) return null;

            const fileName = getFileNameFromSrc(photo.src);
            if (!fileName) return buildImageUrl(imageBaseUrl, photo.src);
            return buildImageUrl(imageBaseUrl, `/photos/thumbnails/${fileName}`);
        },
        [imageBaseUrl],
    );

    const openSelection = useCallback((index: number) => {
        setSlideDirection(1);
        setSelectedIndex(index);
    }, []);

    const moveSelection = (direction: -1 | 1) => {
        setSlideDirection(direction);
        setSelectedIndex((current) => {
            if (current === null) return null;
            return (current + direction + visiblePhotos.length) % visiblePhotos.length;
        });
    };

    return (
        <main
            className={styles.gallery}
            style={
                {
                    '--display-font': '"Cormorant Garamond", Georgia, "Times New Roman", serif',
                    '--ui-font':
                        'Inter, Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                } as CSSProperties
            }
        >
            <section className={styles.archive} aria-label="Photo archive">
                <motion.div
                    className={styles.intro}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className={styles.headingRow}>
                        <div>
                            <p className={styles.eyebrow}>CHANBEEN / PERSONAL PHOTO ARCHIVE</p>
                            <h1 className={styles.title}>
                                Quiet Horizons<span>.</span>
                            </h1>
                            <p className={styles.description}>
                                지나온 계절, 오래 남기고 싶은 장면들.
                            </p>
                        </div>
                    </div>
                    <div className={styles.toolbar}>
                        <TopicFilterBar activeTopic={activeTopic} onChange={changeTopic} />
                        <div className={styles.filterControls}>
                            <label className={styles.yearFilter}>
                                연도
                                <select
                                    aria-label="Filter photos by year"
                                    value={activeFilter}
                                    onChange={(event) => changeFilter(event.target.value)}
                                >
                                    <option value="ALL">전체 연도</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <p className={styles.photoCount} aria-live="polite" aria-atomic="true">
                                {isLoading
                                    ? 'Loading archive'
                                    : `${visiblePhotos.length} photographs`}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className={styles.emptyState} role="status">
                        <p
                            className="text-3xl font-medium tracking-[-0.04em] md:text-5xl"
                            style={{ fontFamily: 'var(--display-font)' }}
                        >
                            Loading captured moments.
                        </p>
                    </div>
                ) : loadError ? (
                    <div className={styles.emptyState} role="alert">
                        <div style={{ fontFamily: 'var(--ui-font)' }}>
                            <p className="text-sm">Unable to load the photo archive.</p>
                            <button
                                type="button"
                                onClick={() => setLoadAttempt((current) => current + 1)}
                                className={`${styles.loadButton} mt-5`}
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : visiblePhotos.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div
                            className={styles.photoGrid}
                            style={{
                                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                            }}
                        >
                            {photoColumns.map((column, columnIndex) => (
                                <div key={columnIndex} className={styles.photoColumn}>
                                    {column.map(({ photo, index }) => (
                                        <LandscapeCard
                                            key={photo.id}
                                            photo={photo}
                                            index={index}
                                            thumbnailSrc={getThumbnailSrc(photo)}
                                            originalSrc={getImageSrc(photo)}
                                            eager={index < columnCount}
                                            onSelect={openSelection}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                        {hasMore && (
                            <div ref={loadMoreRef} className="flex justify-center py-10">
                                <button
                                    type="button"
                                    onClick={loadMore}
                                    className={styles.loadButton}
                                    style={{ fontFamily: 'var(--ui-font)' }}
                                >
                                    Load more photos
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        className={styles.emptyState}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <p
                            className="text-3xl font-medium tracking-[-0.04em] md:text-5xl"
                            style={{ fontFamily: 'var(--display-font)' }}
                        >
                            No captured moments found.
                        </p>
                    </motion.div>
                )}
            </section>

            {selectedPhoto && selectedIndex !== null && (
                <motion.dialog
                    ref={detailRef}
                    aria-label="Photo detail"
                    onCancel={(event) => {
                        event.preventDefault();
                        setSelectedIndex(null);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Tab') {
                            const buttons = Array.from(
                                event.currentTarget.querySelectorAll<HTMLButtonElement>('button'),
                            ).filter(
                                (button) => !button.disabled && button.getClientRects().length > 0,
                            );
                            const first = buttons[0];
                            const last = buttons[buttons.length - 1];
                            if (event.shiftKey && document.activeElement === first) {
                                event.preventDefault();
                                last?.focus();
                            } else if (!event.shiftKey && document.activeElement === last) {
                                event.preventDefault();
                                first?.focus();
                            }
                        }
                        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                            event.preventDefault();
                            moveSelection(event.key === 'ArrowLeft' ? -1 : 1);
                        }
                    }}
                    className={styles.detail}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="min-h-screen px-5 py-5 md:px-12 md:py-10">
                        <p className={styles.detailCaption}>
                            {activeFilter === 'ALL' ? 'ARCHIVE' : activeFilter}
                            <span>
                                {String(selectedIndex + 1).padStart(2, '0')} /{' '}
                                {visiblePhotos.length}
                            </span>
                        </p>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={() => setSelectedIndex(null)}
                            className={`${styles.iconButton} fixed right-5 top-5 z-20 grid md:right-10 md:top-10`}
                            aria-label="Close detail view"
                        >
                            <X size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={() => moveSelection(-1)}
                            className={`${styles.iconButton} fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 md:grid`}
                            aria-label="Previous photo"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => moveSelection(1)}
                            className={`${styles.iconButton} fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 md:grid`}
                            aria-label="Next photo"
                        >
                            <ChevronRight size={20} />
                        </button>

                        <motion.article
                            className="mx-auto max-w-[1500px]"
                            initial={{ clipPath: 'inset(50% 0 50% 0)' }}
                            animate={{ clipPath: 'inset(0% 0 0% 0)' }}
                            exit={{ clipPath: 'inset(50% 0 50% 0)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <motion.div
                                className="grid min-h-[64vh] touch-pan-y place-items-center"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.18}
                                onDragEnd={(_, info) => {
                                    const swipePower = Math.abs(info.offset.x) * info.velocity.x;
                                    if (swipePower < -6000 || info.offset.x < -90) {
                                        moveSelection(1);
                                    } else if (swipePower > 6000 || info.offset.x > 90) {
                                        moveSelection(-1);
                                    }
                                }}
                            >
                                <AnimatePresence mode="wait" custom={slideDirection}>
                                    <motion.div
                                        key={selectedPhoto.id}
                                        className="grid w-full place-items-center"
                                        custom={slideDirection}
                                        variants={detailImageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <FrameVisual
                                            photo={selectedPhoto}
                                            imageSrc={getImageSrc(selectedPhoto)}
                                            fallbackSrc={getThumbnailSrc(selectedPhoto)}
                                            large
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${selectedPhoto.id}-meta`}
                                    className="mx-auto grid max-w-6xl gap-12 py-12 md:grid-cols-[0.8fr_1.2fr] md:py-16"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <div>
                                        <p
                                            className={styles.eyebrow}
                                            style={{ fontFamily: 'var(--ui-font)' }}
                                        >
                                            Captured
                                        </p>
                                        <h2
                                            className="mt-4 text-4xl font-medium leading-none tracking-[-0.055em] md:text-6xl"
                                            style={{ fontFamily: 'var(--display-font)' }}
                                        >
                                            {selectedPhoto.takenAt}
                                        </h2>
                                        {selectedPhoto.topics.length > 0 && (
                                            <ul
                                                className={styles.detailTopics}
                                                aria-label="Photo topics"
                                            >
                                                {PHOTO_TOPICS.filter((topic) =>
                                                    selectedPhoto.topics.includes(topic.id),
                                                ).map((topic) => (
                                                    <li key={topic.id}>{topic.label}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <TechnicalSheet photo={selectedPhoto} />
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-between pb-10 md:hidden">
                                <button
                                    type="button"
                                    onClick={() => moveSelection(-1)}
                                    className={`${styles.loadButton} inline-flex items-center gap-2`}
                                >
                                    <ChevronLeft size={16} />
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveSelection(1)}
                                    className={`${styles.loadButton} inline-flex items-center gap-2`}
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.article>
                    </div>
                </motion.dialog>
            )}
        </main>
    );
}

const detailImageVariants = {
    enter: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction > 0 ? 80 : -80,
        scale: 0.985,
    }),
    center: {
        opacity: 1,
        x: 0,
        scale: 1,
    },
    exit: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction > 0 ? -80 : 80,
        scale: 0.985,
    }),
};

function TopicFilterBar({
    activeTopic,
    onChange,
}: {
    activeTopic: PhotoTopic | 'ALL';
    onChange: (topic: PhotoTopic | 'ALL') => void;
}) {
    const filters = [{ id: 'ALL', label: '전체' } as const, ...PHOTO_TOPICS];

    return (
        <div className={styles.filters} role="group" aria-label="Filter photos by subject">
            {filters.map((filter) => (
                <FilterButton
                    key={filter.id}
                    active={activeTopic === filter.id}
                    onClick={() => onChange(filter.id)}
                >
                    {filter.label}
                </FilterButton>
            ))}
        </div>
    );
}

function FilterButton({
    active,
    children,
    onClick,
}: {
    active: boolean;
    children: ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={styles.filterButton}
        >
            {children}
        </button>
    );
}

const LandscapeCard = memo(function LandscapeCard({
    photo,
    index,
    thumbnailSrc,
    originalSrc,
    eager,
    onSelect,
}: {
    photo: PhotoItem;
    index: number;
    thumbnailSrc: string | null;
    originalSrc: string | null;
    eager: boolean;
    onSelect: (index: number) => void;
}) {
    const aspectRatio = getAspectRatioStyle(photo);

    return (
        <button
            type="button"
            aria-label={`View ${photo.alt || 'photo'} · ${photo.takenAt}`}
            data-orientation={photo.orientation}
            onClick={() => onSelect(index)}
            className={`${styles.photoCard} group`}
        >
            <div className="relative h-auto w-full overflow-hidden" style={{ aspectRatio }}>
                <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none">
                    <FrameVisual
                        photo={photo}
                        imageSrc={thumbnailSrc}
                        fallbackSrc={originalSrc}
                        eager={eager}
                    />
                </div>

                <div className={styles.cardCaption}>
                    <span>{photo.takenAt}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                </div>
            </div>
        </button>
    );
});

function FrameVisual({
    photo,
    imageSrc,
    fallbackSrc,
    eager = false,
    large = false,
}: {
    photo: PhotoItem;
    imageSrc: string | null;
    fallbackSrc?: string | null;
    eager?: boolean;
    large?: boolean;
}) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [activeImageSrc, setActiveImageSrc] = useState(imageSrc);
    const [hasImageError, setHasImageError] = useState(false);

    useEffect(() => {
        setIsImageLoaded(false);
        setActiveImageSrc(imageSrc);
        setHasImageError(false);
    }, [imageSrc]);

    if (activeImageSrc && !hasImageError) {
        return (
            <div
                className={
                    large
                        ? 'relative grid h-full w-full place-items-center overflow-visible'
                        : 'relative h-full w-full overflow-hidden'
                }
            >
                {!large && (
                    <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                            isImageLoaded ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <div className={styles.skeleton} />
                    </div>
                )}
                <img
                    key={activeImageSrc}
                    src={activeImageSrc}
                    alt={photo.alt || photo.id}
                    loading={large || eager ? 'eager' : 'lazy'}
                    fetchPriority={large ? 'high' : 'auto'}
                    decoding="async"
                    draggable={false}
                    onLoad={() => {
                        setIsImageLoaded(true);
                    }}
                    onError={() => {
                        if (fallbackSrc && activeImageSrc !== fallbackSrc) {
                            setIsImageLoaded(false);
                            setActiveImageSrc(fallbackSrc);
                            return;
                        }

                        setIsImageLoaded(false);
                        setHasImageError(true);
                        setActiveImageSrc(null);
                    }}
                    className={
                        large
                            ? 'block max-h-[78vh] max-w-full object-contain'
                            : 'relative block h-full w-full object-cover'
                    }
                />
            </div>
        );
    }

    return (
        <div
            className={`${styles.imagePlaceholder} relative grid h-full w-full place-items-center overflow-hidden ${
                large ? 'aspect-[16/9] max-h-[72vh] w-full max-w-[1300px]' : ''
            }`}
        >
            <div className="relative z-10 text-center" style={{ fontFamily: 'var(--ui-font)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                    {hasImageError ? 'Image Unavailable' : 'Image Pending'}
                </p>
                <p className="mt-3 text-[12px]">{photo.aspectRatio}</p>
            </div>
        </div>
    );
}

function TechnicalSheet({ photo }: { photo: PhotoItem }) {
    const rows = [
        ['Camera', photo.metadata.camera],
        ['Lens', photo.metadata.lens],
        ['ISO', photo.metadata.iso],
        ['Aperture', photo.metadata.aperture],
        ['Focal Length', photo.metadata.focalLength],
        ['Shutter', photo.metadata.shutterSpeed],
        ['Date', photo.takenAt],
    ];

    return (
        <div className={styles.technicalSheet}>
            <p className={`${styles.eyebrow} mb-7`}>Technical Spec</p>
            <dl className="space-y-4">
                {rows.map(([label, value]) => (
                    <div key={label} className={styles.specRow}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
