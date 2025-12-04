export async function before(m, { conn, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true;
  if (!m.isGroup) return true;

  // Pastikan selalu ada data chat
  let chat = global.db.data.chats[m.chat] || {};
  if (typeof chat.antiNewsletter === "undefined") chat.antiNewsletter = false;
  global.db.data.chats[m.chat] = chat;

  if (!chat.antiNewsletter) return true;

  let pengirim = m.key.participant || m.sender;
  let idPesan = m.key.id;
  let nama = await conn.getName(pengirim);

  // Deteksi pesan newsletter
  const isForwardedNewsletter =
    m.message?.extendedTextMessage?.contextInfo?.forwardedNewsletterMessageInfo ||
    m.message?.imageMessage?.contextInfo?.forwardedNewsletterMessageInfo ||
    m.message?.videoMessage?.contextInfo?.forwardedNewsletterMessageInfo ||
    m.message?.documentMessage?.contextInfo?.forwardedNewsletterMessageInfo;

  const isRawNewsletterText =
    typeof m.text === "string" && /@newsletter/.test(m.text);

  if (!isForwardedNewsletter && !isRawNewsletterText) return true;

  if (!isBotAdmin) {
    await m.reply(
      `🚫 *ANTI NEWSLETTER*\n${nama}, kamu mengirim pesan newsletter, tapi saya bukan admin jadi tidak bisa menghapus.`
    );
    return true;
  }

  await m.reply(`🚫 *ANTI NEWSLETTER*\nPesan newsletter terdeteksi dan akan dihapus.`);

  return conn.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: idPesan,
      participant: pengirim,
    },
  });
}
