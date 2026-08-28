const ALLOWED_ANIMATIONS = new Set(["Idle", "Walk", "Run", "Sit", "Stand", "Wave", "Happy", "Excited", "Curious", "LookAround", "Blink", "Cheer", "Clap", "Celebrate", "Heart", "Welcome", "Smug", "Laugh", "Point", "Shrug", "Facepalm", "Tease", "Dance"]);
const ALLOWED_EXPRESSIONS = new Set(["Smile", "Smirk", "Surprise", "Laugh", "Curious", "Sad", "Excited", "Blink"]);

export async function requestPetReply(context) {
  const response = await fetch("/api/pet-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(context) });
  if (!response.ok) throw new Error("Pet chat is unavailable.");
  const reply = await response.json();
  return { message: String(reply.message || "I’m cheering you on!"), animation: ALLOWED_ANIMATIONS.has(reply.animation) ? reply.animation : "Idle", expression: ALLOWED_EXPRESSIONS.has(reply.expression) ? reply.expression : "Smile" };
}
