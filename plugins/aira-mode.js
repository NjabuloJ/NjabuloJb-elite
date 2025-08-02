import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';
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

const modeCommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd === 'mode') {
        if (!isCreator) {
            const buttons = [createButton(`.owner`, "Owner")];
            const messageOptions = {
              buttons,
              contextInfo: {
                mentionedJid: [m.sender],
              },
            };
            await Matrix.sendMessage(m.from, { text: `*${toFancyFont("THIS IS AN OWNER COMMAND")}`, ...messageOptions }, { quoted: m });
            return;
        }

        if (['public', 'private'].includes(text)) {
            if (text === 'public') {
                Matrix.public = true;
                const buttons = [createButton(`.menu`, "Menu")];
                const messageOptions = {
                  buttons,
                  contextInfo: {
                    mentionedJid: [m.sender],
                  },
                };
                m.reply({ text: `*${toFancyFont("MODE HAS BEEN CHANGED TO PUBLIC")}`, ...messageOptions });
            } else if (text === 'private') {
                Matrix.public = false;
                const buttons = [createButton(`.menu`, "Menu")];
                const messageOptions = {
                  buttons,
                  contextInfo: {
                    mentionedJid: [m.sender],
                  },
                };
                m.reply({ text: `*${toFancyFont("MODE HAS BEEN CHANGED TO PRIVATE")}`, ...messageOptions });
            }
        } else {
            const buttons = [createButton(`.help`, "Help")];
            const messageOptions = {
              buttons,
              contextInfo: {
                mentionedJid: [m.sender],
              },
            };
            m.reply({ text: `*${toFancyFont("USAGE: MODE PUBLIC/PRIVATE")}`, ...messageOptions });
        }
    }
};

export default modeCommand;