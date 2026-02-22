export async function POST(req) {

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const message = formData.get("message");

    const endpoint = file ? "sendPhoto" : "sendMessage";

    const telegramForm = new FormData();
    telegramForm.append("chat_id", process.env.TELEGRAM_CHAT_ID);

    if (file) {
      telegramForm.append("photo", file);
      telegramForm.append("caption", message);
      telegramForm.append("parse_mode", "HTML");
    } else {
      telegramForm.append("text", message);
      telegramForm.append("parse_mode", "HTML");
    }

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${endpoint}`,
      {
        method: "POST",
        body: telegramForm,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Telegram error:", data);
      return Response.json({ error: data }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}