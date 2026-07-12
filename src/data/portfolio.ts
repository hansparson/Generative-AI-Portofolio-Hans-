import { Project, Skill, TimelineItem, EngineeringValue } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'gostar',
    title: 'Gostar – C2C Marketplace Platform',
    description: 'A scalable C2C marketplace with Go (Echo) backend, cross-platform Flutter mobile app, and React web. Integrated DANA payment gateway and deployed via Docker + Nginx reverse proxy.',
    tech: ['Go', 'Echo', 'React', 'Flutter', 'Docker', 'Nginx', 'DANA API', 'PostgreSQL', 'Redis', 'MinIO S3'],
    category: 'Full-Stack',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson/MarketPlace',
    impact: 'Architected high-performance payment routing via DANA API. Fully containerized infrastructure with Docker and optimized load balancing via Nginx reverse proxy. Supports React web admin dashboard + 2 Flutter mobile apps (reseller + customer).',
    featured: true,
    image: '/images/projects/gostar/website_01.png',
    screenshots: [
      '/images/projects/gostar/website_01.png',
      '/images/projects/gostar/website_02.png',
      '/images/projects/gostar/gostar_id_01.png',
      '/images/projects/gostar/gostar_id_02.png',
      '/images/projects/gostar/gostar_id_03.png',
      '/images/projects/gostar/gostar_id_04.png',
      '/images/projects/gostar/gostar_mart_01.png',
      '/images/projects/gostar/gostar_mart_02.png',
    ]
  },
  {
    id: 'lora-tracker',
    title: 'LoRa Mesh Live Device Tracker',
    description: 'End-to-end off-grid telemetry and tracking system. Hardware nodes (Arduino + LoRa) transmit GPS data over a mesh topology without internet. A Go backend pushes real-time coordinates to a React dashboard via WebSockets.',
    tech: ['Arduino', 'Go', 'Gin', 'GORM', 'PostgreSQL', 'WebSockets', 'LoRa'],
    category: 'Creative Tech',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson/card-tracker-be',
    impact: 'Designed peer-to-peer sensory data packet relay mesh topology. Built a real-time React tracking map fed by full-duplex WebSockets without internet dependency.',
    featured: true,
    image: undefined
  },
  {
    id: 'xauusd-bot',
    title: 'XAUUSD MT5 AI Scalper Bot',
    description: 'Institutional-grade automated trading robot for XAUUSD (Gold) on MetaTrader 5. Implements a hybrid CNN-LSTM-Attention neural network in PyTorch with custom feature engineering and dynamic risk management.',
    tech: ['Python', 'PyTorch', 'MetaTrader 5', 'pandas', 'ta'],
    category: 'Generative AI',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson/Metatrader5-XAUUSD-Bot',
    impact: 'Hybrid CNN-LSTM-Attention architecture achieved lower drawdowns vs standard LSTM models. ATR-based dynamic exits improved position discipline significantly.',
    featured: true,
    image: undefined
  },
  {
    id: 'ai-chatbot',
    title: 'Local AI Chatbot Orchestrator',
    description: 'A privacy-first local conversational agent. Deploys LLMs via Ollama, uses LangGraph for multi-turn state graph routing, and ChromaDB for offline document RAG processing.',
    tech: ['Ollama', 'LangGraph', 'LangChain', 'Python', 'ChromaDB'],
    category: 'Generative AI',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson/llm-langchain-data-explain',
    impact: 'Fully offline, privacy-first LLM pipeline. RAG document processing with ChromaDB enables accurate responses from private datasets without cloud dependency.',
    featured: true,
    image: undefined
  },
  {
    id: 'permodam',
    title: 'PERMODAM – Drinking Water Depot Monitor',
    description: 'BRIN-funded research project (Software Copyright No. EC00202215075). A complete monitoring ecosystem for drinking water depots: an Android app (Kodular) with WhatsApp/email reminders for labs, and a Python/PyQt5 desktop management dashboard with MySQL + PHP backend and barcode generation.',
    tech: ['Python', 'PyQt5', 'Kodular', 'MySQL', 'PHP', 'WhatsApp API', 'Barcode'],
    category: 'Full-Stack',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson',
    impact: 'BRIN-funded. Official Software Copyright registered (EC00202215075). Full ecosystem: Android app + desktop dashboard + cloud backend + WhatsApp reminders.',
    featured: true,
    image: '/images/projects/permodam.jpg'
  },
  {
    id: 'drone-4g',
    title: '4G-Controlled Medical Payload Drone',
    description: 'Finalist project at Telkomsel Digital Lounge Hackathon 2020 (Health Category). Extended standard drone telemetry range to unlimited distance by routing drone control over a 4G LTE cellular network, enabling payload delivery of medical supplies to remote areas.',
    tech: ['4G LTE', 'Telemetry', 'Drone', 'Embedded Systems', 'Networking'],
    category: 'Creative Tech',
    demoUrl: 'https://www.youtube.com/watch?v=s8rtGlBjfZA',
    githubUrl: 'https://github.com/hansparson',
    impact: 'Finalist – Telkomsel Digital Lounge Hackathon 2020 (Health Category). Extended drone control range to unlimited distance using 4G LTE cellular network routing.',
    featured: false,
    image: '/images/projects/drone4g.jpg'
  },
  {
    id: 'kri-robot',
    title: 'KRI Humanoid Robot – National Competition',
    description: 'Designed and built a humanoid robot for the Kontes Robot Indonesia (KRI) 2019 national competition. The robot featured multi-servo articulation, sensor fusion for balance, and custom PCB design using Eagle PCB.',
    tech: ['Embedded C', 'Arduino', 'Servo Motors', 'Sensor Fusion', 'PCB Design'],
    category: 'Creative Tech',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson',
    impact: 'Competed at national level KRI 2019. Custom PCB design, multi-servo articulation, and sensor fusion for dynamic balance control.',
    featured: false,
    image: '/images/projects/kri_robot.jpg'
  },
  {
    id: 'flood-iot',
    title: 'IoT Flash Flood & Weather Detection System',
    description: 'Undergraduate thesis project: an IoT-based flash flood and weather detection system. A Raspberry Pi server aggregates data from weather sensors (anemometer, rain gauge, temperature) and water level sensors 10 km apart. Alerts are sent via SMS to trigger an alarm system before flooding occurs.',
    tech: ['Raspberry Pi', 'Arduino', 'SMS', 'Weather Sensors', 'MySQL', 'Eagle PCB'],
    category: 'Creative Tech',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson',
    impact: 'Undergraduate thesis project. Multi-sensor network spanning 10km. SMS-triggered early warning system for flash flood prevention.',
    featured: false,
    image: '/images/projects/skripsi.jpg'
  },
  {
    id: 'divescom',
    title: 'DIVESCOM – Cooperative Savings & Loans App',
    description: 'Full-featured digital cooperative app for a savings & loan institution in Tana Toraja, South Sulawesi. Features user authentication (Firebase), savings & loan transaction management, and integrated Midtrans payment gateway for online repayment.',
    tech: ['Android', 'Firebase', 'Midtrans', 'PHP', 'MySQL', 'Hosting'],
    category: 'Full-Stack',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson',
    impact: 'Full-featured cooperative management app for Tana Toraja institution. Firebase auth, Midtrans payment integration, complete loan & savings lifecycle management.',
    featured: false,
    image: '/images/projects/divescom.png'
  },
  {
    id: 'rfid-access',
    title: 'RFID Face-Capture Student Attendance System',
    description: 'Built during internship at UKRIDA. An RFID-triggered door access and attendance system that simultaneously captures a photo of the student and stores it in the campus database. Features a 7-inch LCD for real-time campus info display.',
    tech: ['Raspberry Pi', 'RFID', 'MySQL', 'PHP', 'Camera Module', 'LCD 7"'],
    category: 'Creative Tech',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson',
    impact: 'Automated campus attendance with biometric photo capture on RFID tap. Integrated with MySQL student database and live campus information display.',
    featured: false,
    image: undefined
  },
  {
    id: 'nuvoton-gyro',
    title: 'Gyroscope Game Controller (ARM Nuvoton)',
    description: 'A tilt-based wireless game controller built on an ARM Nuvoton microcontroller. Uses a gyroscope for motion-to-control mapping, enabling PC racing game control and wireless robot car navigation. Featured in PLC Maranatha 2018 competition.',
    tech: ['ARM Nuvoton', 'Gyroscope', 'Embedded C', 'Wireless', 'PCB Design'],
    category: 'Creative Tech',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson',
    impact: 'Motion-based wireless controller for PC games and robot navigation. Featured at national PLC Maranatha 2018 competition.',
    featured: false,
    image: '/images/projects/nuvoton.jpg'
  },
  {
    id: 'smart-plant',
    title: 'Smart Automatic IoT Plant Irrigation',
    description: 'An IoT-connected automated plant irrigation system using soil moisture sensors to trigger watering. Monitors soil humidity, pH levels, and nutrients in real-time via a web dashboard connected to a cloud database.',
    tech: ['NodeMCU', 'Soil Sensor', 'pH Sensor', 'IoT', 'PHP', 'MySQL', 'Dashboard'],
    category: 'Creative Tech',
    demoUrl: '#',
    githubUrl: 'https://github.com/hansparson',
    impact: 'Fully automated irrigation triggered by soil moisture data. Real-time pH & nutrient monitoring dashboard with cloud database integration.',
    featured: false,
    image: '/images/projects/smart_plant.jpg'
  }
];

