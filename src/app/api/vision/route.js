import OpenAI from "openai";

export async function POST(req) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    console.log("sent to vision");

    const body = await req.json();
    const wardrobe = body.wardrobe;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Eres un asesor de imagen profesional. Tu tarea es crear las mejores combinaciones para vestirme con la ropa de mi guardarropas. Incluye la imagen con unicamente el id como src para yo poder modificarlo. Al final, dame tips o prendas extra que se te ocurran para complementar el outfit.",
            },
            ...wardrobe.flatMap((item) => [
              {
                type: "text",
                text: "El id de esta prenda es:" + item.id,
              },
              {
                type: "image_url",
                image_url: {
                  url: item.image_base64 || item.image,
                }
              },
            ]),
            {
              type: "text",
              text: "Crea las mejores combinaciones para vestirme con la ropa de mi guardarropas.",
            },
            { type: "text", text: body.message },
          ],
        },
      ],
    });

    return new Response(
      JSON.stringify({ result: response.choices[0].message.content }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
