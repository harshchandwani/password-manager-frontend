import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, password } = await req.json();

    // Send data to the backend for user registration (use your backend API URL)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
}
