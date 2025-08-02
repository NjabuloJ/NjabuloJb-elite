import { lyrics, lyricsv2 } from '@bochilteam/scraper';
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

const lyricsCommand = async (m, Matrix) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['lyrics'];
    if (!validCommands.includes(cmd)) return;

    if (!text) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return m.reply({ text: `*${toFancyFont("PLEASE PROVIDE A SONG NAME")}`, ...messageOptions });
    }

    m.reply(`*${toFancyFont("SEARCHING FOR LYRICS, PLEASE WAIT...")}`);

    const result = await lyricsv2(text).catch(async () => await lyrics(text));

    if (!result) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return m.reply({ text: `*${toFancyFont("NO LYRICS FOUND FOR THE PROVIDED SONG")}`, ...messageOptions });
    }

    const replyMessage = `
      *${toFancyFont("TITLE: ")}* ${result.title}
      *${toFancyFont("AUTHOR: ")}* ${result.author}
      *${toFancyFont("URL: ")}* ${result.link}

      *${toFancyFont("LYRICS: ")}*\n\n ${result.lyrics}
    `.trim();

    const buttons = [createButton(`.menu`, "Menu")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    m.reply({ text: replyMessage, ...messageOptions });

  } catch (error) {
    console.error('Error:', error);
    const buttons = [createButton(`.report`, "Report")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    m.reply({ text: `*${toFancyFont("AN ERROR OCCURRED WHILE PROCESSING THE COMMAND")}`, ...messageOptions });
  }
};

export default lyricsCommand;