import fetch from 'node-fetch';
import ytSearch from 'yt-search';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import osCallbacks from 'os';
import config from "../config.cjs";
import pkg, { prepareWAMessageMedia } from "@whiskeysockets/baileys";
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

const streamPipeline = promisify(pipeline);
const tmpDir = osCallbacks.tmpdir();

const play = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");
   const img = 'https://files.catbox.moe/84ohd5.jpg';

     if (cmd === "play") {
      if (args.length === 0 || !args.join(" ")) {
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
       image: { url: img },
          caption: `${toFancyFont("give")} ${toFancyFont("me")} ${toFancyFont("a")} ${toFancyFont("song")} ${toFancyFont("name")} ${toFancyFont("or")} ${toFancyFont("keywords")} ${toFancyFont("to")} ${toFancyFont("search")}`,
               contextInfo: {
       forwardingScore: 999,
       isForwarded: true,
       forwardedNewsletterMessageInfo: {
        newsletterJid: '120363399999197102@newsletter',
       newsletterName: "╭••➤®Njabulo Jb",
       serverMessageId: 143
       }
               }
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
   const searchQuery = args.join(" ");
      await Matrix.sendMessage(m.from, {
      image: { url: img },
       caption: `*ɴᴊᴀʙᴜʟᴏ ᴊʙ* ${toFancyFont("huntin’")} ${toFancyFont("for")} "${searchQuery}"`,
       contextInfo: {
       forwardingScore: 999,
       isForwarded: true,
       forwardedNewsletterMessageInfo: {
        newsletterJid: '120363399999197102@newsletter',
       newsletterName: "╭••➤®Njabulo Jb",
       serverMessageId: 143
       }
       }
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

      // Search YouTube for song info
      const searchResults = await ytSearch(searchQuery);
      if (!searchResults.videos || searchResults.videos.length === 0) {
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
        image: { url: img },
        caption: `${toFancyFont("no")} ${toFancyFont("tracks")} ${toFancyFont("found")} ${toFancyFont("for")} "${searchQuery}". ${toFancyFont("you")} ${toFancyFont("slippin’")}!`,
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

      const song = searchResults.videos[0];
      const safeTitle = song.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = `${tmpDir}/${safeTitle}.mp3`;

      // Fetch download URL from the new API
      let apiResponse;
      try {
        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(searchQuery)}`;
        apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
          throw new Error(`API responded with status: ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        if (!data.status || !data.result.download_url) {
          throw new Error('API response missing download URL or failed');
        }

        // Send song info from yt-search and API
        const songInfo = `

${toFancyFont("*Njbulo Jb*")} Song Intel 🔥
${toFancyFont("*Title*")}: ${data.result.title || song.title}
${toFancyFont("*Views*")}: ${song.views.toLocaleString()}
${toFancyFont("*Duration*")}: ${song.timestamp}
${toFancyFont("*Channel*")}: ${song.author.name}
${toFancyFont("*Uploaded*")}: ${song.ago}
${toFancyFont("*URL*")}: ${data.result.video_url || song.url}
`;
          const buttons = [
          {
            buttonId: `.img ${args.join(" ")}`,
            buttonText: { displayText: ` ${toFancyFont("seach img")}` },
            type: 1,
          },
          {
            buttonId: `.lyrics ${args.join(" ")}`,
            buttonText: { displayText: ` ${toFancyFont("seach Lyrics")}` },
            type: 1,
          },
          {
            buttonId: `.yts ${args.join(" ")}`,
            buttonText: { displayText: ` ${toFancyFont("seach Yts")}` },
            type: 1,
          },
          {
            buttonId: `.video ${args.join(" ")}`,
            buttonText: { displayText: ` ${toFancyFont("seach video")}` },
            type: 1,
          },
            {
            buttonId: `.song ${args.join(" ")}`,
            buttonText: { displayText: ` ${toFancyFont("getsong")}` },
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
          caption: songInfo,
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

        // Download the audio file
        const downloadResponse = await fetch(data.result.download_url);
        if (!downloadResponse.ok) {
          throw new Error(`Failed to download audio: ${downloadResponse.status}`);
        }
       const fileStream = fs.createWriteStream(filePath);
        await streamPipeline(downloadResponse.body, fileStream);
      } catch (apiError) {
        console.error(`API error:`, apiError.message);
        const buttons = [
          {
            buttonId: `.support`,
            buttonText: { displayText: `⚠︎${toFancyFont("support")}` },
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
        image: { url: img },
         caption: `*Njabulo Jb* ${toFancyFont("couldn’t")} ${toFancyFont("hit")} ${toFancyFont("the")} ${toFancyFont("api")} ${toFancyFont("for")} "${song.title}". ${toFancyFont("server’s")} ${toFancyFont("actin’")} ${toFancyFont("up")}!`,
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


      // Send the audio file
      try {
        const doc = {
          audio: {
            url: filePath,
          },
          mimetype: 'audio/mpeg',
          ptt: false,
          fileName: `${safeTitle}.mp3`,
        };
        await Matrix.sendMessage(m.from, doc, { quoted: m });

        // Clean up temp file after 5 seconds
        setTimeout(() => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted temp file: ${filePath}`);
            }
          } catch (cleanupErr) {
            console.error('Error during file cleanup:', cleanupErr);
          }
        }, 5000);
      } catch (sendError) {
        console.error(`Failed to send audio:`, sendError.message);
        const buttons = [
          {
            buttonId: `.support`,
            buttonText: { displayText: `⚠︎${toFancyFont("support")}` },
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
       image: { url: img },
        caption: `*ɴᴊᴀʙᴜʟᴏ ᴊʙ* ${toFancyFont("can’t")} ${toFancyFont("song")} "${song.title}". ${toFancyFont("failed")} ${toFancyFont("to")} ${toFancyFont("send")} ${toFancyFont("audio")}`,
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
      await Matrix.sendMessage(m.from, {
        text: `*${song.title}* ${toFancyFont("dropped")} ${toFancyFont("by")} *Njabulo Jb*! ${toFancyFont("blast")} ${toFancyFont("it")}!`,
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
  } catch (error) {
    console.error(`❌ song error: ${error.message}`);
    const buttons = [
      {
        buttonId: `.support`,
        buttonText: { displayText: `⚠︎${toFancyFont("support")}` },
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
      text: `*ɴᴊᴀʙᴜʟᴏ ᴊʙ* ${toFancyFont("hit")} ${toFancyFont("a")} ${toFancyFont("snag")}, ${toFancyFont("fam")}! ${toFancyFont("try")} ${toFancyFont("again")} ${toFancyFont("or")} ${toFancyFont("pick")} ${toFancyFont("a")} ${toFancyFont("better")} ${toFancyFont("track")}! `,
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
};

export default play;
