export async function before(m, { isAdmin, isBotAdmin, isOwner }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return

  let chat = global.db.data.chats[m.chat] || {} // kasih default object
  if (typeof chat.antiFoto === 'undefined') chat.antiFoto = false // default false

  let isImage = m.message?.imageMessage
  let bang = m.key.id
  let hapus = m.key.participant || m.sender

  if (chat.antiFoto && isImage) {
    if (!isBotAdmin) {
      await m.reply('*「 ANTI FOTO 」*\n\nBot bukan admin, jadi tidak bisa hapus foto.')
      return
    }

    await m.reply(`*「 ANTI FOTO 」*\n\nTerdeteksi foto dari @${m.sender.split('@')[0]}.\nFoto kamu dihapus karena admin mengaktifkan fitur antiFoto.`, {
      mentions: [m.sender]
    })

    return this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: bang,
        participant: hapus
      }
    })
  }
}
