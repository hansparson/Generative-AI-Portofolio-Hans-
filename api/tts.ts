import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2";

  if (!apiKey) {
    return res.status(400).json({ error: "ElevenLabs API Key is not configured." });
  }

  const stability = parseFloat(process.env.ELEVENLABS_STABILITY || "0.35");
  const similarity_boost = parseFloat(process.env.ELEVENLABS_SIMILARITY_BOOST || "0.75");
  const style = parseFloat(process.env.ELEVENLABS_STYLE || "0.45");
  const use_speaker_boost = process.env.ELEVENLABS_SPEAKER_BOOST !== "false";
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
  const speed = parseFloat(process.env.ELEVENLABS_SPEED || "1.0");

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "content-type": "application/json",
        "accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost,
          style,
          use_speaker_boost,
          speed,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs returned status ${response.status}: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const nodeBuffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    return res.send(nodeBuffer);
  } catch (err: any) {
    console.error("ElevenLabs serverless TTS error:", err);
    return res.status(500).json({ error: err.message || "Failed to generate speech audio." });
  }
}
