import axios from 'axios';
import config from '../config.cjs';
import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;

// Groq API configuration
const GROQ_API_KEY = 'gifted'; // Replace with your actual API key if different
const GROQ_API_URL = 'https://api.giftedtech.co.ke/api/ai/groq-beta';

// Response cache to avoid duplicate processing
const messageCache = new Set();

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
  // Ignore messages from status broadcasts, groups (if desired), or cached messages
  if (m.key.remoteJid.endsWith('@broadcast') || 
      m.key.remoteJid.includes('@g.us') || 
      messageCache.has(m.key.id)) {
    return;
  }

  // Add message to cache to prevent duplicate processing
  messageCache.add(m.key.id);
  
  // Clean the cache periodically
  if (messageCache.size > 100) {
    messageCache.clear();
  }

  try {
    const messageText = m.message?.conversation || 
                       m.message?.extendedTextMessage?.text || 
                       '';

    // Ignore empty messages or commands with prefix
    if (!messageText || messageText.startsWith(config.PREFIX)) {
      return;
    }

    // Show typing indicator
    await Matrix.sendPresenceUpdate('composing', m.key.remoteJid);

    // Get response from Groq API
    const aiResponse = await getGroqResponse(messageText);
   const buttons = [
      {
        buttonId: "action",
        buttonText: { displayText: "📂 ᴍᴇɴᴜ ᴏᴘᴛɪᴏɴꜱ" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: "📂 ᴄʟɪᴄᴋ ʜᴇʀᴇ",
            sections: [
              {
                title: "📁 ᴍᴇʀᴄᴇᴅᴇs",
                highlight_label: "",
                rows: [
                  {
                    title: "📂 ᴍᴇɴᴜ",
                    description: "ᴏᴘᴇɴ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ",
                    id: `${prefix}menu`,
                  },
                  {
                    title: "👑 ᴏᴡɴᴇʀ",
                    description: "ᴄᴏɴᴛᴀᴄᴛ ʙᴏᴛ ᴏᴡɴᴇʀ",
                    id: `${prefix}owner`,
                  },
                  {
                    title: "📶 ᴘɪɴɢ",
                    description: "ᴛᴇꜱᴛ ʙᴏᴛ ꜱᴘᴇᴇᴅ",
                    id: `${prefix}ping`,
                  },
                  {
                    title: "🖥️ ꜱʏꜱᴛᴇᴍ",
                    description: "ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ",
                    id: `${prefix}system`,
                  },
                  {
                    title: "🛠️ ʀᴇᴘᴏ",
                    description: "ɢɪᴛʜᴜʙ ʀᴇᴘᴏꜱɪᴛᴏʀʏ",
                    id: `${prefix}repo`,
                  },
                ],
              },
            ],
          }),
        },
      },
    ];
    const messageOptions = {
      viewOnce: true,
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    // Send the response
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
    }, { quoted: {
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
        } });

  } catch (error) {
    console.error('Chatbot Error:', error);
    // Optionally send an error message
    // await Matrix.sendMessage(m.key.remoteJid, { text: "Sorry, I encountered an error processing your message." });
  }
};

export default chatbotHandler;
