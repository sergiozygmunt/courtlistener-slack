addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // Check if the request is a POST request (assuming the CourtListener sends a POST request)
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Parse the incoming JSON payload from the CourtListener webhook
    const payload = await request.json();

    // Modify or process the payload data if needed (optional)

    // Format the payload to be sent to Slack in the desired format
    const formattedPayload = formatPayload(payload, false); // Pass showWebhookMetadata flag as an argument

    // Set the feature flags to control sections visibility
    const showRawPayload = false; // Set to true to include the raw payload section
    const showWebhookMetadata = false; // Set to true to include the webhook metadata section

    const slackPayload = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Received a new webhook from CourtListener:*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: formattedPayload,
          },
        },
      ],
    };

    // Add the second section (raw payload) if the feature flag is set to true
    if (showRawPayload) {
      slackPayload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Raw Payload:*",
        },
      });
      slackPayload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "```" + JSON.stringify(payload, null, 2) + "```",
        },
      });
    }

    // Add the webhook metadata section if the feature flag is set to true and "webhook" property is present
    if (showWebhookMetadata && payload.hasOwnProperty("webhook")) {
      slackPayload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Webhook Metadata:*",
        },
      });
      slackPayload.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: formatObject(payload.webhook),
        },
      });
    }

    // Send the payload to Slack webhook endpoint
    const slackWebhookUrl = "https://hooks.slack.com/services/redacted/redacted/redacted";
    const slackResponse = await fetch(slackWebhookUrl, {
      method: "POST",
      body: JSON.stringify(slackPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the Slack request was successful
    if (!slackResponse.ok) {
      // Handle the error if necessary
      return new Response("Failed to send data to Slack", {
        status: slackResponse.status,
      });
    }

    // Return a success response
    return new Response("Webhook data sent to Slack successfully", {
      status: 200,
    });
  } catch (error) {
    // Handle any unexpected errors
    return new Response("An error occurred: " + error.message, { status: 500 });
  }
}

function formatPayload(payload, showWebhookMetadata) {
  let formattedPayload = "";
  for (const [key, value] of Object.entries(payload)) {
    // Exclude "webhook" property when showWebhookMetadata is false
    if (!(!showWebhookMetadata && key === "webhook")) {
      const formattedKey = formatKey(key); // Format the key
      formattedPayload += `*${formattedKey}*: ${formatValue(value)}\n`;
    }
  }
  return formattedPayload.trim();
}

function formatKey(key) {
  // Replace underscores with spaces and capitalize each word
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return "null";
  } else if (typeof value === "boolean") {
    return value ? "true" : "false";
  } else if (typeof value === "object") {
    if (value instanceof Date) {
      return formatDateTime(value);
    } else {
      return formatObject(value);
    }
  } else {
    return value;
  }
}

function formatObject(obj) {
  let formattedObj = "";
  for (const [key, value] of Object.entries(obj)) {
    formattedObj += `*${formatKey(key)}*: ${formatValue(value)}\n`;
  }
  return formattedObj;
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}
