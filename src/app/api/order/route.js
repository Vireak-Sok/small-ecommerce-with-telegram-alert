// app/api/order/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  const message = formData.get('message');
  const photo = formData.get('photo');

  try {
    // 1. Send text details
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });

    // 2. Send Photo if it exists
    if (photo && photo !== "null") {
      const tgFormData = new FormData();
      tgFormData.append('chat_id', CHAT_ID);
      tgFormData.append('photo', photo);
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, tgFormData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}