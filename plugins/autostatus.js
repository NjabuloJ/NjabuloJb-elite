import config from '../config.cjs';
import pkg, { prepareWAMessageMedia } from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;

function toFancyFont(text) {
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
  return text
    .toLowerCase()
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

const autostatusCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();
  
  const validCommands = ['autostatus', 'autosview', 'autostatusview'];
  const img = 'https://files.catbox.moe/84ohd5.jpg';
  
  if (validCommands.includes(cmd)) {
    if (!isCreator) return Matrix.sendMessage(m.from, {
      image: { url: img },
      caption: "*ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ*",
      viewOnce: true,
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
    let responseMessage;
    const buttons = [
      {
        buttonId: `.autostatus on`,
        buttonText: { displayText: `${toFancyFont("autostatus on")}` },
        type: 1,
      },
      {
        buttonId: `.autostatus off`,
        buttonText: { displayText: `${toFancyFont("autostatus off")}` },
        type: 1,
      },
    ];

    if (!text) {
      const messageOptions = {
        viewOnce: true,
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(
        m.from,
        {
          image: { url: img },
          caption: `Usage:\n- *${prefix + cmd} ${toFancyFont("on")}:* Enable AUTO STATUS VIEW\n- *${prefix + cmd} ${toFancyFont("off")}:* Disable AUTO STATUS SEEN`,
          ...messageOptions,
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
   }

    if (text === 'on') {
      config.AUTO_STATUS_SEEN = true;
      responseMessage = "AUTO STATUS SEEN has been enabled.";
    } else if (text === 'off') {
      config.AUTO_STATUS_SEEN = false;
      responseMessage = "AUTO STATUS SEEN has been disabled.";
    } else {
      const messageOptions = {
        viewOnce: true,
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(
        m.from,
        {
          image: { url: img },
          caption: `Usage:\n- *${prefix + cmd} ${toFancyFont("on")}:* Enable AUTO STATUS VIEW\n- *${prefix + cmd} ${toFancyFont("off")}:* Disable AUTO STATUS SEEN`,
          ...messageOptions,
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
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage, viewOnce: true }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.', viewOnce: true }, { quoted: m });
    }
  }
};

export default autostatusCommand;
