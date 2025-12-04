let handler = m => m;

handler.before = m => {
  const tag = '@' + m.sender.split('@')[0];
  let user = global.db.data.users[m.sender];

  // Jika ada AFK2 dan hanya berlaku di grup ini
  if (user.afk2 && user.afk2.time && user.afk2.group === m.chat) {
    const duration = Math.floor((Date.now() - user.afk2.time) / 1000);
    const [hours, minutes, seconds] = [
      Math.floor(duration / 3600),
      Math.floor((duration % 3600) / 60),
      duration % 60
    ];

    conn.reply(m.chat, 
`====== [ AFK SELESAI ] ======

👤 Nama   : ${tag}
📑 Alasan : ${user.afk2.reason || "Tanpa Keterangan"}
🕒 Durasi : ${hours}j ${minutes}m ${seconds}d

=====================`, floc);

    delete user.afk2;
  }

  // Deteksi tag ke user lain yang AFK2 di grup ini
  const jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];

  for (const jid of jids) {
    const mentionedUser = global.db.data.users[jid];
    if (!mentionedUser || !mentionedUser.afk2 || mentionedUser.afk2.group !== m.chat) continue;

    const duration = Math.floor((Date.now() - mentionedUser.afk2.time) / 1000);
    const [hours, minutes, seconds] = [
      Math.floor(duration / 3600),
      Math.floor((duration % 3600) / 60),
      duration % 60
    ];

    const mentionedTag = '@' + jid.split('@')[0];

    conn.reply(m.chat,
`====== [ PENGGUNA AFK ] ======

👤 Nama   : ${mentionedTag}
📑 Alasan : ${mentionedUser.afk2.reason || "Tanpa Keterangan"}
🕒 Durasi : ${hours}j ${minutes}m ${seconds}d

=====================`, floc);
  }

  return true;
};

export default handler;
