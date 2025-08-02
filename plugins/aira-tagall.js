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
  buttonText: { displayText: `${toFancyFont(displayText)}` },
  type: 1,
});

const tagAll = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['tagall'];
    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) {
      const buttons = [createButton(`.menu`, "Menu")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return gss.sendMessage(m.from, { text: `*${toFancyFont("THIS COMMAND CAN ONLY BE USED IN GROUPS")}`, ...messageOptions });
    }

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) {
      const buttons = [createButton(`.promote`, "Promote")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return gss.sendMessage(m.from, { text: `*${toFancyFont("BOT MUST BE AN ADMIN TO USE THIS COMMAND")}`, ...messageOptions });
    }

    if (!senderAdmin) {
      const buttons = [createButton(`.menu`, "Menu")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return gss.sendMessage(m.from, { text: `*${toFancyFont("YOU MUST BE AN ADMIN TO USE THIS COMMAND")}`, ...messageOptions });
    }

    let message = `乂 *${toFancyFont("Attention Everyone")}* 乂\n\n*${toFancyFont("Message: ")}* ${text || toFancyFont('no message')}\n\n`;
    for (let participant of participants) {
      message += `❒ @${participant.id.split('@')[0]}\n`;
    }

    const buttons = [createButton(`.menu`, "Menu")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: participants.map(a => a.id),
      },
    };
    await gss.sendMessage(m.from, { text: message, ...messageOptions }, { quoted: m });
  } catch (error) {
    console.error('Error:', error);
    const buttons = [createButton(`.report`, "Report")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    await gss.sendMessage(m.from, { text: `*${toFancyFont("An error occurred while processing the command")}`, ...messageOptions });
  }
};

export default tagAll;