import config from '../config.cjs';
import pkg from "@whiskeysockets/baileys";
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

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'alwaysonline') {
    if (!isCreator) return m.reply(`*${toFancyFont("Error: Only owner can use this command")}*`);
    let responseMessage;
    if (text === 'on') {
      config.ALWAYS_ONLINE = true;
      responseMessage = `*${toFancyFont("Always Online has been enabled.")}*`;
    } else if (text === 'off') {
      config.ALWAYS_ONLINE = false;
      responseMessage = `*${toFancyFont("Always Online has been disabled.")}*`;
    } else {
      responseMessage = `*${toFancyFont("Usage:")}*\n- \`${prefix}alwaysonline on\`: ${toFancyFont("Enable Always Online")}\n- \`${prefix}alwaysonline off\`: ${toFancyFont("Disable Always Online")}`;
    }

    const buttons = [
      {
        buttonId: `.menu`,
        buttonText: { displayText: `📃${toFancyFont("Menu")}` },
        type: 1,
      },
    ];

    const messageOptions = {
      viewOnce: true,
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };

    try {
      await Matrix.sendMessage(m.from, { 
        text: responseMessage,
        ...messageOptions
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
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: `*${toFancyFont("Error processing your request.")}*` }, { quoted: m });
    }
  }
};

export default alwaysonlineCommand;
