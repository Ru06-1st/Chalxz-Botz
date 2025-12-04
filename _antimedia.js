export async function before(m, { conn, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return

  let chat = global.db.data.chats[m.chat] || {}
  if (typeof chat.antimedia === 'undefined') chat.antimedia = false // default false

  if (!chat.antimedia) return // Cek apakah fitur aktif

  // Daftar tipe pesan media
  const mediaTypes = [
    'imageMessage',
    'videoMessage',
    'audioMessage',
    'stickerMessage',
    'documentMessage',
    'contactMessage',
    'contactArrayMessage',
    'productMessage',
    'locationMessage',
    'liveLocationMessage',
    'fileMessage',
  ]

  let msgType = Object.keys(m.message || {})[0]
  if (!mediaTypes.includes(msgType)) return

  if (!isBotAdmin) {
    await m.reply('*「 ANTI MEDIA 」*\n\nBot bukan admin, jadi tidak bisa menghapus media.')
    return
  }

  await m.reply(`*「 ANTI MEDIA 」*\n\nTerdeteksi media dari @${m.sender.split('@')[0]}.\nPesanmu dihapus karena fitur *antiMedia* aktif.`, { mentions: [m.sender] })

  return conn.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: m.key.id,
      participant: m.key.participant || m.sender
    }
  })
}
