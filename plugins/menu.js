import moment from "moment-timezone";
import fs from "fs";
import os from "os";
import pkg from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";
import axios from "axios";

// Time logic
const xtime = moment.tz("Africa/Nairobi").format("HH:mm:ss");
const xdate = moment.tz("Africa/Nairobi").format("DD/MM/YYYY");
const time2 = moment().tz("Africa/Nairobi").format("HH:mm:ss");
let pushwish = "";

if (time2 < "05:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "11:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "15:00:00") {
  pushwish = `Good Afternoon 🌅`;
} else if (time2 < "18:00:00") {
  pushwish = `Good Evening 🌃`;
} else if (time2 < "19:00:00") {
  pushwish = `Good Evening 🌃`;
} else {
  pushwish = `Good Night 🌌`;
}

// Fancy font utility
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

// Image fetch utility
async function fetchMenuImage() {
  const imageUrl = "https://files.catbox.moe/omgszj.jpg";
  for (let i = 0; i < 3; i++) {
    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      return Buffer.from(response.data, "binary");
    } catch (error) {
      if (error.response?.status === 429 && i < 2) {
        console.log(`Rate limit hit, retrying in 2s...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }
      console.error("❌ Failed to fetch image:", error);
      return null;
    }
  }
}

const menu = async (m, Matrix) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const mode = config.MODE === "public" ? "public" : "private";
    const totalCommands = 70;

    const validCommands = ["list", "help", "menu"];
    const subMenuCommands = [
      "download-menu",
      "converter-menu",
      "ai-menu",
      "tools-menu",
      "group-menu",
      "search-menu",
      "main-menu",
      "owner-menu",
      "stalk-menu",
    ];

    // Fetch image for all cases
    const menuImage = await fetchMenuImage();

    // Handle main menu
    if (validCommands.includes(cmd)) {
      const mainMenu = `
┏──────────────⊷
┊ ɴᴀᴍᴇ :  *NנɐႦυℓσ נႦ*
┊ ᴍᴏᴅᴇ : *[ ${mode} ]*
┊ ᴘʀᴇғɪx : * [ ${prefix} ]*
┊ ᴠᴇʀsɪᴏɴ : *.0.0.12 ʙᴇᴛᴀ*
┗──────────────⊷
┏           *【 ᴍᴇɴᴜ ʟɪsᴛ 】⇳︎*
- . ①  *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*
- . ②  *ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
- . ③  *ғᴜɴ ᴍᴇɴᴜ*
- . ④  *ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
- . ⑤  *ᴀɪ ᴍᴇɴᴜ*
- . ⑥  *ᴀɴɪᴍᴇ ᴍᴇɴᴜ*
- . ⑦  *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
- . ⑧  *ᴏᴛʜᴇʀ ᴍᴇɴᴜ*
- . ⑨  *ʀᴇᴀᴄᴛɪᴏɴs ᴍᴇɴᴜ*
- . ⑩  *ᴍᴀɪɴ ᴍᴇɴᴜ*
┗
┏──────────────⊷
┊*Hallo my family ${pushwish}*
┗──────────────⊷
`;

      const messageOptions = {
        viewOnce: true,
        buttons: [
          {
            buttonId: `${prefix}download-menu`,
            buttonText: { displayText: ` ${toFancyFont("All Commands Cmd")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}converter-menu`,
            buttonText: { displayText: ` ${toFancyFont("follow Join family")}` },
            type: 1,
          },
        ],
         contextInfo: {
         mentionedJid: [m.sender],
           forwardingScore: 999,
           isForwarded: true,
           forwardedNewsletterMessageInfo: {
           newsletterJid: '120363399999197102@newsletter',
           newsletterName: "╭••➤®Njabulo Jb",
           serverMessageId: 143
          },
        },
      };

      // Send menu with or without image
      if (menuImage) {
        await Matrix.sendMessage(m.from,{ 
            image: menuImage,
          caption: mainMenu,
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
      } else {
        await Matrix.sendMessage(m.from, { text: mainMenu, ...messageOptions }, { quoted: m });
      }

      // Send audio as a voice note
      await Matrix.sendMessage(m.from,{ 
          audio: { url: "https://files.catbox.moe/z06nkt.mp3" },
          mimetype: "audio/mp4", ptt: true
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

    // Handle sub-menu commands
    if (subMenuCommands.includes(cmd)) {
      let menuTitle;
      let menuResponse;

      switch (cmd) {
        case "download-menu":
          menuTitle = "All Commands Cmd";
          menuResponse = `*【download】*
${toFancyFont(".①apk")}
${toFancyFont(".②facebook")}
${toFancyFont(".③mediafire")}
${toFancyFont(".④pinterest")}
${toFancyFont(".⑤gitclone")}
${toFancyFont(".⑥gdrive")}
${toFancyFont(".⑦insta")}
${toFancyFont(".⑧ytmp3")}
${toFancyFont(".⑨ytmp4")}
${toFancyFont(".⑩play")}
${toFancyFont(".⑪song")}
${toFancyFont(".⑫video")}
${toFancyFont(".⑬ytmp3doc")}
${toFancyFont(".⑭ytmp4doc")}
${toFancyFont(".⑮tiktok")}

${toFancyFont("② *【Converter】*")}
${toFancyFont(".①attp")}
${toFancyFont(".②attp2")}
${toFancyFont(".③attp3")}
${toFancyFont(".④ebinary")}
${toFancyFont(".⑤dbinary")}
${toFancyFont(".⑥emojimix")}
${toFancyFont(".⑦mp3")}

${toFancyFont("③ *【AI】*")}
${toFancyFont(".①ai")}
${toFancyFont(".②bug")}
${toFancyFont(".③report")}
${toFancyFont(".④gpt")}
${toFancyFont(".⑤dall")}
${toFancyFont(".⑥remini")}
${toFancyFont(".⑦gemini")}

${toFancyFont("④ *【Tools】*")}
${toFancyFont(".①calculator")}
${toFancyFont(".②tempmail")}
${toFancyFont(".③checkmail")}
${toFancyFont(".④trt")}
${toFancyFont(".⑤tts")}

${toFancyFont("⑤ *【Group】*")}
${toFancyFont(".①linkgroup")}
${toFancyFont(".②setppgc")}
${toFancyFont(".③setname")}
${toFancyFont(".④setdesc")}
${toFancyFont(".⑤group")}
${toFancyFont(".⑥gcsetting")}
${toFancyFont(".⑦welcome")}
${toFancyFont(".⑧add")}
${toFancyFont(".⑨kick")}
${toFancyFont(".⑩hidetag")}
${toFancyFont(".⑪tagall")}
${toFancyFont(".⑫antilink")}
${toFancyFont(".⑬antitoxic")}
${toFancyFont(".⑭promote")}
${toFancyFont(".⑮demote")}
${toFancyFont(".⑯getbio")}

${toFancyFont("⑥ *【Search】*")}
${toFancyFont(".①play")}
${toFancyFont(".②yts")}
${toFancyFont(".③imdb")}
${toFancyFont(".④google")}
${toFancyFont(".⑤gimage")}
${toFancyFont(".⑥pinterest")}
${toFancyFont(".⑦wallpaper")}
${toFancyFont(".⑧wikimedia")}
${toFancyFont(".⑨ytsearch")}
${toFancyFont(".⑩ringtone")}
${toFancyFont(".⑪lyrics")}

${toFancyFont("⑦ *【Main】*")}
${toFancyFont(".①ping")}
${toFancyFont(".②alive")}
${toFancyFont(".③owner")}
${toFancyFont(".④menu")}
${toFancyFont(".⑤infobot")}

${toFancyFont("⑧ *【Owner】*")}
${toFancyFont(".①join")}
${toFancyFont(".②leave")}
${toFancyFont(".③block")}
${toFancyFont(".④unblock")}
${toFancyFont(".⑤setppbot")}
${toFancyFont(".⑥anticall")}
${toFancyFont(".⑦setstatus")}
${toFancyFont(".⑧setnamebot")}
${toFancyFont(".⑨autorecording")}
${toFancyFont(".⑩autolike")}
${toFancyFont(".⑪autotyping")}
${toFancyFont(".⑫alwaysonline")}
${toFancyFont(".⑬autoread")}
${toFancyFont(".⑭autosview")}

${toFancyFont("*【⑨ Stalk】*")}
${toFancyFont(".①truecaller")}
${toFancyFont(".②instastalk")}
${toFancyFont(".③githubstalk")}
`;
          
        break;

        default:
          return;
      }

      // Format the full response
      const fullResponse = `
*①• ${toFancyFont("aira")} (Command Menu ⚠)*
*②• ${toFancyFont("Bot")}*: ${toFancyFont("*(aira)*")}
*④• ${toFancyFont("Date")}*: ${xdate}
*⑤• ${toFancyFont("Time")}*: ${xtime} 
*⑥• ${toFancyFont("Prefix")}: [ ${prefix} ]*
*⑦• ${toFancyFont("Mode")}*: ${mode}
*⑧• ${toFancyFont("Library")}: (Baileys)*

${menuResponse}

> ✆︎Pσɯҽɾҽԃ Ⴆყ NנɐႦυℓσ נႦ
`;

       if (menuImage) {
        await Matrix.sendMessage(m.from,{
            text: fullResponse,
            contextInfo: {
             isForwarded: true,
             forwardedNewsletterMessageInfo: {
             serverMessageId: 143,          
              },
            },
          },
          { quoted: m }
        );
      } else {
        await Matrix.sendMessage(m.from, {
          text: fullResponse,
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
            serverMessageId: 143,
            },
          },
        }, { quoted: m });
      }
    }
  } catch (error) {
    console.error(`❌ Menu error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `•
• *Njabulo Jb* hit a snag! Error: ${error.message || "Failed to load menu"} 😡
•`,
    }, { quoted: m });
  }
};

export default menu;
