import { http, HttpResponse } from 'msw';

const NOTIFY_BASE_URL = 'https://api.notifications.service.gov.uk';

export const notifyHandlers = [
  http.post(
    `${NOTIFY_BASE_URL}/v2/notifications/email`,
    async ({ request }) => {
      const body = (await request.json()) as {
        template_id: string;
      };

      if (body.template_id === process.env.NOTIFY_TEMPLATE_REGISTER_SUCCESS) {
        return HttpResponse.json(
          {
            id: 'success-email-id',
            content: { body: 'Welcome!', subject: 'Registration Success' },
            template: { id: body.template_id, version: 1, uri: '...' },
          },
          { status: 201 },
        );
      }

      // 3. Default success for any other template
      return HttpResponse.json(
        {
          id: 'default-id',
          content: { body: '...', subject: '...' },
          template: { id: body.template_id, version: 1, uri: '...' },
        },
        { status: 201 },
      );
    },
  ),
];
