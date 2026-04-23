import { NextResponse } from 'next/server';

function escapeHtml(text) {
  if (!text) return 'N/A';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Fallback to hardcoded credentials if Vercel environment variables are missing
    const token = process.env.TELEGRAM_BOT_TOKEN || '8606921616:AAGxD4J__zxovB4yZiBtNdZnI-Ljvwytp6c';
    const chatId = process.env.TELEGRAM_CHAT_ID || '8486489983';

    console.log('Attempting to send Telegram message...');
    console.log('Chat ID:', chatId);
    // Never log the full token for security, but check if it exists
    console.log('Token exists:', !!token);

    if (!token || !chatId) {
      console.error('Telegram Bot Token or Chat ID missing from environment variables');
      return NextResponse.json({ error: 'Telegram configuration missing' }, { status: 500 });
    }

    const message = `
<b>🚀 New Customer Form Submitted</b>
---------------------------
<b>👤 Name:</b> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}
<b>📧 Email:</b> ${escapeHtml(data.email)}
<b>📞 Phone:</b> ${escapeHtml(data.phone)}

<b>🏠 Billing Address:</b>
${escapeHtml(data.street)}
${escapeHtml(data.city)}, ${escapeHtml(data.state)} ${escapeHtml(data.zip)}

<b>💳 Payment Intent:</b> ${escapeHtml(data.paymentMethod ? data.paymentMethod.toUpperCase() : 'N/A')}
---------------------------
<b>📍 Status:</b> ${escapeHtml(data.status)}
    `;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    console.log('Telegram API Response:', result);

    if (!result.ok) {
      console.error('Telegram API Error:', result.description);
      return NextResponse.json({ 
        error: result.description || 'Telegram API Error', 
        details: result 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error in API Route' 
    }, { status: 500 });
  }
}
