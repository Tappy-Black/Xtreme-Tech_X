
const { cmd } = require("../command");
const moment = require("moment");

let botStartTime = Date.now(); // Enregistrement de l'heure de démarrage du bot
const ALIVE_IMG = "https://files.catbox.moe/3hrxbh.jpg"; // Assurez-vous que cette URL est valide

cmd({
    pattern: "alive",
    desc: "Check if the bot is active.",
    category: "info",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User"; // Nom de l'utilisateur ou valeur par défaut
        const currentTime = moment().format("HH:mm:ss");
        const currentDate = moment().format("dddd, MMMM Do YYYY");

        const runtimeMilliseconds = Date.now() - botStartTime;
        const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
        const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
        const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

        const formattedInfo = `
╭─❍ *𝕏Ե®em£~Ե𝖊𝖈𝖍_𝕏 Status* ❍─╮
│  
│  🧑🏻‍💻 ʜɪ: *${pushname}*
│  🕒 ᴛɪᴍᴇ: *${currentTime}*
│  📅 ᴅᴀᴛᴇ: *${currentDate}*
│  ⏳ ᴜᴘᴛɪᴍᴇ: *${runtime}*
│  ♻️ ꜱᴛᴀᴛᴜꜱ: ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ
│  ⚙ ᴍᴏᴅᴇ: *${config.MODE}*
│  ✨ ᴠᴇʀsɪᴏɴ: *4.0.0 Mᴇᴛᴀ*
╰───────────────❍

✅ *Xtreme-Tech_X is online and operational!*
🔧 *System running smoothly!*
        `.trim();

        // Vérifier si l'image est définie
        if (!ALIVE_IMG || !ALIVE_IMG.startsWith("http")) {
            throw new Error("Invalid ALIVE_IMG URL. Please set a valid image URL.");
        }

        // Envoyer le message avec image et légende
        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG }, // Assurez-vous que l'URL est valide
            caption: formattedInfo,
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

    } catch (error) {
        console.error("Error in alive command: ", error);
        
        // Répondre avec des détails de l'erreur
        const errorMessage = `
❌ An error occurred while processing the alive command.
🛠 *Error Details*:
${error.message}

Please report this issue or try again later.
        `.trim();
        return reply(errorMessage);
    }
});
