import axios from 'axios';
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
  buttonText: { displayText: `${toFancyFont(displayText)}` },
  type: 1,
});

const apiBaseUrl = 'https://semantic-delcina-gssbotwa-ecdfac1a.koyeb.app'; // Your API endpoint

const getPairingCode = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['pair', 'getsession', 'paircode', 'pairingcode'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return m.reply({ text: `*${toFancyFont("PLEASE PROVIDE A PHONE NUMBER WITH COUNTRY CODE")}`, ...messageOptions });
    }

    const phoneNumberMatch = text.match(/^(\+\d{1,3})(\d+)$/);
    if (!phoneNumberMatch) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return m.reply({ text: `*${toFancyFont("PLEASE PROVIDE A VALID PHONE NUMBER WITH COUNTRY CODE")}`, ...messageOptions });
    }

    const countryCode = phoneNumberMatch[1];
    const phoneNumber = phoneNumberMatch[2];

    try {
      await m.React('🕘');

      const response = await axios.post(apiBaseUrl, {
        phoneNumber: countryCode + phoneNumber
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;

      if (result.pairingCode) {
        const message = `*${toFancyFont("PAIRING CODE: ")}* ${result.pairingCode}\n*${toFancyFont("STATUS: ")}* ${result.status}`;
        const buttons = [createButton(`.menu`, "Menu")];
        const messageOptions = {
          buttons,
          contextInfo: {
            mentionedJid: [m.sender],
          },
        };
        await m.reply({ text: message, ...messageOptions });
        await m.React('✅');
      } else {
        throw new Error('*${toFancyFont("INVALID RESPONSE FROM THE SERVER")}*');
      }
    } catch (error) {
      console.error('Error fetching pairing code:', error.message);
      const buttons = [createButton(`.report`, "Report")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      m.reply({ text: `*${toFancyFont("ERROR FETCHING PAIRING CODE")}`, ...messageOptions });
      await m.React('❌');
    }
  }
};

export default getPairingCode;