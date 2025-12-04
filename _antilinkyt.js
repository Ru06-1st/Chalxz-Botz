const isLinkYT = /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)\//i;

export async function before(m, { conn, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup || !m.text) return true;

    let chat = global.db.data.chats[m.chat];
    if (!chat || !chat.antilinkyt) return true;

    const isYTLink = isLinkYT.test(m.text);
    if (!isYTLink) return true;

    let pengirim = m.key.participant || m.sender;
    let idPesan = m.key.id;
    let nama = await conn.getName(m.sender);

    if (!isBotAdmin) {
        await m.reply(`🚫 *ANTI LINK YT*\n${nama}, kamu mengirim link YouTube, tapi saya bukan admin jadi tidak bisa menghapus.`);
        return true;
    }

    await m.reply(`🚫 *ANTI LINK YT*\nLink YouTube terdeteksi dan akan dihapus.`);

    return conn.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: idPesan,
            participant: pengirim
        }
    });
}