export const INITIAL_SKILLS: Skill[] = [
  // Backend & DB
  { name: 'Golang', level: 80, category: 'Backend', yearsOfExp: 5 },
  { name: 'Python (Flask, FastAPI, PyQt5)', level: 78, category: 'Backend', yearsOfExp: 5 },
  { name: 'PostgreSQL', level: 75, category: 'Backend', yearsOfExp: 5 },
  { name: 'MySQL', level: 76, category: 'Backend', yearsOfExp: 5 },
  { name: 'MongoDB', level: 70, category: 'Backend', yearsOfExp: 4 },
  { name: 'Redis', level: 72, category: 'Backend', yearsOfExp: 4 },
  { name: 'PHP', level: 65, category: 'Backend', yearsOfExp: 3 },
  { name: 'Java', level: 62, category: 'Backend', yearsOfExp: 2 },

  // Frontend
  { name: 'React', level: 75, category: 'Frontend', yearsOfExp: 4 },
  { name: 'Flutter', level: 78, category: 'Frontend', yearsOfExp: 4 },
  { name: 'TypeScript', level: 72, category: 'Frontend', yearsOfExp: 3 },
  { name: 'Tailwind CSS', level: 74, category: 'Frontend', yearsOfExp: 4 },

  // AI & LLMs
  { name: 'PyTorch & Deep Learning', level: 70, category: 'AI & LLMs', yearsOfExp: 3 },
  { name: 'LangChain & LangGraph', level: 68, category: 'AI & LLMs', yearsOfExp: 2 },
  { name: 'RAG & ChromaDB', level: 67, category: 'AI & LLMs', yearsOfExp: 2 },
  { name: 'OpenCV & Computer Vision', level: 69, category: 'AI & LLMs', yearsOfExp: 3 },
  { name: 'LLM Prompt Engineering', level: 75, category: 'AI & LLMs', yearsOfExp: 3 },

  // Cloud & Systems
  { name: 'Docker & Containerization', level: 76, category: 'Cloud & Systems', yearsOfExp: 4 },
  { name: 'Nginx & Reverse Proxy', level: 72, category: 'Cloud & Systems', yearsOfExp: 4 },
  { name: 'IoT & Embedded Systems', level: 78, category: 'Cloud & Systems', yearsOfExp: 5 },
  { name: 'Arduino & NodeMCU', level: 79, category: 'Cloud & Systems', yearsOfExp: 5 },
  { name: 'LoRa & Wireless Protocols', level: 70, category: 'Cloud & Systems', yearsOfExp: 3 },
  { name: 'Linux Ubuntu / VPS', level: 73, category: 'Cloud & Systems', yearsOfExp: 4 },
  { name: 'GitLab CI/CD', level: 68, category: 'Cloud & Systems', yearsOfExp: 3 },
  { name: 'SNAP BI & HMAC/RSA', level: 74, category: 'Cloud & Systems', yearsOfExp: 2 }
];

