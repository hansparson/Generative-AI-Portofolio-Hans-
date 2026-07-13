import type { VercelRequest, VercelResponse } from '@vercel/node';

function detectLanguage(text: string): string {
  const indonesianWords = /\b(saya|kamu|kita|mereka|adalah|yang|dan|dengan|untuk|dalam|bisa|proyek|halo|apa|iya|dari|ini|itu|atau|suara|robot|portofolio|elevenlabs|kembali)\b/i;
  return indonesianWords.test(text) ? 'id' : 'en';
}

function splitTextIntoChunks(text: string, maxLength: number = 180): string[] {
  const chunks: string[] = [];
  let currentChunk = "";
  
  const sentences = text.match(/[^.!?]+[.!?]*|.+/g) || [text];
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      
      if (sentence.length > maxLength) {
        const words = sentence.split(/\s+/);
        let subChunk = "";
        for (const word of words) {
          if ((subChunk + " " + word).length <= maxLength) {
            subChunk += (subChunk ? " " : "") + word;
          } else {
            if (subChunk.trim()) {
              chunks.push(subChunk.trim());
            }
            subChunk = word;
          }
        }
        currentChunk = subChunk;
      } else {
        currentChunk = sentence;
      }
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

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

  const stability = parseFloat(process.env.ELEVENLABS_STABILITY || "0.35");
  const similarity_boost = parseFloat(process.env.ELEVENLABS_SIMILARITY_BOOST || "0.75");
  const style = parseFloat(process.env.ELEVENLABS_STYLE || "0.45");
  const use_speaker_boost = process.env.ELEVENLABS_SPEAKER_BOOST !== "false";
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
  const speed = parseFloat(process.env.ELEVENLABS_SPEED || "1.0");

  const runGoogleFallback = async () => {
    console.warn("ElevenLabs failed or quota exceeded. Attempting fallback to Google Translate TTS...");
    const chunks = splitTextIntoChunks(text, 180);
    const audioBuffers: Buffer[] = [];
    const lang = detectLanguage(text);

    for (const chunk of chunks) {
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;
      const googleResponse = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!googleResponse.ok) {
        throw new Error(`Google TTS fallback failed with status ${googleResponse.status} for chunk: "${chunk}"`);
      }

      const chunkArrayBuffer = await googleResponse.arrayBuffer();
      audioBuffers.push(Buffer.from(chunkArrayBuffer));
    }

    const combinedBuffer = Buffer.concat(audioBuffers);
    res.setHeader("Content-Type", "audio/mpeg");
    return res.send(combinedBuffer);
  };

  // Split ELEVENLABS_API_KEY by comma to support multiple keys
  const apiKeys = (process.env.ELEVENLABS_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);

  const runGoogleFallback = async () => {
    console.warn("ElevenLabs failed or quota exceeded. Attempting fallback to Google Translate TTS...");
    const chunks = splitTextIntoChunks(text, 180);
    const audioBuffers: Buffer[] = [];
    const lang = detectLanguage(text);

    for (const chunk of chunks) {
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;
      const googleResponse = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!googleResponse.ok) {
        throw new Error(`Google TTS fallback failed with status ${googleResponse.status} for chunk: "${chunk}"`);
      }

      const chunkArrayBuffer = await googleResponse.arrayBuffer();
      audioBuffers.push(Buffer.from(chunkArrayBuffer));
    }

    const combinedBuffer = Buffer.concat(audioBuffers);
    res.setHeader("Content-Type", "audio/mpeg");
    return res.send(combinedBuffer);
  };

  if (apiKeys.length === 0) {
    try {
      return await runGoogleFallback();
    } catch (fallbackErr: any) {
      console.error("Google TTS fallback failed (API Keys not configured):", fallbackErr);
      return res.status(500).json({ error: "Failed to generate speech audio from fallback Google TTS." });
    }
  }

  let lastError: any = null;
  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    console.log(`Attempting ElevenLabs synthesis with key ${i + 1}/${apiKeys.length}...`);
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": key,
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
        throw new Error(`ElevenLabs key ${i + 1} returned status ${response.status}: ${errorText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const nodeBuffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", "audio/mpeg");
      return res.send(nodeBuffer);
    } catch (err: any) {
      console.error(`ElevenLabs error with key ${i + 1}:`, err.message || err);
      lastError = err;
      // Continue loop for next key
    }
  }

  // All keys failed
  console.warn("All ElevenLabs keys failed. Attempting fallback to Google Translate TTS...");
  try {
    return await runGoogleFallback();
  } catch (fallbackErr: any) {
    console.error("Google TTS fallback also failed:", fallbackErr);
    return res.status(500).json({ error: (lastError ? lastError.message : "Failed to generate speech audio from both ElevenLabs and Google.") });
  }
}
