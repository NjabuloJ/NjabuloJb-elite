import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "@whiskeysockets/baileys";
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';

// Get total memory and free memory in bytes
const totalMemoryBytes = os.totalmem();
const freeMemoryBytes = os.freemem();

// Define unit conversions
const byteToKB = 1 / 1024;
const byteToMB = byteToKB / 1024;
const byteToGB = byteToMB / 1024;

// Function to format bytes to a human-readable format
function formatBytes(bytes) {
  if (bytes >= Math.pow(1024, 3)) {
    return (bytes * byteToGB).toFixed(2) + ' GB';
  } else if (bytes >= Math.pow(1024, 2)) {
    return (bytes * byteToMB).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes * byteToKB).toFixed(2) + ' KB';
  } else {
    return bytes.toFixed(2) + ' bytes';
  }
}

// Bot Process Time
const uptime = process.uptime();
const day = Math.floor(uptime / (24 * 3600)); // Calculate days
const hours = Math.floor((uptime % (24 * 3600)) / 3600); // Calculate hours
const minutes = Math.floor((uptime % 3600) / 60); // Calculate minutes
const seconds = Math.floor(uptime % 60); // Calculate seconds

// Uptime
const uptimeMessage = `*I am alive now since ${day}d ${hours}h ${minutes}m ${seconds}s*`;
const runMessage = `*☀️ ${day} Day*\n*🕐 ${hours} Hour*\n*⏰ ${minutes} Minutes*\n*⏱️ ${seconds} Seconds*\n`;

const xtime = moment.tz("Asia/Colombo").format("HH:mm:ss");
const xdate = moment.tz("Asia/Colombo").format("DD/MM/YYYY");
const time2 = moment().tz("Asia/Colombo").format("HH:mm:ss");
let pushwish = "";

if (time2 < "05:00:00") {
  pushwish = `Good Night 🌌`;
} else if (time2 < "11:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "15:00:00") {
  pushwish = `Good Afternoon 🌅`;
} else if (time2 < "19:00:00") {
  pushwish = `Good Evening 🌃`;
} else {
  pushwish = `Good Night 🌌`;
}

