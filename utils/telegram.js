import axios from 'axios';

export const sendTelegramMessage = async (message) => {
  try {
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    };

    const response = await axios.post(TELEGRAM_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Telegram Message sent successfully');
  } catch (error) {
    console.error('Error sending message to Telegram:', error.response?.data || error.message);
  }
};
