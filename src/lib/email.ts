export interface EmailPayload {
    name: string;
    email: string;
    message: string;
}

export const sendContactEmail = async (data: EmailPayload) => {
    try {
        const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || '메일 전송에 실패했습니다.');
        }

        return result;
    } catch (error) {
        throw error;
    }
};
