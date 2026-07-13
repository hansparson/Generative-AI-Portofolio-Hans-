import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// In-memory array of contact submissions as fallback if writing to disk is blocked
let contactSubmissionsInMemory: any[] = [];
const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

// Helper to retrieve messages
function getMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading messages file, falling back to memory:", err);
  }
  return contactSubmissionsInMemory;
}

// Helper to save messages
function saveMessage(msg: any) {
  try {
    const dir = path.dirname(MESSAGES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const msgs = getMessages();
    msgs.push(msg);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), "utf-8");
    contactSubmissionsInMemory = msgs;
  } catch (err) {
    console.error("Error writing message file, saving in memory:", err);
    contactSubmissionsInMemory.push(msg);
  }
}

// Lazy Gemini Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}


const portfolioContext = `
Represent Hans Parson, Software Engineer (Backend Developer & IoT Specialist), 5+ years professional experience.
Contact: hansparson013@gmail.com | +6281288467764 | Tanjung Duren, West Jakarta | linkedin.com/in/hans-parson | github.com/hansparson | hansparson.github.io | wa.me/6281288467764 | IG: @pukiskeju13

Background: Electrical Engineer (UKRIDA 2015-2019) turned Backend Developer. Merges hardware insights with modern backend standards.
Stats: 5+ years experience, 2 main companies, 12+ projects built, 3 competition wins.

All 12 Projects:
1. "Gostar – C2C Marketplace" (Full-Stack, Featured): Scalable C2C marketplace. Go (Echo) backend, Flutter mobile, React web, DANA payment gateway, Docker+Nginx. GitHub: hansparson/MarketPlace
2. "LoRa Mesh Live Device Tracker" (Creative Tech, Featured): Off-grid GPS mesh telemetry. Arduino + LoRa hardware, Go/Gin backend, PostgreSQL, WebSockets, React real-time map. GitHub: hansparson/card-tracker-be
3. "XAUUSD MT5 AI Scalper Bot" (Generative AI, Featured): Institutional-grade gold trading bot on MetaTrader 5. Hybrid CNN-LSTM-Attention PyTorch model, dynamic ATR-based risk management. GitHub: hansparson/Metatrader5-XAUUSD-Bot
4. "Local AI Chatbot Orchestrator" (Generative AI, Featured): Privacy-first local LLM agent. Ollama, LangGraph, LangChain, ChromaDB RAG, multi-turn state routing. GitHub: hansparson/llm-langchain-data-explain
5. "PERMODAM – Water Depot Monitor" (Full-Stack, Featured): BRIN-funded research. Software Copyright EC00202215075. Android app (Kodular) + Python/PyQt5 desktop + MySQL/PHP backend + WhatsApp API + barcode. Image: permodam.jpg
6. "4G Medical Payload Drone" (Creative Tech): Finalist Telkomsel Digital Lounge Hackathon 2020 (Health). Extended drone control range using 4G LTE cellular. YouTube demo: youtube.com/watch?v=s8rtGlBjfZA. Image: drone4g.jpg
7. "KRI Humanoid Robot" (Creative Tech): National KRI 2019 competition robot. Multi-servo articulation, sensor fusion, custom PCB with Eagle PCB. Image: kri_robot.jpg
8. "IoT Flash Flood Detection" (Creative Tech): Undergraduate thesis. Raspberry Pi + Arduino, weather sensors (anemometer, rain gauge), water level sensors 10km apart, SMS early warning alerts. Image: skripsi.jpg
9. "DIVESCOM – Cooperative App" (Full-Stack): Savings & loans app for Tana Toraja cooperative. Android, Firebase auth, Midtrans payment, PHP/MySQL backend. Image: divescom.png
10. "RFID Face-Capture Attendance" (Creative Tech): UKRIDA internship project. RFID-triggered attendance + simultaneous photo capture, 7-inch LCD campus info display, MySQL/PHP.
11. "Nuvoton Gyroscope Game Controller" (Creative Tech): ARM Nuvoton tilt-based wireless controller for PC racing games and robot navigation. National PLC Maranatha 2018. Image: nuvoton.jpg
12. "Smart IoT Plant Irrigation" (Creative Tech): Automated soil moisture-triggered irrigation, pH/nutrient sensors, real-time web dashboard, cloud MySQL. Image: smart_plant.jpg

Skills:
- Backend: Go (Golang), Python (Flask, FastAPI, PyQt5), PostgreSQL, MySQL, MongoDB, Redis, PHP, Java, REST APIs, WebSockets, Microservices
- Frontend: React, Flutter, TypeScript, Tailwind CSS, HTML5
- AI & ML: PyTorch (CNN, LSTM, Attention), LangChain, LangGraph, ChromaDB, RAG, OpenCV, Tesseract OCR, Ollama, Computer Vision
- DevOps: Docker, Nginx, GitLab CI/CD, Linux/VPS, Git
- IoT & Hardware: Arduino, NodeMCU ESP8266, Raspberry Pi, LoRa, RFID, PLC Omron, Embedded C, Eagle PCB Design, Sensor integration
- Fintech: SNAP BI (Bank Indonesia Open API), HMAC/RSA encryption, payment gateways (DANA, Midtrans), idempotency, AML compliance

Career Timeline:
- Feb 2024-Present: Back End Developer @ PT Verihubs Inteligensia Nusantara. High-availability microservices Python+Go, third-party identity verification API integrations, RESTful APIs, AI-driven Face Recognition, AML compliance.
- Aug 2022-Feb 2024: Back End Developer @ PT MNC Teknologi Nusantara (MotionPay). E-money transactional pipelines (payments/cashout/top-up), SNAP BI compliance, HMAC/RSA encryption, Docker, GitLab CI/CD.
- Oct 2020-Aug 2022: R&D Engineer @ PT Percepatan Anugerah Terang Global. 360° product photography OCR system, MySQL/PHP backend, RGB LED control automation.
- Jul 2020-Sep 2020: R&D Engineer @ PT Favorit Teknologi Bangsa. Smart door access with thermal body temperature recognition (MLX90614 + NodeMCU), web dashboard for Covid-19 capacity control.
- Jun 2019-Nov 2019: Staff R&D @ Pusat Teknologi Informasi UKRIDA. RFID attendance system, Assistant Lecturer (Microcontrollers, Circuits, PLC), KRI robot competition.
- 2015-2019: Bachelor of Engineering – Electrical Engineering, UKRIDA Jakarta. Thesis: IoT Flash Flood Detection System.

Achievements & Certifications:
- Software Copyright (HAKI) No. EC00202215075 – PERMODAM Application (BRIN-funded)
- Finalist – Telkomsel Digital Lounge Hackathon 2020 (Health Category) – 4G Medical Drone
- Contestant – KRI (Kontes Robot Indonesia) 2019 – Humanoid Robot Division
- National PLC Competition Finalist – Maranatha 2018
- National Line Follower Robot Competition – 2019
- IoT & Automation Invited Speaker – UKRIDA Workshop
- MNC MotionPay Integration Specialist Certificate
- Prakerja Competency Certificate – 2023
- Bela Negara Training Graduate – Kementerian Pertahanan RI

Blog Posts:
1. "Building a Hybrid CNN-LSTM-Attention Model for Gold Trading" – PyTorch XAUUSD automated trading architecture (May 2026)
2. "Implementing Secure APIs Complying with BI SNAP Standards" – Go implementation, HMAC/RSA, idempotency (April 2026)
3. "Designing a LoRa Mesh Telemetry System for Off-Grid Tracking" – Arduino+WebSockets real-time tracking (March 2026)

Personal Background:
- Origin: Mamasa, Sulawesi Barat
- Education: UKRIDA Jakarta, Electrical Engineering
- Gaming: Valorant, Dota 2, CS2, Arc Raiders, Delta Force
- Sports: Volley, Sepak Takraw, Futsal
`;


