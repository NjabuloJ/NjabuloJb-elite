import moment from 'moment-timezone';
import config from '../config.cjs';
export default async function GroupParticipants(sock, { id, participants, action }) {
   try {
      const metadata = await sock.groupMetadata(id)

      // participants
      for (const jid of participants) {
         // get profile picture user
         let profile
         try {
            profile = await sock.profilePictureUrl(jid, "image")
         } catch {
            profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu"
         }

         // action
         if (action == "add" && config.WELCOME ) {
           const userName = jid.split("@")[0];
                    const joinTime = moment.tz('Asia/Kolkata').format('HH:mm:ss');
                    const joinDate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY');
                    const membersCount = metadata.participants.length;
            sock.sendMessage(id, {
               text: `> Hello @${userName}! Welcome to *${metadata.subject}*.\n> You are the ${membersCount}th member.\n> Joined at: ${joinTime} on ${joinDate}"`,  
               contextInfo: {
                  mentionedJid: [jid],
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363345407274799@newsletter',
                  newsletterName: "╭••➤®Njabulo Jb",
                  serverMessageId: 143,
                  },
                  forwardingScore: 999, // Score to indicate it has been forwarded
                  externalAdReply: {
                  title: "ɳᴊᴀʙᴜʟᴏ ᴊʙ σғғɪᴄᴇ",
                  body: "ɴᴊᴀʙᴜʟᴏ ᴊʙ ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ ᴡʜᴀᴛꜱᴀᴩᴩ ʙᴏᴛ",
                  thumbnailUrl: 'https://files.catbox.moe/jkzixp.jpg', // Add thumbnail URL if required 
                  sourceUrl: 'https://whatsapp.com/channel/0029VarYP5iAInPtfQ8fRb2T', // Add source URL if necessary
                  mediaType: 1,
                  renderLargerThumbnail: true 
                  }
               }
            })
         } else if (action == "remove" && config.WELCOME ) {
           const userName = jid.split('@')[0];
                    const leaveTime = moment.tz('Asia/Kolkata').format('HH:mm:ss');
                    const leaveDate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY');
                    const membersCount = metadata.participants.length;
            sock.sendMessage(id, {
               text: `> Goodbye @${userName} from ${metadata.subject}.\n> We are now ${membersCount} in the group.\n> Left at: ${leaveTime} on ${leaveDate}"`, contextInfo: {
                  mentionedJid: [jid],
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363345407274799@newsletter',
                  newsletterName: "╭••➤®Njabulo Jb",
                  serverMessageId: 143,
                  },
                  forwardingScore: 999, // Score to indicate it has been forwarded
                  externalAdReply: {
                  title: "leave",
                  body: "Goodbye will gona miss you🤬",
                  thumbnailUrl: profile,
                  sourceUrl: 'https://whatsapp.com/channel/0029VarYP5iAInPtfQ8fRb2T', // Add source URL if necessary
                  mediaType: 1,
                  renderLargerThumbnail: true 
                  
                  }
               }
            })
         }
      }
   } catch (e) {
      throw e
   }
}