const menu = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const mode = config.MODE === 'public' ? 'public' : 'private';
  const pref = config.PREFIX;

  const validCommands = ['fullmenuw', 'menu2w', 'listcmdw'];

  if (validCommands.includes(cmd)) {
    const str = `
╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★╭──────────────
┃★│ Owner : *${config.OWNER_NAME}*
┃★│ User : *${m.pushName}*
┃★│ Baileys : *Multi Device*
┃★│ Type : *NodeJs*
┃★│ Mode : *${mode}*
┃★│ Platform : *${os.platform()}*
┃★│ Prefix : [${prefix}]
┃★│ Version : *3.1.0*
┃★╰──────────────
╰━━━━━━━━━━━━━━━┈⊷

> ${pushwish} *${m.pushName}*!

╭━━〔 *Download Menu* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• apk
┃◈┃• facebook
┃◈┃• mediafire
┃◈┃• pinterestdl
┃◈┃• gitclone
┃◈┃• gdrive
┃◈┃• insta
┃◈┃• ytmp3
┃◈┃• ytmp4
┃◈┃• play
┃◈┃• song
┃◈┃• video
┃◈┃• ytmp3doc
┃◈┃• ytmp4doc
┃◈┃• tiktok
┃◈└───────────┈⊷
╰──────────────┈⊷

> *${config.DESCRIPTION}*`;

    // Check if MENU_IMAGE exists in config and is not empty
    let menuImage;
    if (config.MENU_IMAGE && config.MENU_IMAGE.trim() !== '') {
      try {
        // Try to fetch the image from URL
        const response = await axios.get(config.MENU_IMAGE, { responseType: 'arraybuffer' });
        menuImage = Buffer.from(response.data, 'binary');
      } catch (error) {
        console.error('Error fetching menu image from URL, falling back to local image:', error);
        menuImage = fs.readFileSync('./media/khan.jpg');
      }
    } else {
      // Use local image if MENU_IMAGE is not configured
      menuImage = fs.readFileSync('./media/khan.jpg');
    }

    const buttons = [
      {
        "name": "single_select",
        "buttonParamsJson": JSON.stringify({
          "title": "🔖𝚻𝚫𝚸 𝐅𝚯𝚪 𝚯𝚸𝚵𝚴 𝚳𝚵𝚴𝐔",
          "sections": [
            {
              "title": "😎 🇸​​🇮​​🇱​​🇻​​🇦​-𝛭𝐷 𝛥𝐿𝐿𝛭𝛯𝛮𝑈",
              "highlight_label": "🤩 𝛥𝐿𝐿𝛭𝛯𝛮𝑈",
              "rows": [
                {
                  "header": "",
                  "title": "🔰 ᴀʟʟ ᴍᴇɴᴜ",
                  "description": "🎨🇸​​🇮​​🇱​​🇻​​🇦​-𝛭𝐷 𝛥𝐿𝐿𝛭𝛯𝛮𝑈🎨",
                  "id": "View All Menu"
                },
                {
                  "header": "",
                  "title": "⬇️ ᴅᴏᴡɴʟᴀᴏᴅᴇʀ ᴍᴇɴᴜ",
                  "description": "📂𝐒𝚮𝚯𝐖 𝚫𝐋𝐋 𝐃𝚯𝐖𝚴𝐋𝚯𝚫𝐃 𝐅𝚵𝚫𝚻𝐔𝚪𝚵𝐒🗂",
                  "id": "Downloader Menu"
                },
                {
                  "header": "",
                  "title": "👨‍👨‍👧‍👧ɢʀᴏᴜᴘ ᴍᴇɴᴜ",
                  "description": "🥵𝐅𝚵𝚫𝚻𝐔𝚪𝚵 𝚻𝚮𝚫𝚻 𝚫𝚪𝚵 𝚯𝚴𝐋𝐘 𝚫𝛁𝚰𝐋𝚫𝚩𝐋𝚵 𝐅𝚯𝚪 𝐆𝚪𝚯𝐔𝚸🥵",
                  "id": "Group Menu"
                },
                {
                  "header": "",
                  "title": "👨‍🔧 ᴛᴏᴏʟ ᴍᴇɴᴜ",
                  "description": "🛠 𝐒𝚮𝚯𝐖 𝚳𝚵 𝚻𝚯𝚯𝐋 𝚳𝚵𝚴𝐔",
                  "id": "Tool Menu"
                },
                {
                  "header": "",
                  "title": "🗿 ᴍᴀɪɴ ᴍᴇɴᴜ",
                  "description": "📪 𝚩𝚯𝚻 𝚳𝚫𝚰𝚴 𝐂𝚯𝚳𝚳𝚫𝚴𝐃𝐒🗳",
                  "id": "Main Menu"
                },
                {
                  "header": "",
                  "title": "👨‍💻 ᴏᴡɴᴇʀ ᴍᴇɴᴜ",
                  "description": "😎𝐅𝚵𝚫𝚻𝐔𝚪𝚵 𝚻𝚮𝚫𝚻 𝚫𝚪𝚵 𝚯𝚴𝐋𝐘 𝐅𝚯𝚪 𝚳𝐘 𝚮𝚫𝚴𝐃𝐒𝚯𝚳𝚵 𝚯𝐖𝚴𝚵𝚪👨‍💼",
                  "id": "Owner Menu"
                },
                {
                  "header": "",
                  "title": "✨ ᴀɪ ᴍᴇɴᴜ",
                  "description": "💫 𝐒𝚮𝚯𝐖 𝚳𝚵 𝚫𝚰 𝚳𝚵𝚴𝐔 🎇",
                  "id": "Ai Menu"
                },
                {
                  "header": "",
                  "title": "🔍sᴇᴀʀᴄʜ ᴍᴇɴᴜ🔎",
                  "description": "♂️ 𝐒𝚮𝚯𝐖 𝚳𝚵 𝐒𝚵𝚫𝚪𝐂𝚮 𝚳𝚵𝚴𝐔",
                  "id": "Search Menu"
                },
                {
                  "header": "",
                  "title": "🧚‍♂️ sᴛᴀʟᴋ ᴍᴇɴᴜ",
                  "description": "👨‍💼 𝐒𝚮𝚯𝐖 𝚳𝚵 𝐒𝚻𝚫𝐋𝐊 𝚳𝚵𝚴𝐔🪆",
                  "id": "Stalk Menu"
                },
                {
                  "header": "",
                  "title": "🥏 𝚌𝚘𝚗𝚟𝚎𝚛𝚝𝚎𝚛 𝚖𝚎𝚗𝚞",
                  "description": "🛷 𝐒𝚮𝚯𝐖 𝚳𝚵 𝐂𝚯𝚴𝛁𝚵𝚪𝚻𝚵𝚪 𝚳𝚵𝚴𝐔",
                  "id": "Converter Menu"
                }
              ]
            }
          ]
        })
      }
    ];

    await Matrix.sendMessage(m.from, {
      image: menuImage,
      caption: str,
      buttons: buttons,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363354023106228@newsletter',
          newsletterName: "JawadTechX",
          serverMessageId: 143
        }
      }
    }, {
      quoted: m
    });
  }
};

export default menu;