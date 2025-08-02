import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "baileys-pro";
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

const leaveGroup = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

    if (!["leave", "exit", "left"].includes(cmd)) return;

    if (!m.isGroup) {
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
      return Matrix.sendMessage(m.from, {
        text: ` ${toFancyFont("yo")}, ${toFancyFont("dumbass")}, *NJABULO JB* ${toFancyFont("only")} ${toFancyFont("ditches")} ${toFancyFont("groups")}! ${toFancyFont("this")} ${toFancyFont("ain’t")} ${toFancyFont("one")}! 😤🏠`,
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

    if (!isCreator) {
      const buttons = [
        {
          buttonId: `.owner`,
          buttonText: { displayText: `👤${toFancyFont("Owner")}` },
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
      return Matrix.sendMessage(m.from, {
        text: `${toFancyFont("fuck")} ${toFancyFont("off")}, ${toFancyFont("poser")}! ${toFancyFont("only")} *Njabulo Jb*’s ${toFancyFont("boss")} ${toFancyFont("can")} ${toFancyFont("tell")} ${toFancyFont("me")} ${toFancyFont("to")} ${toFancyFont("bounce")}!`,
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

    await Matrix.sendMessage(m.from, {
      text: ` *Njabulo Jb*’s ${toFancyFont("out")} ${toFancyFont("this")} ${toFancyFont("bitch")}! ${toFancyFont("peace")}, ${toFancyFont("losers")}!`,
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

    await Matrix.groupLeave(m.from);
  } catch (error) {
    console.error(`❌ Leave error: ${error.message}`);
    const buttons = [
      {
        buttonId: `.support`,
        buttonText: { displayText: `${toFancyFont("Support")}` },
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
    await Matrix.sendMessage(m.from, {
      text: `*Njabulo Jb* ${toFancyFont("fucked")} ${toFancyFont("up")} ${toFancyFont("tryin’")} ${toFancyFont("to")} ${toFancyFont("ditch")}, ${toFancyFont("fam")}! ${toFancyFont("somethin’")} ${toFancyFont("busted")}!`,
      ...messageOptions,
    }, { quoted: m });
  }
};

export default leaveGroup;
