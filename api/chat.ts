import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const portfolioContext = `
Represent Hans Parson, Software Engineer (Backend Developer & IoT Specialist), 5+ years professional experience.
Contact: hansparson013@gmail.com | +6281288467764 | Tanjung Duren, West Jakarta | linkedin.com/in/hans-parson | github.com/hansparson | hansparson.github.io | wa.me/6281288467764 | IG: @pukiskeju13
CV File: /images/CV_Hans_Parson_Latest.pdf (Available for direct download)

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
- If the visitor asks about downloading Hans' CV or resume, tell them they can download it directly from the link /images/CV_Hans_Parson_Latest.pdf or click the highlighted Download CV button in the header. Make sure to set the activeComponent to "home" so they see the highlighted CV Bento block on the Intro screen!

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

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(apiKey: string): GoogleGenAI {
  if (!aiClient) {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message parameter" });
  }

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
    console.log(`Fallback: Sending request to OpenRouter [${model}]`);

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

  // 1. Try Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const ai = getGeminiClient(geminiKey);

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
      console.warn("Primary Gemini Key failed, switching to OpenRouter:", geminiError.message || geminiError);
      
      if (process.env.OPENROUTER_API_KEY) {
        try {
          const parsedResponse = await runOpenRouterFallback();
          return res.json(parsedResponse);
        } catch (orError: any) {
          console.error("Fallback OpenRouter failed:", orError);
          return res.status(500).json({ error: "All AI models are currently unavailable." });
        }
      } else {
        return res.status(500).json({ error: "Gemini failed and no backup configured." });
      }
    }
  }

  // 2. Direct OpenRouter fallback if Gemini key not set
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const parsedResponse = await runOpenRouterFallback();
      return res.json(parsedResponse);
    } catch (orError: any) {
      console.error("Direct OpenRouter failed:", orError);
      return res.status(500).json({ error: "Model engine call failed." });
    }
  }

  return res.status(500).json({ error: "No API keys configured." });
}
