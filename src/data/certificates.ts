export interface Certificate {
  id: string;
  title: string;
  category: 'academic' | 'work' | 'professional' | 'competition' | 'achievement';
  issuer: string;
  date: string;
  file: string;
  type: 'pdf' | 'image';
  description: string;
}

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "permodam-haki",
    title: "PERMODAM Software Copyright (HAKI)",
    category: "academic",
    issuer: "Kementerian Hukum dan HAM RI / BRIN",
    date: "2022",
    file: "/images/certificates/sertifikat_EC00202215075.pdf",
    type: "pdf",
    description: "Official Software Copyright registration (No. EC00202215075) for the drinking water depot monitoring ecosystem project."
  },
  {
    id: "dilo-hackathon",
    title: "Telkomsel DILO Hackathon Finalist",
    category: "competition",
    issuer: "Telkomsel Digital Lounge",
    date: "2020",
    file: "/images/certificates/Dilo Hackaton Vestifal 2020.pdf",
    type: "pdf",
    description: "Finalist certification in the Telkomsel Digital Lounge Hackathon (Health Category) for the 4G Medical Payload Drone Project."
  },
  {
    id: "prakerja-cert",
    title: "Prakerja National Competency Certificate",
    category: "professional",
    issuer: "Kartu Prakerja Program",
    date: "2023",
    file: "/images/certificates/Prakerja.pdf",
    type: "pdf",
    description: "Competency completion certification under the national Kartu Prakerja skills development program."
  },
  {
    id: "plc-competition",
    title: "National PLC Competition Finalist",
    category: "competition",
    issuer: "Maranatha / National Level",
    date: "2018",
    file: "/images/certificates/Nasional PLC Competition.jpg",
    type: "image",
    description: "National Programmable Logic Controller (PLC) competition recognition demonstrating industrial automation capability."
  },
  {
    id: "line-follower",
    title: "National Line Follower Robot Contest",
    category: "competition",
    issuer: "Robot Contest Committee",
    date: "2019",
    file: "/images/certificates/Nasional line Follower.jpg",
    type: "image",
    description: "Award for engineering and racing an automated line-following robotic system in a national competition."
  },
  {
    id: "mini-industry-robot",
    title: "Robot Mini Industri Championship",
    category: "competition",
    issuer: "Industrial Robotics Challenge",
    date: "2019",
    file: "/images/certificates/Robot Mini Industri .jpg",
    type: "image",
    description: "Recognition for design and implementation of miniature industrial robotic manipulators."
  },
  {
    id: "narasumber-pelatihan",
    title: "IoT & Automation Invited Speaker",
    category: "achievement",
    issuer: "UKRIDA / Academic Workshop",
    date: "2021",
    file: "/images/certificates/Narasumber Pelatihan.jpg",
    type: "image",
    description: "Speaker/Trainer certification for leading workshops on microcontroller design and electrical circuits."
  },
  {
    id: "resque-robot",
    title: "Rescue Robot Competition Participant",
    category: "competition",
    issuer: "Robot Competition Committee",
    date: "2019",
    file: "/images/certificates/Resque Robot Competition.png",
    type: "image",
    description: "Certificate of participation for designing search and rescue robot navigation systems."
  },
  {
    id: "bela-negara",
    title: "Bela Negara Character Training Graduate",
    category: "achievement",
    issuer: "Kementerian Pertahanan RI / UKRIDA",
    date: "2019",
    file: "/images/certificates/Bela Negara.jpg",
    type: "image",
    description: "National defense training and character building completion graduate from UKRIDA and Ministry of Defense."
  }
];
