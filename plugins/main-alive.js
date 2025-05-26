const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╭─❍ *@𝕏Ե®em£~Ե𝖊𝖈𝖍_𝕏 Status@* ❍─╮
│  
│  🧑🏻‍💻 ʜɪ: *Xtreme-Tech_X on Board*
│  🕒 ᴛɪᴍᴇ: *${currentTime}*
│  📅 ᴅᴀᴛᴇ: *${currentDate}*
│  ⏳ ᴜᴘᴛɪᴍᴇ: *${runtime}*
│  ♻️ ꜱᴛᴀᴛᴜꜱ: *ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ*
│  ⚙ ᴍᴏᴅᴇ: *${config.MODE}*
│  ✨ ᴠᴇʀsɪᴏɴ: *${config.version}*
╰───────────────❍

✅ *Xtreme-Tech_X is online and operational!*
🔧 *System running smoothly!*`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: '𝕏Ե®em£~Ե𝖊𝖈𝖍_𝕏',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
