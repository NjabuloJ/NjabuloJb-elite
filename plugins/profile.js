









































































































































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

const profileCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'profile') {
    let sender = m.quoted ? m.quoted.sender : m.sender;
    let name = m.quoted ? "@" + sender.split("@")[0] : m.pushName;

    let ppUrl;
    try {
      ppUrl = await Matrix.profilePictureUrl(sender, 'image');
    } catch {
      ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg";
    }

    let status;
    try {
      status = await Matrix.fetchStatus(sender);
    } catch (error) {
      status = { status: "About not accessible due to user privacy" };
    }

    const buttons = [
      {
        buttonId: '.menu',
        buttonText: { displayText: toFancyFont('Back') },
        type: 1,
      },
    ];

    const mess = {
      image: { url: ppUrl },
      caption: `*${toFancyFont("Name")}:* ${name}\n*${toFancyFont("About")}:*\n${status.status}`,
      buttons,
      ...(m.quoted ? { mentions: [sender] } : {}) // Mention only if quoted
    };

    await Matrix.sendMessage(m.from, mess, { quoted: m });
  }
};

export default profileCommand;
