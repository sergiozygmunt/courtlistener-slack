# CourtListener Slack Worker
This project is a Cloudflare Worker that ingests Webhooks alerts from CourtListener, formats them for Slack, and then resends them to Slack.
The Free Law Project's CourtListener is a great resource to many and has a Webhook service where it'll send you updates to cases, dockets, and more. Sadly, the Webhooks are not formatted for Slack by default. While I think the Free Law Project does great things for the legal community and beyond, I, nor this project, is affiliated, endorsed, or otherwise connected to the Free Law Project.

![docket alert pic](https://imagedelivery.net/_giFxkjSa0fKWn6HYiz9Ug/8dd0f66b-7d93-4a8a-54df-11ccf6f60400/public)
_Docket alert_

## Instructions
1. Copy the `courtlistener-slack.js` file contents to a blank Worker Quick Edit file.
![enter image description here](https://imagedelivery.net/_giFxkjSa0fKWn6HYiz9Ug/43278dc1-2f6c-48ce-2ac0-bf6a0dda7b00/public)
2. Edit the Slack URL to be your Slack webhook URL.
3. Set flags:
	You can change `showRawPayload` to append a code block of the incoming webhook for troubleshooting.
	You can change `showWebhookMetadata` to append the Webhook metadata CourtListener includes with each call for troubleshooting.
4. Set routes and triggers for the Worker to work.
![enter image description here](https://imagedelivery.net/_giFxkjSa0fKWn6HYiz9Ug/ea79f1b9-b438-49ad-fd7f-4fc5930f3900/public)
5. Protect your worker by only allowing connections from the CourtListener-specified IPs.
![enter image description here](https://imagedelivery.net/_giFxkjSa0fKWn6HYiz9Ug/814dcc8d-1c54-4123-bbd2-7c31609bca00/public) 
