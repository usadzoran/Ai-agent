export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "الرسالة فارغة."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({
          model: "gpt-5-mini",

          instructions: `
أنت وكيل ذكاء اصطناعي شخصي للمستخدم.

مهمتك مساعدته في:
- تطوير المواقع.
- تحليل أخطاء المشاريع.
- البرمجة.
- تحليل ملفات المشاريع.
- التخطيط للمهام التقنية.

كن مباشراً وواضحاً.
لا تدّعي أنك نفذت عملية لم تنفذها.
حالياً ليس لديك صلاحية تعديل GitHub أو Supabase.
أنت في وضع التحليل والمساعدة فقط.
`,

          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "حدث خطأ من خدمة الذكاء الاصطناعي."
      });
    }

    return res.status(200).json({
      reply:
        data.output_text ||
        "لم يتم الحصول على رد."
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "حدث خطأ داخلي في الوكيل."
    });
  }
}
