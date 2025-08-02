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

const createButton = (buttonId, displayText) => ({
  buttonId,
  buttonText: { displayText: `${toFancyFont(displayText)}` },
  type: 1,
});

const kick = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (!["kick", "remove"].includes(cmd)) return;

    if (!m.isGroup) {
      const buttons = [createButton(`.menu`, "Menu")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("THIS COMMAND CAN ONLY BE USED IN GROUPS")}`,
        ...messageOptions
      }, { quoted: m });
    }

    const groupMetadata = await Matrix.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find((p) => p.id === botNumber)?.admin;
    const senderAdmin = participants.find((p) => p.id === m.sender)?.admin;

    if (!botAdmin) {
      const buttons = [createButton(`.promote`, "Promote")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("BOT NEEDS ADMIN POWERS TO KICK")}`,
        ...messageOptions
      }, { quoted: m });
    }

    if (!senderAdmin) {
      const buttons = [createButton(`.menu`, "Menu")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("YOU ARE NOT AN ADMIN")}`,
        ...messageOptions
      }, { quoted: m });
    }

    if (!m.mentionedJid) m.mentionedJid = [];
    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : text.replace(/[^0-9]/g, "").length > 0
      ? [text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"]
      : [];

    if (users.length === 0) {
      const buttons = [createButton(`.help`, "Help")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("TAG OR QUOTE SOMEONE TO KICK")}`,
        ...messageOptions
      }, { quoted: m });
    }

    const validUsers = users.filter((user) => {
      if (!user) return false;
      const isMember = participants.some((p) => p.id === user);
      const isBot = user === botNumber;
      const isSender = user === m.sender;
      return isMember && !isBot && !isSender;
    });

    if (validUsers.length === 0) {
      const buttons = [createButton(`.menu`, "Menu")];
      const messageOptions = {
        buttons,
        contextInfo: {
          mentionedJid: [m.sender],
        },
      };
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("NO VALID USERS FOUND")}`,
        ...messageOptions
      }, { quoted: m });
    }

    await Matrix.groupParticipantsUpdate(m.from, validUsers, "remove");
    const kickedNames = validUsers.map((user) => `@${user.split("@")[0]}`).join(", ");
    const buttons = [createButton(`.menu`, "Menu")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: validUsers,
      },
    };
    await Matrix.sendMessage(m.from, {
      text: `*${toFancyFont("USERS KICKED SUCCESSFULLY")}\n${kickedNames}`,
      ...messageOptions
    }, { quoted: m });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    const buttons = [createButton(`.report`, "Report")];
    const messageOptions = {
      buttons,
      contextInfo: {
        mentionedJid: [m.sender],
      },
    };
    await Matrix.sendMessage(m.from, {
      text: `*${toFancyFont("AN ERROR OCCURRED WHILE KICKING")}`,
      ...messageOptions
    }, { quoted: m });
  }
};

export default kick;