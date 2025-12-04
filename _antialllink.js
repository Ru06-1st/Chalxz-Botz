let handler = async (m) => m;

let linkRegex = /https?:\/\/\S+/i;

handler.before = async function (m, { isBotAdmin, isAdmin, conn }) {
    if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true; 

    let chat = global.db.data.chats[m.chat] || {}; 
    if (typeof chat.antiLinkAll === 'undefined') chat.antiLinkAll = false; 

    let isLink = linkRegex.test(m.text || ''); 

    if (chat.antiLinkAll && isLink) {
        if (isAdmin) {
            return m.reply('*「 ANTI LINK 」*\n\nLink terdeteksi, tapi kamu admin jadi tidak dihapus. 😉*');
        }

        if (!isBotAdmin) {
            return m.reply('*「 ANTI LINK 」*\n\nBot bukan admin, jadi tidak bisa menghapus pesan.*');
        }

        // Hapus pesan kalau bot admin
        await conn.sendMessage(m.chat, { delete: m.key });

        return m.reply(`*「 ANTI LINK 」*\n\nDeteksi link dari @${m.sender.split('@')[0]}.\nPesanmu sudah dihapus.`, { mentions: [m.sender] });
    }

    return false;
};

handler.group = true;

export default handler;
