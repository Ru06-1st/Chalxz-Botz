let handler = m => m;

let linkRegex = /https?:\/\/whatsapp\.com\/channel\//i;
let groupLinkRegex = /https?:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

handler.before = async function (m, { conn, isBotAdmin, isAdmin, isOwner }) {
  if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true;

  let chatId = m.chat;
  let groupData = global.db.data.chats[chatId] || {};  
  if (typeof groupData.antiLink === 'undefined') groupData.antiLink = false;  
  if (!groupData.users) groupData.users = {};  

  let text = m.text || '';

  // Jika fitur antiLink tidak aktif atau bukan link yang dimaksud
  if (!groupData.antiLink || !(linkRegex.test(text) || groupLinkRegex.test(text))) return false;

  let sender = m.sender;
  let tag = '@' + sender.split('@')[0];

  // Jika admin atau owner kirim link
  if (isAdmin || isOwner) {
    await m.reply(`*「 ANTI LINK 」*\n\nTerdeteksi link dari ${tag}, tapi kamu adalah *${isOwner ? 'Owner' : 'Admin'}*, jadi link tidak dihapus.`);
    return true;
  }

  // Inisialisasi data user kalau belum ada
  if (!groupData.users[sender]) groupData.users[sender] = { warn: 0 };

  // Tambahkan peringatan
  groupData.users[sender].warn += 1;

  await m.reply(`*「 ANTI LINK 」*\n\nTerdeteksi link dari *${tag}*!\n\nWarn kamu: *${groupData.users[sender].warn}/5*\n\n> Jika mencapai 5, kamu akan dikeluarkan dari grup!`);

  // Hapus pesan jika bot admin
  if (isBotAdmin) {
    await conn.sendMessage(m.chat, { delete: m.key });
  }

  // Kick jika sudah 5 peringatan
  if (groupData.users[sender].warn >= 5) {
    await m.reply(`*「 ANTI LINK 」*\n\n*${tag}* sudah mencapai 5 peringatan dan akan dikeluarkan dari grup.`);
    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
    groupData.users[sender].warn = 0; // reset warn
  }

  return true;
};

export default handler;
