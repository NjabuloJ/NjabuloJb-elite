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

const invite = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['invite', 'add'];

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

    const botNumber = await gss.decodeJid(gss.user.id);
    const groupMetadata = await gss.groupMetadata(m.from);
    const isBotAdmins = groupMetadata.participants.find(p => p.id === botNumber)?.admin;

    if (!isBotAdmins) {
      const buttons = [createButton(`.promote`, "Promote")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return gss.sendMessage(m.from, { text: `*${toFancyFont("BOT MUST BE AN ADMIN TO USE THIS COMMAND")}`, ...messageOptions });
    }

    if (!text) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return gss.sendMessage(m.from, { text: `*${toFancyFont("ENTER THE NUMBER YOU WANT TO INVITE TO THE GROUP")}\n\n${toFancyFont("Example: ")}${prefix + cmd} 923427582273`, ...messageOptions });
    }

    if (text.includes('+')) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return gss.sendMessage(m.from, { text: `*${toFancyFont("ENTER THE NUMBER TOGETHER WITHOUT +")}`, ...messageOptions });
    }

    if (isNaN(text)) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return gss.sendMessage(m.from, { text: `*${toFancyFont("ENTER ONLY THE NUMBERS PLUS YOUR COUNTRY CODE WITHOUT SPACES")}`, ...messageOptions });
    }

    const link = 'https://chat.whatsapp.com/' + await gss.groupInviteCode(m.from);
    const inviteMessage = `≡ *${toFancyFont("GROUP INVITATION")}*\n\n${toFancyFont("A USER INVITES YOU TO JOIN THE GROUP")} "${groupMetadata.subject}".\n\n${toFancyFont("Invite Link: ")}${link}\n\n${toFancyFont("INVITED BY: ")}@${m.sender.split('@')[0]}`;

    await gss.sendMessage(`${text}@s.whatsapp.net`, { text: inviteMessage, mentions: [m.sender] });
    const buttons = [createButton(`.menu`, "Menu")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    gss.sendMessage(m.from, { text: `*${toFancyFont("AN INVITE LINK IS SENT TO THE USER")}`, ...messageOptions });

  } catch (error) {
    console.error('Error:', error);
    const buttons = [createButton(`.report`, "Report")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    gss.sendMessage(m.from, { text: `*${toFancyFont("An error occurred while processing the command")}`, ...messageOptions });
  }
};

export default invite;