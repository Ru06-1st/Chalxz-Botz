let handler = m => m;

// Regex untuk semua link
let allLinkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;

handler.before = async function (m, { conn, isBotAdmin, isAdmin, isOwner }) {
  if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true;

  let chatId = m.chat;
  let chat = global.db.data.chats[chatId] || {};

  // Pastikan ada default value
  if (typeof chat.antiLinkAll === 'undefined') chat.antiLinkAll = false;

  let text = m.text || '';
  
  if (!chat.antiLinkAll || !allLinkRegex.test(text)) return false;

  let sender = m.sender;
  let tag = '@' + sender.split('@')[0];

  if (isAdmin || isOwner) {
    await m.reply(`*「 ANTI LINK 」*\n\nTerdeteksi link dari ${tag}, tapi kamu adalah *${isOwner ? 'Owner' : 'Admin'}* bot, jadi link tidak dihapus.`);
    return true;
  }

  if (isBotAdmin) {
    await conn.sendMessage(m.chat, { delete: m.key });
  }

  let users = global.db.data.users;
  if (!users[sender]) users[sender] = {};
  if (!users[sender].warn) users[sender].warn = 0;

  users[sender].warn += 1;

  await m.reply(`*「 ANTI LINK 」*\n\nTerdeteksi link dari *${tag}*! Pesanmu akan dihapus.\n\nWarn kamu: *${users[sender].warn}/5*\n\n> Jika mencapai 5, kamu akan dikeluarkan dari grup!`);

  if (users[sender].warn >= 5) {
    if (!isBotAdmin) {
      await m.reply(`*「 ANTI LINK 」*\n\nMaaf, bot bukan admin jadi tidak bisa mengeluarkan *${tag}*.`);
      return true;
    }
    await m.reply(`*「 ANTI LINK 」*\n\n*${tag}* telah mencapai 5 peringatan dan akan dikeluarkan dari grup.`);
    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
    users[sender].warn = 0;
  }

  return true;
};

handler.group = true;

export default handler;
