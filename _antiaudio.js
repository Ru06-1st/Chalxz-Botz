export async function before(m, { isAdmin, isOwner, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true;
  if (!m.isGroup) return true;

  let chat = global.db.data.chats[m.chat];
  if (!chat?.antiAudio) return true;

  let isVN = m.message?.audioMessage;
  if (!isVN) return true;

  let bang = m.key.id;
  let hapus = m.key.participant || m.sender;

  // Jika admin atau owner, beri tahu tapi jangan hapus
  if (isAdmin || isOwner) {
    await m.reply(`*「 ANTI VN 」*\nTerdeteksi voice note, tapi kamu adalah *${isOwner ? 'Owner' : 'Admin'}*, jadi tidak akan dihapus.`);
    return true;
  }

  // Jika bot bukan admin, tidak bisa hapus
  if (!isBotAdmin) return true;

  await m.reply(`*「 ANTI VN 」*\nVoice note terdeteksi dan akan dihapus karena fitur antiAudio aktif.`);

  return this.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: bang,
      participant: hapus
    }
  });
}
