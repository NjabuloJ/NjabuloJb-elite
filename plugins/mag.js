import axios from 'axios';
import config from '../config.cjs';
import pkg from "@whiskeysockets/baileys";
import { GoogleGenerativeAI } from "@google/generative-ai";
const { generateWAMessageFromContent, proto } = pkg;
const fs = require('fs');

// Groq API configuration
const GROQ_API_KEY = config.GROQ_API_KEY; 
const GROQ_API_URL = 'https://api.gripapi.xyz/api/ai/groq';

// Response cache to avoid duplicate processing
const messageCache = new Set();

// Function to get chatbot status
async function getChatbotStatus() {
  try {
    const status = fs.readFileSync('chatbot-status.txt', 'utf8');
    return status === 'true';
  } catch (error) {
    return true; // Default status
  }
}

// Function to set chatbot status
async function setChatbotStatus(status) {
  fs.writeFileSync('chatbot-status.txt', status.toString());
}

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
    const prefix = config.PREFIX;
    const cmd = m.message?.conversation?.startsWith(prefix) ? m.message.conversation.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.message?.conversation?.slice(prefix.length + cmd.length).trim();

    const chatbotStatus = await getChatbotStatus();

    if (cmd === 'chatbot') {
      if (text === 'on') {
        if (chatbotStatus) {
          await Matrix.sendMessage(m.key.remoteJid, { text: 'Chatbot is already turned on.' });
        } else {
          await setChatbotStatus(true);
          await Matrix.sendMessage(m.key.remoteJid, { text: 'Chatbot turned on successfully.' });
        }
      } else if (text === 'off') {
        if (!chatbotStatus) {
          await Matrix.sendMessage(m.key.remoteJid, { text: 'Chatbot is already turned off.' });
        } else {
          await setChatbotStatus(false);
          await Matrix.sendMessage(m.key.remoteJid, { text: 'Chatbot turned off successfully.' });
        }
      } else {
        await Matrix.sendMessage(m.key.remoteJid, { text: 'Invalid command. Use "chatbot on" or "chatbot off".' });
      }
      return;
    }

    if (!chatbotStatus) return;

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

    // Send the response
    await Matrix.sendMessage(m.key.remoteJid, { 
      text: aiResponse,
      contextInfo: {
       mentionedJid: [m.participant || m.key.participant],
       forwardingScore: 999,
       isForwarded: true,
       forwardedNewsletterMessageInfo: {
        newsletterJid: '120363399999197102@newsletter',
       newsletterName: "╭••➤®🤣Njabulo Jb",
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