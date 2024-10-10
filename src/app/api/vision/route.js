import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from 'openai';

export async function POST(req) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    try {
        console.log('sent to vision');
        
        const body = await req.json(); // Parse the request body

        // Reading images as base64 from the public directory
        const image1 = await fs.readFile(path.resolve('public/resized1.jpeg'), 'base64');
        const image2 = await fs.readFile(path.resolve('public/resized2.jpeg'), 'base64');
        const image3 = await fs.readFile(path.resolve('public/resized3.jpeg'), 'base64');
        const image4 = await fs.readFile(path.resolve('public/resized4.jpeg'), 'base64');
        const image5 = await fs.readFile(path.resolve('public/resized5.jpeg'), 'base64');

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "image_url", image_url: `data:image/jpeg;base64,${image1}` },
                        { type: "image_url", image_url: `data:image/jpeg;base64,${image2}` },
                        { type: "image_url", image_url: `data:image/jpeg;base64,${image3}` },
                        { type: "image_url", image_url: `data:image/jpeg;base64,${image4}` },
                        { type: "image_url", image_url: `data:image/jpeg;base64,${image5}` },
                        { type: "text", text: "Crea las mejores combinaciones para vestirme con la ropa de mi guardarropas. Dame la respuesta en un formato simple pero bonito para mostrar" },
                        { type: "text", text: body.message },
                    ],
                },
            ],
        });

        return new Response(JSON.stringify({ result: response.choices[0].message.content }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
