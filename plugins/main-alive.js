const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["av", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Get system info
        const platform = "Heroku Platform"; // Fixed deployment platform
        const release = os.release(); // OS version
        const cpuModel = os.cpus()[0].model; // CPU info
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2); // Total RAM in MB
        const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Used RAM in MB

        // Stylish and detailed system status message
        const status = `╭───❰ *𝗫𝗧𝗥𝗘𝗠𝗘-𝗧𝗘𝗖𝗛_𝗫* ❱──┈⊷
┃ *✨𝖴ᴘᴛɪᴍᴇ* : *${runtime(process.uptime())}*
┃ *💾 𝖱ᴀᴍ ᴜsᴀɢᴇ* : *${usedMem}MB / ${totalMem}MB*
┃ *🧑‍💻𝖣ᴇᴘʟᴏʏᴇᴅ ᴏɴ* : *${platform}*
┃ *👨‍💻𝖮ᴡɴᴇʀ* : *Ⴊl𐌀Ꮳk𐌕𐌀ႲႲჄ*
┃ *🧬𝖵ᴇʀsɪᴏɴ* : *4.𝟢.𝟢 𝖡𝖤𝖳𝖠*
╰──────────────────────┈⊷
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ xᴛʀᴇᴍᴇ-ᴛᴇᴄʜ_x`;

        // Send image + caption + audio combined
        await conn.sendMessage(from, { 
            image: { url: `https://files.catbox.moe/3hrxbh.jpg` },  
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363369453603973@newsletter',
                    newsletterName: '𝕏Ե®em£~Ե𝖊𝖈𝖍_𝕏',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Attach audio within the same "quoted" message for grouping
        await conn.sendMessage(from, { 
            audio: { url: 'https://files.catbox.moe/ddmjyy.mp3' },
            mimetype: 'audio/mp4',
            ptt: true 
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`🚨 *An error occurred:* ${e.message}`);
    }
});
