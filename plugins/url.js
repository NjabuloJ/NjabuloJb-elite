import fetch from "node-fetch";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
import { writeFile, unlink } from "fs/promises";
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

const MAX_FILE_SIZE_MB = 200;

async function uploadMedia(buffer) {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, `file.${ext}`);
    bodyForm.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.text();
    return data;
  } catch (error) {
    console.error("Error during media upload:", error);
    throw new Error("Failed to upload media");
  }
}

const tourl = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const validCommands = ["tourl", "geturl", "upload", "url"];

    if (!validCommands.includes(cmd)) return;

    if (!m.quoted || !["imageMessage", "videoMessage", "audioMessage"].includes(m.quoted.mtype)) {
      const buttons = [
        {
          buttonId: 'menu',
          buttonText: { displayText: toFancyFont('Menu') },
          type: 1,
        },
      ];
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("Yo, Toxic-MD needs a quoted image, video, or audio, fam!")}* 📸🎥🎵`,
        buttons,
      }, { quoted: m });
    }

    const loadingMessages = [
      "*「▰▱▱▱▱▱▱▱▱▱」*",
      "*「▰▰▱▱▱▱▱▱▱▱」*",
      "*「▰▰▰▱▱▱▱▱▱▱」*",
      "*「▰▰▰▰▱▱▱▱▱▱」*",
      "*「▰▰▰▰▰▱▱▱▱▱」*",
      "*「▰▰▰▰▰▰▱▱▱▱」*",
      "*「▰▰▰▰▰▰▰▱▱▱」*",
      "*「▰▰▰▰▰▰▰▰▱▱」*",
      "*「▰▰▰▰▰▰▰▰▰▱」*",
      "*「▰▰▰▰▰▰▰▰▰▰」*",
    ];

    const loadingMessageCount = loadingMessages.length;
    let currentMessageIndex = 0;

    const { key } = await Matrix.sendMessage(
      m.from,
      { text: `*${toFancyFont("Toxic-MD")} uploadin’ your media...* ${loadingMessages[currentMessageIndex]} 🚀` },
      { quoted: m }
    );

    const loadingInterval = setInterval(async () => {
      currentMessageIndex = (currentMessageIndex + 1) % loadingMessageCount;
      await Matrix.sendMessage(
        m.from,
        { text: `*${toFancyFont("Toxic-MD")} uploadin’ your media...* ${loadingMessages[currentMessageIndex]} 🚀` },
        { quoted: m, messageId: key }
      );
    }, 500);

    const media = await m.quoted.download();
    if (!media) {
      clearInterval(loadingInterval);
      throw new Error("Failed to download media");
    }

    const fileSizeMB = media.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      clearInterval(loadingInterval);
      const buttons = [
        {
          buttonId: 'menu',
          buttonText: { displayText: toFancyFont('Menu') },
          type: 1,
        },
      ];
      return Matrix.sendMessage(m.from, {
        text: `*${toFancyFont("File’s too big, fam!")} Max is ${MAX_FILE_SIZE_MB}MB. 😣`,
        buttons,
      }, { quoted: m });
    }

    const mediaUrl = await uploadMedia(media);

    clearInterval(loadingInterval);
    const buttons = [
      {
        buttonId: 'menu',
        buttonText: { displayText: toFancyFont('Menu') },
        type: 1,
      },
    ];
    await Matrix.sendMessage(
      m.from,
      {
        text: `*${toFancyFont("Toxic-MD")} upload done, fam!* ✅`,
        buttons,
      },
      { quoted: m }
    );

    const mediaType = getMediaType(m.quoted.mtype);
    if (mediaType === "audio") {
      await Matrix.sendMessage(
        m.from,
        {
          text: `*${toFancyFont("Toxic-MD")} got your audio URL, fam!* 🎵\n*${toFancyFont("URL")}:* ${mediaUrl}`,
          buttons,
        },
        { quoted: m }
      );
    } else {
      await Matrix.sendMessage(
        m.from,
        {
          [mediaType]: { url: mediaUrl },
          caption: `*${toFancyFont("Toxic-MD")} got your ${mediaType} URL, fam!* 📸🎥\n*${toFancyFont("URL")}:* ${mediaUrl}`,
          buttons,
        },
        { quoted: m }
      );
    }
  } catch (error) {
    clearInterval(loadingInterval);
    console.error(`❌ Tourl error: ${error.message}`);
    const buttons = [
      {
        buttonId: 'menu',
        buttonText: { displayText: toFancyFont('Menu') },
        type: 1,
      },
    ];
    await Matrix.sendMessage(m.from, {
      text: `*${toFancyFont("Toxic-MD")} hit a snag uploadin’, fam!* Try again! 😈`,
      buttons,
    }, { quoted: m });
  }
};

const getMediaType = (mtype) => {
  switch (mtype) {
    case "imageMessage":
      return "image";
    case "videoMessage":
      return "video";
    case "audioMessage":
      return "audio";
    default:
      return null;
  }
};

export default tourl;