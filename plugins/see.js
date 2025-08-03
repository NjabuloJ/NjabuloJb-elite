import axios from 'axios';
import config from '../config.cjs';
import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;

// Groq API configuration
const GROQ_API_KEY = 'gifted'; // Replace with your actual API key if different
const GROQ_API_URL = 'https://api.giftedtech.co.ke/api/ai/groq-beta';

// Response cache to avoid duplicate processing
const messageCache = new Set();
const MAX_CACHE_SIZE = 100;

async function getGroqResponse(prompt) {
  try {
    const response = await axios.get(`${GROQ_API_URL}?apikey=${GROQ_API_KEY}&q=${encodeURIComponent(prompt)}`);
    return response.data?.result || "I couldn't process that request. Please try again.";
  } catch (error) {
    console.error('Groq API Error:', error);
    return "Sorry, I'm having trouble connecting to the AI service.";
  }
}

const chatbotHandler = async (m, Matrix) => {
  // Ignore messages from status broadcasts, groups, or cached messages
  if (m.key.remoteJid.endsWith('@broadcast') || 
      m.key.remoteJid.includes('@g.us') || 
      messageCache.has(m.key.id)) {
    return;
  }

  messageCache.add(m.key.id);
  
  // Clean the cache periodically
  if (messageCache.size > MAX_CACHE_SIZE) {
    messageCache.clear();
  }

  try {
    const messageText = m.message?.conversation || 
                       m.message?.extendedTextMessage?.text || 
                       '';

    if (!messageText || messageText.startsWith(config.PREFIX)) {
      return;
    }

    if (!config.Chat_bot) return;

    await Matrix.sendPresenceUpdate('composing', m.key.remoteJid);

    const aiResponse = await getGroqResponse(messageText);

    const message = {
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
    };

    const quotedMessage = {
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
    };

    await Matrix.sendMessage(m.key.remoteJid, message, { quoted: quotedMessage });
  } catch (error) {
    console.error('Chatbot Error:', error);
  }
};

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'waysonline' || cmd === 'chatbot') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    const usage = `Usage:\n- \`${prefix}chatbot on\`: Enable Chatbot\n- \`${prefix}chatbot off\`: Disable Chatbot`;

    if (text === 'on') {
      config.Chat_bot = true;
      await m.reply("Chatbot has been enabled.");
    } else if (text === 'off') {
      config.Chat_bot = false;
      await m.reply("Chatbot has been disabled.");
    } else {
      await m.reply(usage);
    }
  }
};

export { chatbotHandler, alwaysonlineCommand };