export const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: 'time_1',
    year: 'Feb 2024 - Present',
    role: 'Back End Developer',
    company: 'PT Verihubs Inteligensia Nusantara',
    description: 'Architecting and maintaining high-availability backend microservices utilizing Python and Golang.',
    achievements: [
      'Leading third-party API integrations for identity and automatic document verification databases.',
      'Optimizing RESTful APIs, securing databases, and compiling AI-driven Face Recognition modules.',
      'Developing secure API endpoints for AML compliance checks and automated data verification pipelines.'
    ],
    image: '/images/journey/verihubs.jpg'
  },
  {
    id: 'time_2',
    year: 'Aug 2022 - Feb 2024',
    role: 'Back End Developer',
    company: 'PT MNC Teknologi Nusantara (MotionPay)',
    description: 'Developed core e-money transactional pipelines (payments, cashout, top-ups) using Python and Go.',
    achievements: [
      'Implemented Bank Indonesia Open API standards (SNAP compliance) using secure HMAC/RSA encryption.',
      'Managed containerized databases via Docker and maintained deployments within GitLab CI/CD cycles.',
      'Integrated comprehensive merchant systems and engineered secure, compliant payment APIs.'
    ],
    image: '/images/journey/MNC.jpeg'
  },
  {
    id: 'time_3',
    year: 'Oct 2020 - Aug 2022',
    role: 'Research & Development Engineer',
    company: 'PT Percepatan Anugerah Terang Global',
    description: 'Designed a 360° product photography tool device integrated with an OCR system for automatic product data extraction from photos.',
    achievements: [
      'Stored and managed extracted product data using MySQL and PHP backend.',
      'Built RGB LED control systems for photography visualization and lighting automation.',
      'Tools: Python, OpenCV, Tesseract OCR, PHP, MySQL, Arduino, RGB LED strip control.'
    ]
  },
  {
    id: 'time_4',
    year: 'Jul 2020 - Sep 2020',
    role: 'Research & Development Engineer',
    company: 'PT Favorit Teknologi Bangsa',
    description: 'Designed a smart door access device with an integrated body temperature recognition system, monitored remotely via a web dashboard — deployed for Covid-19 indoor capacity control.',
    achievements: [
      'Built a real-time visitor database tracking temperature readings and room entry logs.',
      'Tools: MLX90614 IR temperature sensor, NodeMCU ESP8266, PHP, MySQL, HTML/CSS web monitoring dashboard.'
    ]
  },
  {
    id: 'time_5',
    year: 'Jun 2019 - Nov 2019',
    role: 'Staff Research & Development',
    company: 'Pusat Teknologi Informasi UKRIDA',
    description: 'Designed an RFID-based door access and student attendance system integrated with a MySQL student card database.',
    achievements: [
      'Served as Assistant Lecturer for Microcontroller, Electrical Circuits, and PLC programming courses.',
      'Built competitive robots for national contests: Industrial Robot, KRI Humanoid, and Weather Station systems.',
      'Tools: RFID RC522, Arduino, PLC Omron, Embedded C, MySQL, PHP, SolidWorks.'
    ]
  },
  {
    id: 'time_6',
    year: '2015 - 2019',
    role: 'Bachelor of Engineering – Electrical Engineering',
    company: 'Universitas Kristen Krida Wacana (UKRIDA)',
    description: 'Graduated November 2019. Electrical Engineer turned Backend Developer — merging hardware insights with modern backend standards.',
    achievements: [
      'Undergraduate Thesis: IoT Flash Flood & Weather Detection System (multi-sensor, 10km range, SMS alerts).',
      'Contestant – KRI (Kontes Robot Indonesia) 2019 – Humanoid Robot Division.',
      'Finalist – Telkomsel Digital Lounge Hackathon 2020 (4G-Controlled Medical Payload Drone).',
      'Software Copyright (HAKI) registered: PERMODAM Application – No. EC00202215075.'
    ]
  }
];

