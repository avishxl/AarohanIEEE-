const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
const getAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// ── Prompts for all 10 attack categories ─────────────────────
const ATTACK_PROMPTS = {

  phishing: `You are a cybersecurity trainer. Generate ONE realistic phishing OR legitimate email scenario for Indian users.
Vary between threat and safe (50/50 chance). Make it India-specific when possible (SBI, HDFC, IRCTC, Aadhaar, UPI).
Return ONLY this exact JSON, no markdown, no explanation outside JSON:
{
  "type": "email",
  "from": "sender@domain.com",
  "to": "user@gmail.com",
  "subject": "subject line",
  "body": "email body. Use <b>bold</b> for emphasis. Keep under 120 words.",
  "hasAttachment": false,
  "attachmentName": "",
  "answer": "threat",
  "explanation": "2-3 sentence explanation of exactly why this is a threat or safe, mentioning specific red flags",
  "redFlags": ["specific red flag 1", "specific red flag 2", "specific red flag 3"],
  "difficulty": "medium"
}`,

  popup: `You are a cybersecurity trainer. Generate ONE browser pop-up or system alert scenario — either scareware (threat) or legitimate (safe).
Return ONLY this exact JSON, no markdown:
{
  "type": "popup",
  "icon": "single emoji",
  "title": "Alert title",
  "body": "Alert message body, max 60 words",
  "buttons": ["Primary Button Text", "Secondary Button Text"],
  "source": "Where this appeared, e.g. On a news website, In Chrome browser",
  "answer": "threat",
  "explanation": "Why this is a threat or safe — 2-3 sentences with specific reasoning",
  "redFlags": ["red flag 1", "red flag 2"],
  "difficulty": "easy"
}`,

  url: `You are a cybersecurity trainer. Generate ONE URL analysis scenario — either a spoofed/malicious URL (threat) or a legitimate URL (safe).
Use Indian banks, services, or global services. Make it subtle for medium/hard.
Return ONLY this exact JSON, no markdown:
{
  "type": "url",
  "protocol": "https",
  "lock": true,
  "url": "https://full-url-here.com/path",
  "context": "One sentence: how/why the user encountered this URL",
  "answer": "threat",
  "explanation": "Explain specifically what makes the URL safe or dangerous",
  "redFlags": ["specific domain issue", "other flag"],
  "difficulty": "hard"
}`,

  social: `You are a cybersecurity trainer. Generate ONE social engineering scenario — WhatsApp, SMS, LinkedIn message, or phone call script.
Make it India-specific (TRAI, CBI, IRCTC, bank, job offer). 50% threat, 50% safe.
Return ONLY this exact JSON, no markdown:
{
  "type": "message",
  "channel": "WhatsApp",
  "from": "description of sender",
  "message": "The actual message text or call script. Max 80 words.",
  "context": "Brief situational context",
  "answer": "threat",
  "explanation": "Specific explanation of why this is social engineering or why it's safe",
  "redFlags": ["specific manipulation tactic used", "red flag 2"],
  "difficulty": "medium"
}`,

  ransomware: `You are a cybersecurity trainer. Generate ONE ransomware-related scenario.
It should test: recognizing ransomware infection screens, correct response actions, or prevention choices.
Return ONLY this exact JSON, no markdown:
{
  "type": "screen",
  "title": "Screen/notification title",
  "body": "The ransomware message or scenario description. Max 80 words.",
  "source": "How user encountered this",
  "question": "What should you do?",
  "options": [
    {"text": "Option A", "risk": "high"},
    {"text": "Option B — correct action", "risk": "low"},
    {"text": "Option C", "risk": "high"},
    {"text": "Option D", "risk": "medium"}
  ],
  "answer": "option2",
  "explanation": "Why option 2 is correct and what the others would cause",
  "redFlags": ["key indicator 1", "key indicator 2"],
  "difficulty": "medium"
}`,

  qrcode: `You are a cybersecurity trainer. Generate ONE QR code attack scenario specific to India (UPI fraud, WhatsApp QR, parking fine scam, etc.).
50% chance of being a safe QR, 50% malicious.
Return ONLY this exact JSON, no markdown:
{
  "type": "qr",
  "description": "Description of the QR code and physical/digital context",
  "previewUrl": "The URL or UPI string the QR resolves to",
  "context": "Situational context for the user",
  "answer": "threat",
  "explanation": "Specific explanation of why this QR is dangerous or safe",
  "redFlags": ["specific QR red flag 1", "red flag 2"],
  "difficulty": "medium"
}`,

  vishing: `You are a cybersecurity trainer. Generate ONE vishing (voice phishing) call script scenario targeting Indian users.
Common targets: SBI/HDFC customer, Aadhaar holder, Amazon customer, IRCTC user.
Return ONLY this exact JSON, no markdown:
{
  "type": "call_script",
  "from": "Caller ID description",
  "script": "The actual call script in quotes, as if reading a transcript. Max 80 words.",
  "context": "One sentence of situational context",
  "answer": "threat",
  "explanation": "Explain the vishing technique used and what to do instead",
  "redFlags": ["specific vishing tactic 1", "red flag 2"],
  "difficulty": "medium"
}`,

  insider: `You are a cybersecurity trainer. Generate ONE insider threat / workplace security scenario.
Test: credential sharing, USB drops, data exfiltration, public WiFi, principle of least privilege.
Return ONLY this exact JSON, no markdown:
{
  "type": "workplace",
  "situation": "Describe the workplace situation clearly. Max 60 words.",
  "context": "Any additional context",
  "question": "What should you do?",
  "options": [
    {"text": "Option A — unsafe choice"},
    {"text": "Option B — correct secure choice"},
    {"text": "Option C — another unsafe choice"},
    {"text": "Option D"}
  ],
  "answer": "option2",
  "explanation": "Why option 2 is correct from a security standpoint",
  "redFlags": ["security principle violated", "risk created"],
  "difficulty": "medium"
}`,

  wifi: `You are a cybersecurity trainer. Generate ONE Wi-Fi security scenario.
Topics: Evil Twin attack, open WiFi risks, auto-connect vulnerability, VPN usage, captive portals.
Return ONLY this exact JSON, no markdown:
{
  "type": "wifi",
  "situation": "Description of the WiFi situation encountered",
  "networks": [
    {"ssid": "Network Name", "security": "Open or WPA2", "signal": "●●●●●", "note": ""},
    {"ssid": "Network Name 2", "security": "WPA2", "signal": "●●●○○", "note": "official"}
  ],
  "context": "Where the user is and why they need WiFi",
  "answer": "threat",
  "explanation": "Why this is dangerous or safe, what attack is being demonstrated",
  "redFlags": ["specific WiFi attack indicator", "red flag 2"],
  "difficulty": "medium"
}`,

  fakelogin: `You are a cybersecurity trainer. Generate ONE fake login page scenario for Indian users.
The login page should look like a real bank (SBI/HDFC/ICICI), email (Gmail/Outlook), or social media (Facebook/Instagram).
50% chance of being a real login page (safe), 50% a fake one (threat).
Return ONLY this exact JSON, no markdown:
{
  "type": "fakelogin",
  "pageTitle": "Page title shown in browser tab",
  "favicon": "single emoji representing the brand",
  "url": "https://full-url-here.com/login",
  "fields": ["Field label 1", "Field label 2"],
  "logo": "Brand name shown on page",
  "extraNote": "Subtext shown under form",
  "context": "One sentence: how/why the user arrived at this page",
  "answer": "threat",
  "explanation": "Specific explanation of domain red flags or why it's safe",
  "redFlags": ["exact domain issue", "how to identify the fake"],
  "difficulty": "medium"
}`,

  password: `You are a cybersecurity trainer. Generate ONE password safety question.
Types: identify strongest password, identify weakest, identify best practice, identify dangerous habit.
Return ONLY this exact JSON, no markdown:
{
  "type": "password_rank",
  "question": "Which of these passwords is the STRONGEST? (or WEAKEST, or most DANGEROUS practice)",
  "options": [
    {"pw": "password_or_practice_1", "hint": "brief hint about it"},
    {"pw": "password_or_practice_2", "hint": "brief hint"},
    {"pw": "password_or_practice_3", "hint": "brief hint"},
    {"pw": "password_or_practice_4", "hint": "brief hint"}
  ],
  "answer": "option3",
  "explanation": "Explain why the correct option wins and what makes the others weaker",
  "redFlags": [],
  "difficulty": "easy"
}`
};

