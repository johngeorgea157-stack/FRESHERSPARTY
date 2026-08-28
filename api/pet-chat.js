const ANIMATIONS = ["Idle", "Walk", "Run", "Sit", "Stand", "Wave", "Happy", "Excited", "Curious", "LookAround", "Blink", "Cheer", "Clap", "Celebrate", "Heart", "Welcome", "Smug", "Laugh", "Point", "Shrug", "Facepalm", "Tease", "Dance"];
const EXPRESSIONS = ["Smile", "Smirk", "Surprise", "Laugh", "Curious", "Sad", "Excited", "Blink"];
const schema = { type: "object", additionalProperties: false, required: ["message", "animation", "expression"], properties: { message: { type: "string", maxLength: 180 }, animation: { type: "string", enum: ANIMATIONS }, expression: { type: "string", enum: EXPRESSIONS } } };

function clean(value, limit) { return typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, limit) : ""; }
function fallback(context) { const subject = context.course || context.batch || context.name || "new friend"; return context.mode === "extra-friendly" ? { message: `${subject}? Bold choice. I respect the confidence. 😈`, animation: "Smug", expression: "Smirk" } : { message: `${subject} — that sounds like a great start. I’m glad you’re here! ✨`, animation: "Happy", expression: "Smile" }; }
function valid(reply) { return reply && typeof reply.message === "string" && ANIMATIONS.includes(reply.animation) && EXPRESSIONS.includes(reply.expression); }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const context = { name: clean(req.body?.name, 60), course: clean(req.body?.course, 80), batch: clean(req.body?.batch, 60), mode: req.body?.mode === "extra-friendly" ? "extra-friendly" : "friendly" };
  if (!context.name && !context.course && !context.batch) return res.status(400).json({ message: "No pet context supplied" });
  if (!process.env.OPENAI_API_KEY) return res.status(200).json(fallback(context));
  const personality = context.mode === "extra-friendly" ? "You are a mischievous, confident Freshers Party fox. Give one short, playful roast about the supplied context. Never be cruel or target protected traits, health, money, appearance, sex, private data, or identity." : "You are a warm, encouraging Freshers Party fox welcoming a student. Give one short, natural and funny supportive response about the supplied context.";
  try {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.PET_AI_MODEL || "gpt-4.1-mini", store: false, instructions: `${personality} Return only the requested structured result.`, input: JSON.stringify(context), text: { format: { type: "json_schema", name: "pet_reply", strict: true, schema } } }) });
    if (!response.ok) throw new Error("AI request failed");
    const data = await response.json(); const reply = JSON.parse(data.output_text || "{}");
    return res.status(200).json(valid(reply) ? reply : fallback(context));
  } catch (error) { console.error("Pet chat failed", error); return res.status(200).json(fallback(context)); }
}
