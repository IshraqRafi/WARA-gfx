import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, assetsLink, message } = await request.json();

        const data = await resend.emails.send({
            from: 'WARA GFX Contact <onboarding@resend.dev>', // Default Resend testing domain
            to: ['waragfx@gmail.com'], // Deliver to yourself
            subject: `New Uplink from ${name}`,
            replyTo: email as string, // Reply directly to the user
            html: `
        <h1>New Contact from Website</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assets Link:</strong> <a href="${assetsLink}">${assetsLink || 'N/A'}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
