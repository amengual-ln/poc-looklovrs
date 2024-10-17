import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";

export async function POST(req) {
  const wardrobe = [
    {
      id: 1,
      image: "public/resized1.jpeg",
      image_base64: await fs.readFile(
        path.resolve("public/resized1.jpeg"),
        "base64"
      ),
    },
    {
      id: 2,
      image: "public/resized2.jpeg",
      image_base64: await fs.readFile(
        path.resolve("public/resized2.jpeg"),
        "base64"
      ),
    },
    {
      id: 3,
      image: "public/resized3.jpeg",
      image_base64: await fs.readFile(
        path.resolve("public/resized3.jpeg"),
        "base64"
      ),
    },
    {
      id: 4,
      image: "public/resized4.jpeg",
      image_base64: await fs.readFile(
        path.resolve("public/resized4.jpeg"),
        "base64"
      ),
    },
    {
      id: 5,
      image: "public/resized5.jpeg",
      image_base64: await fs.readFile(
        path.resolve("public/resized5.jpeg"),
        "base64"
      ),
    },
  ];
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    console.log("sent to vision");

    const body = await req.json(); // Parse the request body

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Eres un asesor de imagen profesional. Tu tarea es crear las mejores combinaciones para vestirme con la ropa de mi guardarropas. Incluye el id de cada prenda y la imagen correspondiente. Al final, dame tips o prendas extra que se te ocurran para complementar el outfit.",
            },
            ...wardrobe.map(
              (item) => (
                { type: "text", text: "El id de esta prenda es:" + item.id },
                {
                  type: "image_url",
                  image_url: `data:image/jpeg;base64,${item.image_base64}`,
                }
              )
            ),
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
