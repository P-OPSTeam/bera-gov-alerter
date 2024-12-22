import axios from 'axios';

export const sendDiscordMessage = async (message) => {
  try {
    const payload = {
      content: message,
    };

    const response = await axios.post(process.env.DISCORD_WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Discord Message sent successfully');
  } catch (error) {
    console.error('Error sending message to Discord:', error.response?.data || error.message);
  }
};
