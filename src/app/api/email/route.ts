import { NextResponse } from 'next/server';

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // 검증
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const params = {
            Source: process.env.ADMIN_GMAIL_ADDRESS as string,
            Destination: {
                ToAddresses: [process.env.ADMIN_GMAIL_ADDRESS as string],
            },
            ReplyToAddresses: [email],
            Message: {
                Subject: {
                    Data: `[포트폴리오 문의] ${name}님으로부터 메시지`,

                    Charset: 'UTF-8',
                },
                Body: {
                    Text: {
                        Data: `보낸 사람: ${name}\n이메일: ${email}\n\n[내용]\n${message}`,
                        Charset: 'UTF-8',
                    },
                    Html: {
                        Data: `
                            <h3>문의가 도착했습니다.</h3>
                            <p><strong>이름:</strong> ${name}</p>
                            <p><strong>이메일:</strong> ${email}</p>
                            <br/>
                            <p>${message}</p>
                            `,
                        Charset: 'UTF-8',
                    },
                },
            },
        };
        const command = new SendEmailCommand(params);
        await sesClient.send(command);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('SES Error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
