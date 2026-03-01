export async function POST(req) {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  try {
    const body = await req.json();

    // Prepare data exactly as your Google Sheet script expects it
    const payload = {
      date: body.date,
      name: body.name,
      phone: body.phone,
      province: body.province,
      address: body.address,
      items: body.items, // Array of products
      remark: body.remark,
      total: body.total,
      paymentMethod: body.payment,
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Google Apps Script requires following redirects
      redirect: "follow", 
    });

    // 1. Get the response as raw text first to avoid the SyntaxError
    const rawText = await response.text();

    // 2. Safely check if it's "Success" or JSON
    if (rawText.trim() === "Success" || rawText.includes("success")) {
      return Response.json({ success: true });
    }

    if (result.result === "success") {
      return Response.json({ success: true });
    } else {
      return Response.json({ error: "Google Sheet Error", details: result }, { status: 500 });
    }

  } catch (error) {
    console.error("ORDER_SUBMIT_ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}