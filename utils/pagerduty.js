import axios from 'axios';

const PAGERDUTY_EVENTS_API_URL = 'https://events.pagerduty.com/v2/enqueue';

export const triggerPagerDutyIncident = async (eventDetails) => {
    try {
        const payload = {
            routing_key: process.env.PAGERDUTY_INTEGRATION_KEY,
            event_action: 'trigger',
            payload: {
                summary: eventDetails.summary,
                source: eventDetails.source,
                severity: eventDetails.severity || 'error',
                custom_details: eventDetails.custom_details || {},
            },
        };

        const response = await axios.post(PAGERDUTY_EVENTS_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Incident triggered successfully');
    } catch (error) {
        console.error('Error triggering PagerDuty incident:', error.response?.data || error.message);
    }
};
