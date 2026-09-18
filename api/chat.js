export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: `
أنت وكيل ذكاء اصطناعي شخصي.
ساعد المستخدم في تطوير المواقع والبرمجة وتحليل المشاريع.
كن دقيقاً ومباشراً.
لا تدّعي تنفيذ أي عملية لم تنفذها فعلياً.
حالياً أنت في وضع القراءة والتحليل فقط.
`,
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "لم أحصل على إجابة."
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
