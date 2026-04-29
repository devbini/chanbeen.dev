'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, Star, X } from 'lucide-react';

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
    const [renderCount, setRenderCount] = useState(INITIAL_RENDER_COUNT);
    const [layoutRevision, setLayoutRevision] = useState(0);
    const relayoutFrameRef = useRef<number | null>(null);
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
    const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex];
    const years = Array.from(new Set(photos.map((photo) => photo.takenAt.slice(0, 4)))).sort(
        (a, b) => Number(b) - Number(a),
    );
    const visiblePhotos = photos.filter((photo) => {
        if (activeFilter === 'ALL') return true;
        return photo.takenAt.startsWith(activeFilter);
    });
    const renderedPhotos = visiblePhotos.slice(0, renderCount);

    useEffect(() => {
        const photosJsonUrl = imageBaseUrl
            ? `${imageBaseUrl}/photos/photos.json`
            : '/photos/photos.json';

        async function loadPhotos() {
            try {
                const response = await fetch(photosJsonUrl, { cache: 'force-cache' });
                if (!response.ok) {
                    throw new Error(`Failed to load photos.json: ${response.status}`);
                }

                const data = (await response.json()) as PhotoItem[];
                setPhotos(data);
            } catch (error) {
                setLoadError(error instanceof Error ? error.message : 'Failed to load photos.');
            } finally {
                setIsLoading(false);
            }
        }

        void loadPhotos();
    }, [imageBaseUrl]);

    useEffect(() => {
        setRenderCount(INITIAL_RENDER_COUNT);
        setLayoutRevision((current) => current + 1);
    }, [activeFilter]);

    useEffect(() => {
        if (renderCount >= visiblePhotos.length) return;

        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let animationFrameId: number | undefined;

        timeoutId = setTimeout(() => {
            animationFrameId = window.requestAnimationFrame(() => {
                setRenderCount((current) =>
                    Math.min(current + RENDER_BATCH_SIZE, visiblePhotos.length),
                );
            });
        }, 120);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        };
    }, [renderCount, visiblePhotos.length]);

    useEffect(() => {
        return () => {
            if (relayoutFrameRef.current !== null) {
                window.cancelAnimationFrame(relayoutFrameRef.current);
            }
        };
    }, []);

    const scheduleGridRelayout = () => {
        if (relayoutFrameRef.current !== null) return;

        relayoutFrameRef.current = window.requestAnimationFrame(() => {
            relayoutFrameRef.current = null;
            setLayoutRevision((current) => current + 1);
        });
    };

    const getImageSrc = (photo: PhotoItem) => {
        if (!photo.src) return null;
        return buildImageUrl(imageBaseUrl, photo.src);
    };

    const getThumbnailSrc = (photo: PhotoItem) => {
        if (photo.thumbnailSrc) {
            return buildImageUrl(imageBaseUrl, photo.thumbnailSrc);
        }

        if (!photo.src) return null;

        const fileName = getFileNameFromSrc(photo.src);
        if (!fileName) return buildImageUrl(imageBaseUrl, photo.src);
        return buildImageUrl(imageBaseUrl, `/photos/thumbnails/${fileName}`);
    };

    const moveSelection = (direction: -1 | 1) => {
        setSlideDirection(direction);
        setSelectedIndex((current) => {
            if (current === null) return null;
            return (current + direction + photos.length) % photos.length;
        });
    };

    return (
        <main
            className="min-h-screen bg-white text-[#202020]"
            style={
                {
                    '--display-font': '"Cormorant Garamond", Georgia, "Times New Roman", serif',
                    '--ui-font':
                        'Inter, Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                } as CSSProperties
            }
        >
            <section>
                <motion.div
                    className="px-6 pb-[60px] pt-24 md:px-20 md:pt-32"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p
                        className="mb-6 text-[10px] font-semibold uppercase tracking-[0.42em] text-[#7A7A7A]"
                        style={{ fontFamily: 'var(--ui-font)' }}
                    >
                        Personal Landscape Archive
                    </p>
                    <h1
                        className="max-w-5xl text-[64px] font-medium leading-[0.92] tracking-[-0.055em] md:text-[118px]"
                        style={{ fontFamily: 'var(--display-font)' }}
                    >
                        Floating Gallery
                        <br />
                        of Quiet Horizons
                    </h1>
                    <p
                        className="mt-8 max-w-[600px] break-keep text-[15px] font-light leading-[1.8] text-[#555555]"
                        style={{ fontFamily: 'var(--ui-font)' }}
                    >
                        When the eye becomes a viewfinder, the world reveals its hidden serenity.
                    </p>

                    <FilterBar
                        activeFilter={activeFilter}
                        years={years}
                        onChange={setActiveFilter}
                    />
                </motion.div>

                {isLoading ? (
                    <div className="grid min-h-[38vh] place-items-center px-6 text-center">
                        <p
                            className="text-4xl font-medium tracking-[-0.04em] text-[#202020] md:text-6xl"
                            style={{ fontFamily: 'var(--display-font)' }}
                        >
                            Loading captured moments.
                        </p>
                    </div>
                ) : loadError ? (
                    <div className="grid min-h-[38vh] place-items-center px-6 text-center">
                        <p
                            className="text-sm text-[#666666]"
                            style={{ fontFamily: 'var(--ui-font)' }}
                        >
                            {loadError}
                        </p>
                    </div>
                ) : visiblePhotos.length > 0 ? (
                    <motion.div
                        className="columns-2 gap-px md:columns-3 lg:columns-4 2xl:columns-5"
                        data-layout-revision={layoutRevision}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {renderedPhotos.map((photo, index) => {
                            const originalIndex = photos.findIndex((item) => item.id === photo.id);
                            return (
                                <LandscapeCard
                                    key={photo.id}
                                    photo={photo}
                                    thumbnailSrc={getThumbnailSrc(photo)}
                                    originalSrc={getImageSrc(photo)}
                                    eager={index < 10}
                                    onImageLoad={scheduleGridRelayout}
                                    onClick={() => setSelectedIndex(originalIndex)}
                                />
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid min-h-[38vh] place-items-center px-6 text-center"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <p
                            className="text-4xl font-medium tracking-[-0.04em] text-[#202020] md:text-6xl"
                            style={{ fontFamily: 'var(--display-font)' }}
                        >
                            No captured moments found.
                        </p>
                    </motion.div>
                )}
            </section>

            <AnimatePresence>
                {selectedPhoto && selectedIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-[100] overflow-y-auto bg-white text-[#202020]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className="min-h-screen px-5 py-5 md:px-12 md:py-10">
                            <button
                                type="button"
                                onClick={() => setSelectedIndex(null)}
                                className="fixed right-5 top-5 z-20 grid size-11 place-items-center rounded-full bg-[#F2F2F2]/90 text-[#202020] transition hover:scale-105 md:right-10 md:top-10"
                                aria-label="Close detail view"
                            >
                                <X size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => moveSelection(-1)}
                                className="fixed left-5 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-[#F2F2F2]/90 text-[#202020] transition hover:scale-105 md:grid"
                                aria-label="Previous photo"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveSelection(1)}
                                className="fixed right-5 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-[#F2F2F2]/90 text-[#202020] transition hover:scale-105 md:grid"
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
                                        const swipePower =
                                            Math.abs(info.offset.x) * info.velocity.x;
                                        if (swipePower < -6000 || info.offset.x < -90) {
                                            moveSelection(1);
                                        }
                                        if (swipePower > 6000 || info.offset.x > 90) {
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
                                                className="mb-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#8A8A8A]"
                                                style={{ fontFamily: 'var(--ui-font)' }}
                                            >
                                                Captured
                                            </p>
                                            <h2
                                                className="text-5xl font-medium leading-none tracking-[-0.055em] md:text-7xl"
                                                style={{ fontFamily: 'var(--display-font)' }}
                                            >
                                                {selectedPhoto.takenAt}
                                            </h2>
                                        </div>

                                        <TechnicalSheet photo={selectedPhoto} />
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex justify-between pb-10 md:hidden">
                                    <button
                                        type="button"
                                        onClick={() => moveSelection(-1)}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#F2F2F2]/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
                                    >
                                        <ChevronLeft size={16} />
                                        Prev
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveSelection(1)}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#F2F2F2]/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.article>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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

function FilterBar({
    activeFilter,
    years,
    onChange,
}: {
    activeFilter: string;
    years: string[];
    onChange: (filter: string) => void;
}) {
    const filters = ['ALL', ...years];

    return (
        <div
            className="mt-14 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-9"
            style={{ fontFamily: 'var(--ui-font)' }}
        >
            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-7">
                {filters.map((filter) => (
                    <FilterButton
                        key={filter}
                        active={activeFilter === filter}
                        onClick={() => onChange(filter)}
                    >
                        {filter}
                    </FilterButton>
                ))}
            </div>
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
            className={`group relative pb-2 text-[12px] font-semibold uppercase tracking-[0.24em] transition ${
                active ? 'text-black' : 'text-[#A0A0A0] hover:text-black'
            }`}
        >
            {children}
            <span
                className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-black transition-all ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
            />
        </button>
    );
}

function LandscapeCard({
    photo,
    thumbnailSrc,
    originalSrc,
    eager,
    onImageLoad,
    onClick,
}: {
    photo: PhotoItem;
    thumbnailSrc: string | null;
    originalSrc: string | null;
    eager: boolean;
    onImageLoad: () => void;
    onClick: () => void;
}) {
    const aspectRatio = getAspectRatioStyle(photo);

    return (
        <motion.div
            role="button"
            tabIndex={0}
            data-orientation={photo.orientation}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onClick();
                }
            }}
            className="group relative mb-px inline-block w-full break-inside-avoid overflow-hidden bg-transparent p-0 text-left align-top"
            style={
                {
                    breakInside: 'avoid',
                    columnBreakInside: 'avoid',
                    WebkitColumnBreakInside: 'avoid',
                } as CSSProperties
            }
            whileHover="hover"
        >
            <motion.div
                className="relative h-auto w-full overflow-hidden bg-[#F7F7F7]"
                style={{ aspectRatio }}
                whileHover={{ boxShadow: '0 28px 70px rgba(0,0,0,0.10)' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <FrameVisual
                        photo={photo}
                        imageSrc={thumbnailSrc}
                        thumbnailSrc={thumbnailSrc}
                        fallbackSrc={originalSrc}
                        eager={eager}
                        onImageLoad={onImageLoad}
                    />
                </motion.div>

                <motion.div className="absolute inset-0 flex translate-y-3 flex-col justify-between bg-black/50 p-4 text-white opacity-0 backdrop-blur-[1px] transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-start justify-between gap-4">
                        <div
                            className="text-[22px] font-medium leading-none tracking-[-0.04em] text-white"
                            style={{ fontFamily: 'var(--display-font)' }}
                        >
                            {photo.takenAt}
                        </div>
                        <div className="flex items-center gap-3 text-[#A0A0A0]">
                            {photo.isFavorite && (
                                <span
                                    className="grid size-8 place-items-center rounded-full bg-black/20 text-white"
                                    aria-label="Curator's choice"
                                >
                                    <Star size={15} className="fill-white text-white" />
                                </span>
                            )}
                            <Compass size={22} strokeWidth={1.4} />
                        </div>
                    </div>
                    <div
                        className="drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
                        style={{ fontFamily: 'var(--ui-font)' }}
                    >
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#D8D8D8]">
                            Photo Metadata
                        </p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-[#A0A0A0]">
                            <span>{photo.metadata.camera}</span>
                            <span>{photo.metadata.aperture}</span>
                            <span>{photo.metadata.iso}</span>
                            <span>{photo.metadata.focalLength}</span>
                            <span>{photo.metadata.shutterSpeed}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function FrameVisual({
    photo,
    imageSrc,
    thumbnailSrc,
    fallbackSrc,
    onImageLoad,
    eager = false,
    large = false,
}: {
    photo: PhotoItem;
    imageSrc: string | null;
    thumbnailSrc?: string | null;
    fallbackSrc?: string | null;
    onImageLoad?: () => void;
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
                        className={`absolute inset-0 bg-[#F9F9F9] transition-opacity duration-300 ${
                            isImageLoaded ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <div className="h-full w-full animate-pulse bg-gradient-to-r from-[#F9F9F9] via-[#EFEFEF] to-[#F9F9F9]" />
                    </div>
                )}
                {!large &&
                    thumbnailSrc &&
                    thumbnailSrc !== imageSrc &&
                    thumbnailSrc !== activeImageSrc && (
                        <img
                            src={thumbnailSrc}
                            alt=""
                            aria-hidden="true"
                            loading={eager ? 'eager' : 'lazy'}
                            className="absolute inset-0 h-full w-full scale-105 object-cover blur-xl"
                        />
                    )}
                <img
                    key={activeImageSrc}
                    src={activeImageSrc}
                    alt={photo.alt || photo.id}
                    loading={large || eager ? 'eager' : 'lazy'}
                    fetchPriority={large || eager ? 'high' : 'auto'}
                    decoding="async"
                    onLoad={() => {
                        setIsImageLoaded(true);
                        onImageLoad?.();
                    }}
                    onError={() => {
                        if (!large && fallbackSrc && activeImageSrc !== fallbackSrc) {
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
            className={`relative grid h-full w-full place-items-center overflow-hidden bg-[linear-gradient(180deg,#F7F7F7_0%,#EDEDED_48%,#D8D8D8_49%,#F9F9F9_100%)] ${
                large ? 'aspect-[16/9] max-h-[72vh] w-full max-w-[1300px]' : ''
            }`}
        >
            <div className="absolute left-0 right-0 top-[48%] h-px bg-[#D8D8D8]" />
            <div className="relative z-10 text-center" style={{ fontFamily: 'var(--ui-font)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[#9A9A9A]">
                    {hasImageError ? 'Image Unavailable' : 'Image Pending'}
                </p>
                <p className="mt-3 text-[12px] text-[#7A7A7A]">{photo.aspectRatio}</p>
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
        <div className="bg-[#F2F2F2]/70 p-8" style={{ fontFamily: 'var(--ui-font)' }}>
            <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#7A7A7A]">
                Technical Spec
            </p>
            <dl className="space-y-4">
                {rows.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[120px_1fr] gap-6 text-[12px]">
                        <dt className="uppercase tracking-[0.18em] text-[#8A8A8A]">{label}</dt>
                        <dd className="text-[#202020]">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
