import axios from 'axios';
import config from '../config.cjs';
import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;

// Groq API configuration
const GROQ_API_KEY = 'gifted';
const GROQ_API_URL = 'https:                                         

                              
let CHATBOT_ENABLED = true;
const messageCache = new Map();

                              
cmd({
  pattern: "chatbot",
  desc: "Toggle auto-response chatbot",
  category: "owner",
  filename: __filename
}, async (m, Matrix) => {
  const buttons = [
    {
      buttonId: '//api.giftedtech.co.ke/api/ai/groq-beta';

// Chatbot state (default: ON)
let CHATBOT_ENABLED = true;
const messageCache = new Map();

// Toggle Command with Buttons
cmd({
  pattern: "chatbot",
  desc: "Toggle auto-response chatbot",
  category: "owner",
  filename: __filename
}, async (m, Matrix) => {
  const buttons = [
    {
      buttonId: 'enable_chatbot',
      buttonText: { displayText: "✅ Turn ON" },
      type: 1
    },
    {
      buttonId: 'disable_chatbot',
      buttonText: { displayText: "❌ Turn OFF" },
      type: 1
    }
  ];
  await Matrix.sendMessage(m.from, {
    text: `🤖 *Chatbot Status:* ${CHATBOT_ENABLED ? "🟢 ACTIVE" : "🔴 DISABLED"}`,
    buttons,
    footer: "Powered by Groq AI"
  }, { quoted: m });
});

                        
export async function handleChatbotButton(m, Matrix) {
  if (m.message?.buttonsResponseMessage?.selectedButtonId === '// Handle Button Presses
export async function handleChatbotButton(m, Matrix) {
  if (m.message?.buttonsResponseMessage?.selectedButtonId === 'enable_chatbot') {
    CHATBOT_ENABLED = true;
    await m.reply("🔊 *Chatbot is now ACTIVE*");
  } else if (m.message?.buttonsResponseMessage?.selectedButtonId === 'disable_chatbot') {
    CHATBOT_ENABLED = false;
    await m.reply("🔇 *Chatbot is now DISABLED*");
  }
}

                       
const chatbotHandler = async (m, Matrix) => {
  if (!CHATBOT_ENABLED || m.key.remoteJid.endsWith('// Main Chatbot Handler
const chatbotHandler = async (m, Matrix) => {
  if (!CHATBOT_ENABLED || m.key.remoteJid.endsWith('@broadcast') || m.key.remoteJid.includes('@g.us') || m.key.fromMe) {
    return;
  }

  const userJid = m.key.remoteJid;
  const messageText = m.message?.conversation || m.message?.extendedTextMessage?.text || '';

  if (!messageText || messageText.startsWith(config.PREFIX)) return;

  if (!messageCache.has(userJid)) {
    messageCache.set(userJid, []);
  }

  const conversationHistory = messageCache.get(userJid);
  conversationHistory.push({ role: 'user', content: messageText });
  if (conversationHistory.length > 10) conversationHistory.shift();

  try {
    await Matrix.sendPresenceUpdate('composing', m.key.remoteJid);
    const aiResponse = await getGroqResponse(messageText, conversationHistory.map(item => item.content).join('\n'));
    conversationHistory.push({ role: 'assistant', content: aiResponse });

    await Matrix.sendMessage(m.key.remoteJid, {
      text: aiResponse,
      contextInfo: {
        mentionedJid: [m.participant || m.key.participant],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363399999197102@newsletter',
          newsletterName: "╭••➤®Njabulo Jb",
          serverMessageId: 143
        }
      }
    }, {
      quoted: {
        key: {
          fromMe: false,
          participant: `0@s.whatsapp.net`,
          remoteJid: "status@broadcast"
        },
        message: {
          contactMessage: {
            displayName: "Njabulo Jb AI",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Njabulo-Jb;BOT;;;\nFN:Njabulo-Jb\nitem1.TEL;waid=254700000000:+254 700 000000\nitem1.X-ABLabel:Bot\nEND:VCARD`
          }
        }
      }
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
  }
};

                    
async function getGroqResponse(prompt, conversationHistory) {
  try {
    const response = await axios.get(`${GROQ_API_URL}?apikey=${GROQ_API_KEY}&q=${encodeURIComponent(prompt)}&context=${encodeURIComponent(conversationHistory)}`);
    return response.data?.result || "I couldn'// Groq API Function
async function getGroqResponse(prompt, conversationHistory) {
  try {
    const response = await axios.get(`${GROQ_API_URL}?apikey=${GROQ_API_KEY}&q=${encodeURIComponent(prompt)}&context=${encodeURIComponent(conversationHistory)}`);
    return response.data?.result || "I couldn't process that request.";
  } catch (error) {
    console.error('Groq API Error:', error);
    return "⚠️ Service temporarily unavailable";
  }
}

export default { chatbotHandler, handleChatbotButton };