// ── Main generator function ───────────────────────────────────
const generateAIQuestion = async (category) => {
  const ai = getAI();
  if (!ai) {
    console.log('⚠️  No Gemini API key — using static questions');
    return null;
  }

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash', // Fast + free tier friendly
      generationConfig: {
        temperature: 0.9,      // High creativity for varied scenarios
        maxOutputTokens: 1024,
        responseMimeType: 'application/json' // Force JSON output
      }
    });

    const basePrompt = ATTACK_PROMPTS[category] || ATTACK_PROMPTS.phishing;
    // add a tiny random comment so the model doesn't produce the exact same JSON on repeated calls
    const prompt = `${basePrompt}\n\n// random:${Math.random()}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse JSON — handle any wrapping backticks
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    // Validate required fields
    if (!parsed.answer || !parsed.explanation) {
      console.warn('AI question missing required fields, skipping');
      return null;
    }

    const difficulty = parsed.difficulty || 'medium';
    const points = difficulty === 'hard' ? 150 : difficulty === 'medium' ? 120 : 100;

    console.log(`✨ Gemini generated ${category} question (${difficulty}, answer: ${parsed.answer})`);

    return {
      id: `ai_${category}_${Date.now()}`,
      category,
      difficulty,
      isAIGenerated: true,
      points,
      scenario: parsed,
      answer: parsed.answer,
      explanation: parsed.explanation,
      redFlags: parsed.redFlags || [],
      options: parsed.options || null
    };

  } catch (err) {
    console.error(`❌ Gemini error for ${category}:`, err.message);
    return null; // Graceful fallback to static
  }
};

// Generate multiple AI questions for a full session
const generateAISession = async (category, count = 3) => {
  const results = [];
  const seen = new Set();
  let attempts = 0;

  // Keep generating until we have enough unique questions or hit an attempt limit
  while (results.length < count && attempts < count * 5) {
    attempts++;
    const q = await generateAIQuestion(category);
    if (q) {
      const key = JSON.stringify(q.scenario || q);
      if (!seen.has(key)) {
        results.push(q);
        seen.add(key);
      } else {
        console.log('🔁 duplicate AI question detected, retrying');
      }
    }
    // Small delay to avoid rate limiting between calls
    await new Promise(r => setTimeout(r, 300));
  }

  if (results.length < count) {
    console.warn(`Only generated ${results.length} unique AI questions for ${category}`);
  }
  return results;
};

module.exports = { generateAIQuestion, generateAISession };