export const INITIAL_VALUES: EngineeringValue[] = [
  {
    id: 'val_1',
    title: 'SNAP & Financial Integration',
    value: 'Compliant payment architectures',
    iconName: 'Shield',
    description: 'Building secure, robust financial and banking data pipelines adhering to Bank Indonesia SNAP standards — preserving consumer trust and transaction integrity through HMAC/RSA encryption and idempotency controls.'
  },
  {
    id: 'val_2',
    title: 'AI & Machine Learning',
    value: 'Leveraging modern LLM & ML capabilities',
    iconName: 'Sparkles',
    description: 'From PyTorch hybrid CNN-LSTM models for algorithmic trading, to LangChain/LangGraph RAG pipelines, to OpenCV computer vision systems — building intelligent applications that solve real-world problems.'
  },
  {
    id: 'val_3',
    title: 'IoT & Telemetry Engineering',
    value: 'Bridging physical & digital worlds',
    iconName: 'Cpu',
    description: 'From Arduino relays and LoRa mesh transceivers to high-availability RESTful servers, building responsive end-to-end telemetry pipelines that create tangible value in off-grid, industrial, and healthcare environments.'
  }
];

export const SUGGESTED_PROMPTS: string[] = [
  'Show me your Golang & Python projects',
  'What is your experience at PT Verihubs?',
  'Tell me about the LoRa device tracker project',
  'What AI & ML projects have you built?',
  'How can I get in touch with you?'
];
