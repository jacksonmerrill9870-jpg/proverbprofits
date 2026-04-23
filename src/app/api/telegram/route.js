import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Replace these with your actual credentials or use process.env
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

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
<b>👤 Name:</b> ${data.firstName || 'N/A'} ${data.lastName || 'N/A'}
<b>📧 Email:</b> ${data.email || 'N/A'}
<b>📞 Phone:</b> ${data.phone || 'N/A'}

<b>🏠 Billing Address:</b>
${data.street || 'N/A'}
${data.city || 'N/A'}, ${data.state || 'N/A'} ${data.zip || 'N/A'}

<b>💳 Payment Intent:</b> ${data.paymentMethod ? data.paymentMethod.toUpperCase() : 'N/A'}
---------------------------
<b>📍 Status:</b> ${data.status || 'Form Data Only'}
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
      return NextResponse.json({ error: result.description, details: result }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
