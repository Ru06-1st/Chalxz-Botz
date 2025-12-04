import baileys from '@whiskeysockets/baileys'
const { jidNormalizedUser } = baileys

var handler = async (m, { text, conn }) => {
  let sender = jidNormalizedUser(m.sender) // normalize JID/LID
  let user = global.db.data.users[sender]

  user.afk = +new Date
  user.afkReason = text || ''
  
  m.reply(`${conn.getName(sender)} AFK ${text ? 'Dengan Alasan: ' + text : 'Tanpa Alasan'}`)
}

handler.help = ['afk']
handler.tags = ['main']
handler.command = /^afk$/i
handler.group = true

export default handler