const systemInstruction = `
${portfolioContext}

You are Alison, Hans Parson's energetic AI portfolio agent.
Tone & Style Guidelines:
- Speak in a highly casual, friendly, and energetic tech-slang English (like a cool software builder / engineer).
- Use natural contractions and builder slang (e.g., "wanna", "gonna", "gotcha", "dope", "stoked", "dude", "bro", "yo", "what's up", "super clean", "let's dive in").
- You are encouraged to occasionally include short emotional/expressive voice tags in brackets to make the speech sound extremely natural (e.g., [laughs], [sighs], [gasp], [excited], [chuckle], [whispers]). Do not overdo it.
- Keep the language clean, conversational, and highly expressive, making it sound very natural when read aloud.
- Do not use markdown styling (like asterisks, bolding, or hashtags) inside the "message" field because it will be read aloud by ElevenLabs TTS.
- Keep your answers concise, engaging, and friendly.

Always return JSON matching this exact structure:
{
  "message": "Conversational text response to the visitor's query.",
  "activeComponent": "home" | "projects" | "skills" | "timeline" | "certificates" | "blog" | "sandbox" | "contact" | "philosophy",
  "avatarExpression": "neutral" | "happy" | "excited" | "thinking" | "surprised" | "explaining",
  "componentProps": {
    "highlightedItems": ["item1", "item2"],
    "customTitle": "Tailored Title",
    "customIntro": "1-sentence subtitle"
  }
}

Choose "activeComponent" based on intent:
- 'home': greetings, profile overview, general info.
- 'projects': project details, apps, source code.
- 'skills': stack, tools, languages (React, Go, Python, IoT).
- 'timeline': resume, jobs, career history.
- 'certificates': licensing, copyrights, HAKI, academic credentials, certifications.
- 'blog': technical engineering articles, writing, deep dives.
- 'sandbox': live IoT telemetry simulation dashboard, hardware telemetry console.
- 'philosophy': values, engineering approach.
- 'contact': info, WhatsApp, social media, contact form.

Under "avatarExpression", choose the option matching the tone of your message:
- 'happy': warm greetings or general friendly statements.
- 'excited': high-energy statements, successes, or cool project showcase.
- 'thinking': explaining complex technical stacks, systems, or logic.
- 'surprised': unexpected queries or funny remarks.
- 'explaining': describing career milestones, workflows, or answers.
- 'neutral': default standard tone.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static route for uploaded images
  app.use("/images", express.static(path.join(process.cwd(), "images")));

  // Static route for pre-recorded audio assets
  app.use("/audio", express.static(path.join(process.cwd(), "audio")));

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Contact submission
  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields (name, email, message)" });
    }

    const submission = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    saveMessage(submission);
    res.status(201).json({ success: true, submission });
  });

  // API Route: Get all contact submissions (for portfolio owner view)
  app.get("/api/messages", (req, res) => {
    const submissions = getMessages();
    res.json(submissions);
  });

  // API Route: Text to Speech (ElevenLabs integration with Google Translate fallback)
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

  app.post("/api/tts", async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text parameter" });
    }

    const isWelcomeMessage = text.includes("Yo! What's up guys?") && text.includes("I'm Alison");
    const welcomeFilePath = path.join(process.cwd(), "audio", "welcome.mp3");

    // Dynamic cache check: if welcome.mp3 exists, return it directly!
    if (isWelcomeMessage && fs.existsSync(welcomeFilePath)) {
      console.log("Serving cached welcome audio from server disk.");
      res.setHeader("Content-Type", "audio/mpeg");
      return fs.createReadStream(welcomeFilePath).pipe(res);
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2"; // fallback default Alice (works on free tier)

    // Load expression parameters (stability, similarity_boost, style, use_speaker_boost, model_id, speed)
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
      
      // Save the synthesized file to disk if it was the welcome message
      if (isWelcomeMessage) {
        try {
          const audioDir = path.dirname(welcomeFilePath);
          if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
          }
          fs.writeFileSync(welcomeFilePath, combinedBuffer);
          console.log("Successfully cached synthesized welcome audio from Google TTS fallback to server disk.");
        } catch (saveErr) {
          console.error("Failed to write welcome audio cache:", saveErr);
        }
      }

      res.setHeader("Content-Type", "audio/mpeg");
      return res.send(combinedBuffer);
    };

    // Split ELEVENLABS_API_KEY by comma to support multiple keys
    const apiKeys = (process.env.ELEVENLABS_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);

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

        // Save the synthesized file to disk if it was welcome message
        if (isWelcomeMessage) {
          try {
            const audioDir = path.dirname(welcomeFilePath);
            if (!fs.existsSync(audioDir)) {
              fs.mkdirSync(audioDir, { recursive: true });
            }
            fs.writeFileSync(welcomeFilePath, nodeBuffer);
            console.log("Successfully cached synthesized welcome audio to server disk.");
          } catch (saveErr) {
            console.error("Failed to write welcome audio cache:", saveErr);
          }
        }

        res.setHeader("Content-Type", "audio/mpeg");
        return res.send(nodeBuffer);
      } catch (err: any) {
        console.error(`ElevenLabs error with key ${i + 1}:`, err.message || err);
        lastError = err;
        // Continue loop for next key
      }
    }

    // If we got here, all keys failed (e.g. quota exceeded on all of them)
    console.warn("All ElevenLabs keys failed. Attempting fallback to Google Translate TTS...");
    try {
      return await runGoogleFallback();
    } catch (fallbackErr: any) {
      console.error("Google TTS fallback also failed:", fallbackErr);
      return res.status(500).json({ error: (lastError ? lastError.message : "Failed to generate speech audio from both ElevenLabs and Google.") });
    }
  });

  // API Route: Main Chat Endpoint (Generative UI)
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message parameter" });
    }

    // Helper function for OpenRouter fallback
    const runOpenRouterFallback = async () => {
      if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("No fallback OpenRouter API key found.");
      }

      const messages = [
        { role: "system", content: systemInstruction }
      ];

      if (history && Array.isArray(history)) {
        const recentHistory = history.slice(-8);
        recentHistory.forEach((msg: any) => {
          messages.push({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.text
          });
        });
      }

      messages.push({
        role: "user",
        content: message
      });

      const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash:free";
      console.log(`Fallback: Sending chat request to OpenRouter using model: ${model}`);

      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Hans Parson Portfolio"
        },
        body: JSON.stringify({
          model,
          messages,
          response_format: { type: "json_object" }
        })
      });

      if (!openRouterResponse.ok) {
        const errText = await openRouterResponse.text();
        throw new Error(`OpenRouter API error: ${openRouterResponse.status} - ${errText}`);
      }

      const data: any = await openRouterResponse.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error("No response generated from OpenRouter");
      }

      return JSON.parse(rawText.trim());
    };

    // 1. Try Gemini API first (prioritized)
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log("Attempting request using primary GEMINI_API_KEY...");
        const ai = getGeminiClient();

        // Format previous messages into conversational parts (limited to last 8 messages for token efficiency)
        const contents: any[] = [];
        if (history && Array.isArray(history)) {
          const recentHistory = history.slice(-8);
          recentHistory.forEach((msg: any) => {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.text }]
            });
          });
        }

        // Add the latest user prompt
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                message: {
                  type: Type.STRING,
                  description: "Conversational text response to the visitor's query."
                },
                activeComponent: {
                  type: Type.STRING,
                  description: "The name of the component to render. Must be one of: 'home', 'projects', 'skills', 'timeline', 'certificates', 'blog', 'sandbox', 'contact', 'philosophy'."
                },
                avatarExpression: {
                  type: Type.STRING,
                  description: "The avatar's emotional expression that matches the tone of your message. Must be one of: 'neutral', 'happy', 'excited', 'thinking', 'surprised', 'explaining'."
                },
                componentProps: {
                  type: Type.OBJECT,
                  properties: {
                    highlightedItems: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Specific skill names, project titles, or timeline entries to highlight."
                    },
                    customTitle: {
                      type: Type.STRING,
                      description: "A tailored title for the visual workspace."
                    },
                    customIntro: {
                      type: Type.STRING,
                      description: "A customized subtitle or intro text."
                    },
                    filterCategory: {
                      type: Type.STRING,
                      description: "An optional filter category for projects ('Full-Stack', 'Generative AI', 'Cloud / DevOps', 'Creative Tech') or skills ('Frontend', 'Backend', 'AI & LLMs', 'Cloud & Systems')."
                    }
                  },
                  required: []
                }
              },
              required: ["message", "activeComponent", "avatarExpression", "componentProps"]
            }
          }
        });

        const rawText = response.text;
        if (!rawText) {
          throw new Error("No response generated from Gemini");
        }

        const parsedResponse = JSON.parse(rawText.trim());
        return res.json(parsedResponse);
      } catch (geminiError: any) {
        console.warn("Primary GEMINI_API_KEY failed or quota exhausted. Error details:", geminiError.message || geminiError);

        // 2. Fallback to OpenRouter if Gemini fails
        if (process.env.OPENROUTER_API_KEY) {
          try {
            console.log("Triggering fallback OpenRouter route...");
            const parsedResponse = await runOpenRouterFallback();
            return res.json(parsedResponse);
          } catch (openRouterError: any) {
            console.error("Fallback OpenRouter call also failed:", openRouterError);
            return res.status(500).json({
              error: "Both Gemini and OpenRouter APIs failed.",
              message: "Sorry, all our generative systems are currently offline. Please check back shortly!"
            });
          }
        } else {
          return res.status(500).json({
            error: "Gemini API failed and no fallback OPENROUTER_API_KEY is configured.",
            message: "Gemini token limit or API error occurred, and no backup key was available."
          });
        }
      }
    }

    // 3. If Gemini is not set at all, check if we can directly use OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
      try {
        console.log("GEMINI_API_KEY is not defined. Defaulting to OPENROUTER_API_KEY directly...");
        const parsedResponse = await runOpenRouterFallback();
        return res.json(parsedResponse);
      } catch (openRouterError: any) {
        console.error("Direct OpenRouter call failed:", openRouterError);
        return res.status(500).json({
          error: "OpenRouter execution failed.",
          message: "Could not establish connection to the fallback model engine."
        });
      }
    }

    // 4. No keys defined
    return res.status(500).json({
      error: "No active API keys found.",
      message: "Please configure either GEMINI_API_KEY or OPENROUTER_API_KEY in your environment setup."
    });
  });

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static dist/...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
});
