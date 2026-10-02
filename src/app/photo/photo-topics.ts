import classification from './photo-topics.json';

export const PHOTO_TOPICS = [
    { id: 'landscape', label: '풍경' },
    { id: 'flowers', label: '꽃' },
    { id: 'travel', label: '해외여행' },
    { id: 'portrait', label: '인물' },
] as const;

export type PhotoTopic = (typeof PHOTO_TOPICS)[number]['id'];

const topicsBySource: Record<string, readonly string[]> = classification.photos;

export function getPhotoTopics(photo: { src?: string; takenAt: string }): PhotoTopic[] {
    let sourcePath: string | undefined;
    if (photo.src) {
        try {
            sourcePath = new URL(photo.src, 'https://photo.local').pathname;
        } catch {
            sourcePath = photo.src;
        }
    }

    // Existing classifications are editable; confirmed travel dates cover new photos.
    const savedTopics = sourcePath ? topicsBySource[sourcePath] : undefined;
    const topics =
        savedTopics ??
        (classification.travelPeriods.some(
            (period) => photo.takenAt >= period.start && photo.takenAt <= period.end,
        )
            ? ['travel']
            : []);

    return PHOTO_TOPICS.filter((topic) => topics.includes(topic.id)).map((topic) => topic.id);
}
