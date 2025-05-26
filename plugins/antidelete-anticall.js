const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

// Initialize AntiDelete settings
initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Sets up the Antidelete feature.",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe }) => {
    if (!isCreator) return reply('⚠️ This command is only for the bot owner. ⚠️');

    try {
        const command = q?.toLowerCase();

        switch (command) {
            // Enable AntiDelete globally (both GC and DM)
            case 'on':
                await setAnti('gc', false); // Disable in Group Chats
                await setAnti('dm', false); // Disable in Direct Messages
                return reply('🔴 _AntiDelete is now OFF for Group Chats and Direct Messages._');

            // Disable AntiDelete for Group Chats
            case 'off gc':
                await setAnti('gc', false);
                return reply('❌ _AntiDelete for Group Chats is now DISABLED._');

            // Disable AntiDelete for Direct Messages
            case 'off dm':
                await setAnti('dm', false);
                return reply('❌ _AntiDelete for Direct Messages is now DISABLED._');

            // Toggle AntiDelete for Group Chats
            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus); // Toggle state
                return reply(`🔄 _AntiDelete for Group Chats is now ${!gcStatus ? 'ENABLED' : 'DISABLED'}._`);

            // Toggle AntiDelete for Direct Messages
            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus); // Toggle state
                return reply(`🔄 _AntiDelete for Direct Messages is now ${!dmStatus ? 'ENABLED' : 'DISABLED'}._`);

            // Enable AntiDelete for both Group Chats and Direct Messages
            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('✅ _AntiDelete has been ENABLED for all chats._');

            // Show current AntiDelete status
            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                return reply(`🔍 _AntiDelete Status:_\n\n*DM AntiDelete:* ${currentDmStatus ? '✅ ENABLED' : '❌ DISABLED'}\n*Group Chat AntiDelete:* ${currentGcStatus ? '✅ ENABLED' : '❌ DISABLED'}`);

            // Show Help Message for all available commands
            default:
                const helpMessage = `
                -- *AntiDelete Command Guide:* --
                • \`\`.antidelete on\`\` - 🔴 Turn OFF AntiDelete for all chats (disabled by default)
                • \`\`.antidelete off gc\`\` - ❌ Disable AntiDelete for Group Chats
                • \`\`.antidelete off dm\`\` - ❌ Disable AntiDelete for Direct Messages
                • \`\`.antidelete set gc\`\` - 🔄 Toggle AntiDelete for Group Chats
                • \`\`.antidelete set dm\`\` - 🔄 Toggle AntiDelete for Direct Messages
                • \`\`.antidelete set all\`\` - ✅ Enable AntiDelete for all chats
                • \`\`.antidelete status\`\` - 🔍 Check current AntiDelete status`;

                return reply(helpMessage);
        }
    } catch (e) {
        console.error("⚠️ Error in antidelete command:", e);
        return reply("❌ An error occurred while processing your request.");
    }
});

cmd({
    pattern: "anticall",
    alias: ['retrive', '🔥'],
    desc: "decline all calls❗❌❌.",
    category: "misc",
    use: '<query>',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const quotedMessage = m.msg.contextInfo.quotedMessage; // Get the quoted message

        // Check if it's a ViewOnce message
        if (quotedMessage && quotedMessage.anticall) {
            const quot = quotedMessage.anticall;

            if (quot.message.callhandler) {
                let caption = quot.message.imageMessage.caption;
                let media = await conn.downloadAndSaveMediaMessage(quot.message.imageMessage);
                return conn.sendMessage(from, { image: { url: media }, caption }, { quoted: mek });
            }

            if (quot.message.videoMessage) {
                let caption = quot.message.videoMessage.caption;
                let media = await conn.downloadAndSaveMediaMessage(quot.message.videoMessage);
                return conn.sendMessage(from, { video: { url: media }, caption }, { quoted: mek });
            }

            if (quot.message.audioMessage) {
                let media = await conn.downloadAndSaveMediaMessage(quot.message.audioMessage);
                return conn.sendMessage(from, { audio: { url: media } }, { quoted: mek });
            }
        }

        // If there is no quoted message or it's not a ViewOnce message
        if (!m.quoted) return reply("⚠️ Please reply to a ViewOnce message.");

        if (m.quoted.mtype === "viewOnceMessage") {
            if (m.quoted.message.imageMessage) {
                let caption = m.quoted.message.imageMessage.caption;
                let media = await conn.downloadAndSaveMediaMessage(m.quoted.message.imageMessage);
                return conn.sendMessage(from, { image: { url: media }, caption }, { quoted: mek });
            } else if (m.quoted.message.videoMessage) {
                let caption = m.quoted.message.videoMessage.caption;
                let media = await conn.downloadAndSaveMediaMessage(m.quoted.message.videoMessage);
                return conn.sendMessage(from, { video: { url: media }, caption }, { quoted: mek });
            } else if (m.quoted.message.audioMessage) {
                let media = await conn.downloadAndSaveMediaMessage(m.quoted.message.audioMessage);
                return conn.sendMessage(from, { audio: { url: media } }, { quoted: mek });
            }
        } else {
            return reply("❌ This is not a valid ViewOnce message.");
        }
    } catch (e) {
        console.log("⚠️ Error in vv3:", e);
        reply("❌ An error occurred while fetching the ViewOnce message.");
    }
});

const { cmd } = require("../command");

cmd({
  pattern: "vv",
  alias: ["viewonce", 'retrive'],
  react: '👾',
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isOwner }) => {
  try {
    if (!isOwner) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a view once message!*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    await client.sendMessage(from, messageContent, options);
  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message
    }, { quoted: message });
  }
});


// Credit: YourName | GitHub: github.com/YourHandle
