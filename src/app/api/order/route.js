export async function POST(req) {
  // 1. Check Env Vars first
  // for Development
  // if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || !process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID) {
  // for Production
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return Response.json({ error: "Server environment variables missing" }, { status: 500 });
  }
  
  try {

    // 2. Safely parse FormData
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json({ error: "Invalid Content-Type. Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const message = formData.get("message");
    const endpoint = file ? "sendPhoto" : "sendMessage";

    const telegramForm = new FormData();
    // for Development
    // telegramForm.append("chat_id", process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID);
    // for Production
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
      // for Development
      // `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/${endpoint}`,
      // for Production
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