import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './data/index.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import { File } from 'megajs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';
const { emojis, doReact } = pkg;
const prefix = process.env.PREFIX || config.PREFIX;
const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
    console.log("Debugging SESSION_ID:", config.SESSION_ID);

    if (!config.SESSION_ID) {
        console.error('❌ Please add your session to SESSION_ID env !!');
        return false;
    }

    const sessdata = config.SESSION_ID.split("IK~")[1];

    if (!sessdata || !sessdata.includes("#")) {
        console.error('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.');
        return false;
    }

    const [fileID, decryptKey] = sessdata.split("#");

    try {
        console.log("🔄 Downloading Session...");
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('❌ Failed to download session data:', error);
        return false;
    }
}

// Status reply messages
const toxicReplies = [
  "Yo, caught your status. Straight-up savage! 😈",
  "Damn, that status tho! You out here wildin’! 🔥",
  "Saw your status. Bruh, you’re on another level! 💀",
  "What’s good? Your status is pure chaos! 😎",
  "Status checked. You’re droppin’ bombs out here! 💣",
  "Aight, peeped your status. Too lit! 😏",
  "Your status? Absolute fire, no cap! 🚨",
  "Just saw your status. Keep it 100, fam! 🖤",
];

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`🤖 Njabulo-Jb using WA v${version.join('.')}, isLatest: ${isLatest}`);
        
        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["Njabulo-Jb", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg.message || undefined;
                }
                return { conversation: "Njabulo Jb whatsapp user bot" };
            }
        });

Matrix.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
            start();
        }
    } else if (connection === 'open') {
        if (initialConnection) {
            console.log(chalk.green("Connected Successfully NjabuloJb-elite 🤍"));
            Matrix.sendMessage(Matrix.user.id, { 
                image: { url: "https://files.catbox.moe/ylx2x4.jpg" }, 
                caption: `┏───────🙀─────⊷
┊ ɴᴀᴍᴇ : *ɴנɐႦυℓσ נႦ is online*
┗──────────────⊷
┏ *【 ᴅᴇᴠɪᴄᴇ ᴏɴʟɪɴᴇ 】⇳︎*
- . ① *ᴘɪɴɢ*
- . ② *ᴍᴇɴᴜ*
- . ③ *ᴀʟɪᴠᴇ*
- . ④ *ᴜᴘᴅᴀᴛᴇ*
- . ⑤ *ᴜᴘᴛɪᴍᴇ*
┗
┏──────────────⊷
┊ *[ɴᴊᴀʙᴜʟᴏ ᴊʙ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴛᴏ ʟɪɴᴋᴇᴅ ᴅᴇᴠɪᴄᴇ]*
┗──────────────⊷`,
               contextInfo: {
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
                    displayName: "✆︎NנɐႦυℓσ נႦ verified",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Njabulo-Jb;BOT;;;\nFN:Njabulo-Jb\nitem1.TEL;waid=254700000000:+254 700 000000\nitem1.X-ABLabel:Bot\nEND:VCARD`
                }
            }
        } });
            initialConnection = false;
        } else {
            console.log(chalk.blue("♻️ Connection reestablished after restart."));
        }
    }
});
        
         Matrix.ev.on("creds.update", saveCreds);

    // Message handler
    Matrix.ev.on("messages.upsert", async (chatUpdate) => {
      try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;

        if (
          mek.message?.protocolMessage ||
          mek.message?.ephemeralMessage ||
          mek.message?.reactionMessage
        )
          return;

        const fromJid = mek.key.participant || mek.key.remoteJid;

        // Status handling
        if (mek.key.remoteJid === "status@broadcast" && config.AUTO_STATUS_SEEN) {
          await Matrix.readMessages([mek.key]);
          // Autolike function
          if (config.AUTO_LIKE) {
            const autolikeEmojis = ['🗿', '⌚️', '💠', '👣', '🍆', '💔', '🤍', '❤️‍🔥', '💣', '🧠', '🦅', '🌻', '🧊', '🛑', '🧸', '👑', '📍', '😅', '🎭', '🎉', '😳', '💯', '🔥', '💫', '🐒', '💗', '❤️‍🔥', '👁️', '👀', '🙌', '🙆', '🌟', '💧', '🦄', '🟢', '🎎', '✅', '🥱', '🌚', '💚', '💕', '😉', '😒'];
            const randomEmoji = autolikeEmojis[Math.floor(Math.random() * autolikeEmojis.length)];
            const nickk = await Matrix.decodeJid(Matrix.user.id);
            await Matrix.sendMessage(mek.key.remoteJid, { 
              react: { text: randomEmoji, key: mek.key } 
            }, { statusJidList: [mek.key.participant, nickk] });
          }
          // Status reply function
          if (config.AUTO_STATUS_REPLY) {
            const randomReply = toxicReplies[Math.floor(Math.random() * toxicReplies.length)];
            await Matrix.sendMessage(fromJid, { text: randomReply }, { quoted: mek });
          }
          return;
        }

        // Auto-react function
        if (!mek.key.fromMe && config.AUTO_REACT && mek.message) {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          await doReact(randomEmoji, mek, Matrix);
        }

        // Auto-read function
        if (config.AUTO_READ && !mek.key.fromMe) {
          await Matrix.readMessages([mek.key]);
        }

        // Command handler
        await Handler(chatUpdate, Matrix, logger);
      } catch (err) {
        // Suppress non-critical errors
      }
    });

    // Call handler
    Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));

    // Group update handler
    Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

    // Set bot mode
    if (config.MODE === "public") {
      Matrix.public = true;
    } else if (config.MODE === "private") {
      Matrix.public = false;
    }
  } catch (error) {
    console.error(chalk.red(`Critical Error: ${error.message}`));
    process.exit(1);
  }
}

start();

app.get("/", (req, res) => {
  res.send("Njabulo Jb is running!");
});

app.listen(PORT, () => {});