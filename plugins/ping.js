import config from "../config.cjs";
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

const ping = async (m, Matrix) => {
  const prefix = config.PREFIX || ".";
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
    : "";
  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React("📡");
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;
    const text = `*${toFancyFont("Njabulo Jb")}* : ${responseTime.toFixed(2)} s`;
   const buttons = [
      {
        buttonId: "action",
        buttonText: { displayText: "📂 ᴍᴇɴᴜ ᴏᴘᴛɪᴏɴꜱ" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: "📂 ᴄʟɪᴄᴋ ʜᴇʀᴇ",
            sections: [
              {
                title: "📁 ᴍᴇʀᴄᴇᴅᴇs",
                highlight_label: "",
                rows: [
                  {
                    title: "📂 ᴍᴇɴᴜ",
                    description: "ᴏᴘᴇɴ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ",
                    id: `${prefix}menu`,
                  },
                  {
                    title: "👑 ᴏᴡɴᴇʀ",
                    description: "ᴄᴏɴᴛᴀᴄᴛ ʙᴏᴛ ᴏᴡɴᴇʀ",
                    id: `${prefix}owner`,
                  },
                  {
                    title: "📶 ᴘɪɴɢ",
                    description: "ᴛᴇꜱᴛ ʙᴏᴛ ꜱᴘᴇᴇᴅ",
                    id: `${prefix}ping`,
                  },
                  {
                    title: "🖥️ ꜱʏꜱᴛᴇᴍ",
                    description: "ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ",
                    id: `${prefix}system`,
                  },
                  {
                    title: "🛠️ ʀᴇᴘᴏ",
                    description: "ɢɪᴛʜᴜʙ ʀᴇᴘᴏꜱɪᴛᴏʀʏ",
                    id: `${prefix}repo`,
                  },
                ],
              },
            ],
          }),
        },
      },
    ];
    const messageOptions = {
      viewOnce: true,
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    await Matrix.sendMessage(m.from,{ 
      text:text, 
      ...messageOptions 
          }, { quoted: {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
        } });
     }
  };
                             
export default ping;
    
