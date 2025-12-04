import fs from 'fs'
let handler = m => m

handler.all = async function (m) {
    // Mengecek apakah pesan berasal dari chat pribadi dan merupakan panggilan
    if (!m.isGroup && (m.mtype === 'call' || m.mtype === 'videocall')) {
        // Menolak panggilan secara otomatis
        await this.reply(m.chat, `Panggilan Anda otomatis ditolak. Anda akan diblokir karena melakukan panggilan ke bot.`)

        // Memblokir pengguna setelah menolak panggilan
        await this.updateBlockStatus(m.sender, 'block')
    }
}

export default handler;
