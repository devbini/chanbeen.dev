import Image from 'next/image';

export default function ProfileCard() {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

    return (
        <div className="p-6 rounded-xl border bg-white dark:bg-gray-900/50 dark:border-gray-800">
            <div className="flex items-center space-x-4">
                <Image
                    src={imageBaseUrl + '/profile.png'}
                    alt="Chanbeen Kim"
                    width={64}
                    height={64}
                    className="rounded-full"
                />
                <div>
                    <h2 className="text-xl font-semibold">Chanbeen Kim</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        6-year Full-Stack & DevOps Developer
                    </p>
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                소프트스킬과 기술로 실질적인 가치를 만들어내는 개발자입니다.
            </p>
        </div>
    );
}
