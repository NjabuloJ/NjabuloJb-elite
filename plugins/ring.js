import axios from 'axios';
import config from '../config.cjs';
import pkg, { prepareWAMessageMedia } from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;

function toFancyFont(text, isUpperCase = false) {
  const fonts = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ғ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "s",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ",
  };
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

const createButton = (buttonId, displayText) => ({
  buttonId,
  buttonText: { displayText },
  type: 1,
});

const ringtone = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/).filter(Boolean);
  const query = args.join(" ");

  if (!['ringtone', 'ringtones', 'ring'].includes(cmd)) return;

  if (!query) {
    const buttons = [createButton(`.menu`, `📃${toFancyFont("Menu")}`)];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    return Matrix.sendMessage(m.from, { text: `❌ ${toFancyFont("Please provide a search query!")}\n${toFancyFont("Example: .ringtone Suna")}`, ...messageOptions }, { quoted: m });
  }

  await m.React('🎵');
  await Matrix.sendMessage(m.from, { text: `🎵 ${toFancyFont("Searching ringtone for: ")}*${query}*...` }, { quoted: m });

  try {
    const { data } = await axios.get(`https://api.example.com/ringtone?q=${encodeURIComponent(query)}`);

    if (!data.status || !data.result || data.result.length === 0) {
      const buttons = [createButton(`.help`, `🤲${toFancyFont("Help")}`)];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, { text: `❌ ${toFancyFont("No ringtones found for your query. Please try a different keyword.")}`, ...messageOptions }, { quoted: m });
    }

    const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

    const buttons = [createButton(`.ringtone ${query}`, `🔍${toFancyFont("Search Again")}`)];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363354023106228@newsletter',
          newsletterName: "JawadTechX",
          serverMessageId: 143
        }
      }
    };

    await Matrix.sendMessage(m.from, {
      audio: { url: randomRingtone.dl_link },
      mimetype: "audio/mpeg",
      fileName: `${randomRingtone.title}.mp3`,
      ...messageOptions
    }, { quoted: m });

  } catch (error) {
    console.error("Error in ringtone command:", error);
    const buttons = [createButton(`.report`, `⚠︎${toFancyFont("Report")}`)];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    Matrix.sendMessage(m.from, { text: `❌ ${toFancyFont("Something went wrong while fetching the ringtone. Please try again later.")}`, ...messageOptions }, { quoted: m });
  }
};

export default ringtone;
