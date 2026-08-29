const ANIMATIONS = [
  "Idle",
  "Walk",
  "Run",
  "Sit",
  "Stand",
  "Wave",
  "Happy",
  "Excited",
  "Curious",
  "LookAround",
  "Blink",
  "Cheer",
  "Clap",
  "Celebrate",
  "Heart",
  "Welcome",
  "Smug",
  "Laugh",
  "Point",
  "Shrug",
  "Facepalm",
  "Tease",
  "Dance"
];

const EXPRESSIONS = [
  "Smile",
  "Smirk",
  "Surprise",
  "Laugh",
  "Curious",
  "Sad",
  "Excited",
  "Blink"
];

function clean(value, limit) {
  return typeof value === "string"
    ? value.replace(/[<>]/g, "").trim().slice(0, limit)
    : "";
}

function fallback(context) {
  const subject =
    context.course ||
    context.batch ||
    context.name ||
    "new friend";

  if (context.mode === "extra-friendly") {
    return {
      message: `${subject}? Bold choice. I respect the confidence. 😈`,
      animation: "Smug",
      expression: "Smirk"
    };
  }

  return {
    message: `${subject} — that sounds like a great start. I’m glad you’re here! ✨`,
    animation: "Happy",
    expression: "Smile"
  };
}

function valid(reply) {
  return (
    reply &&
    typeof reply.message === "string" &&
    reply.message.length > 0 &&
    reply.message.length <= 180 &&
    ANIMATIONS.includes(reply.animation) &&
    EXPRESSIONS.includes(reply.expression)
  );
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  const context = {
    name: clean(req.body?.name, 60),
    course: clean(req.body?.course, 80),
    batch: clean(req.body?.batch, 60),

    mode:
      req.body?.mode === "extra-friendly"
        ? "extra-friendly"
        : "friendly",

    event: clean(req.body?.event, 40)
  };

  if (
    !context.name &&
    !context.course &&
    !context.batch
  ) {
    return res.status(400).json({
      message: "No pet context supplied"
    });
  }

  /*
   * If Gemini API key isn't configured,
   * keep the pet working with a local response.
   */

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json(
      fallback(context)
    );
  }

  const personality =
    context.mode === "extra-friendly"

      ? `
You are the Extra Friendly Fox, a mischievous,
confident and witty AI pet on a university
Freshers Party registration website.

Your personality:
- playful
- sarcastic
- clever
- mischievous
- confident
- funny

You should lightly roast the student based ONLY
on information they voluntarily entered.

Make the roast feel spontaneous and contextual.

The roast should be friendly teasing, not bullying.

Never:
- attack protected characteristics
- mention race, religion, sexuality or gender identity
- make jokes about health or disabilities
- insult appearance
- make sexual comments
- make cruel personal attacks
- mention private information
`

      : `
You are the Friendly Fox, a warm and supportive
AI pet on a university Freshers Party registration website.

Your personality:
- friendly
- encouraging
- playful
- curious
- positive
- funny

Give short natural comments based on what the
student has entered.

Make the student feel welcomed and excited
about the Freshers Party.
`;

  const prompt = `
${personality}

The student information is:

Name: ${context.name || "Not provided"}
Course: ${context.course || "Not provided"}
Batch: ${context.batch || "Not provided"}
Current event: ${context.event || "general interaction"}

Generate ONE short response.

The response should normally be one sentence,
occasionally two very short sentences.

Return ONLY valid JSON.

Required format:

{
  "message": "short response",
  "animation": "one allowed animation",
  "expression": "one allowed expression"
}

Allowed animations:

${ANIMATIONS.join(", ")}

Allowed expressions:

${EXPRESSIONS.join(", ")}

Do not use Markdown.
Do not add explanations.
Do not wrap the JSON in code fences.
`;

  try {

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key":
            process.env.GEMINI_API_KEY
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 120,

            responseMimeType:
              "application/json"
          }
        })
      }
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Gemini API error:",
        response.status,
        errorText
      );

      return res.status(200).json(
        fallback(context)
      );
    }

    const data =
      await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {

      console.error(
        "Gemini returned no text:",
        JSON.stringify(data)
      );

      return res.status(200).json(
        fallback(context)
      );
    }

    let reply;

    try {
      reply = JSON.parse(text);
    } catch (parseError) {

      console.error(
        "Gemini JSON parse error:",
        text
      );

      return res.status(200).json(
        fallback(context)
      );
    }

    if (!valid(reply)) {

      console.error(
        "Invalid Gemini response:",
        reply
      );

      return res.status(200).json(
        fallback(context)
      );
    }

    return res.status(200).json(reply);

  } catch (error) {

    console.error(
      "Pet chat failed:",
      error
    );

    return res.status(200).json(
      fallback(context)
    );
  }
}
