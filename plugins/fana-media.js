import axios from 'axios';
import { mediafireDl } from 'mfiredlcore-vihangayt';
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

const mediafireDownload = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['mediafire', 'mf', 'mfdownload'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return m.reply({ text: `*${toFancyFont("PLEASE PROVIDE A MEDIAFIRE URL")}`, ...messageOptions });
    }

    try {
      await m.React('🕘');

      const mediafireUrl = text;
      const mediafireInfo = await mediafireDl(mediafireUrl);

      if (mediafireInfo && mediafireInfo.link) {
        const mediaUrl = mediafireInfo.link;
        const caption = `> *${toFancyFont("POWERED BY ETHIX-XSID")}*\n> *${toUpperCase(toFancyFont(mediafireInfo.name))}*\n> *${toFancyFont("Size: ")}${mediafireInfo.size}*\n> *${toFancyFont("Date: ")}${mediafireInfo.date}*`;

        const extension = mediaUrl.split('.').pop().toLowerCase();

        await Matrix.sendMedia(m.from, mediaUrl, extension, caption, m);

        await m.React('✅');
      } else {
        throw new Error('*${toFancyFont("INVALID RESPONSE FROM MEDIAFIRE")}*');
      }
    } catch (error) {
      console.error('Error downloading MediaFire file:', error.message);
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      m.reply({ text: `*${toFancyFont("ERROR DOWNLOADING MEDIAFIRE FILE")}`, ...messageOptions });
      await m.React('❌');
    }
  }
};

export default mediafireDownload;