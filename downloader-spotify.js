import axios from "axios"

const BASE = "https://sssspotify.com"
const API = BASE + "/api/download/get-url"

const UA =
  "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36"

async function spotifyFetch(url) {
  const { data } = await axios.post(
    API,
    { url },
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": UA,
        Origin: BASE,
        Referer: BASE + "/"
      }
    }
  )

  if (data?.originalVideoUrl?.startsWith("/")) {
    data.originalVideoUrl = BASE + data.originalVideoUrl
  }

  if (!data?.originalVideoUrl) {
    throw new Error("Gagal mendapatkan link download")
  }

  return {
    code: data.code,
    title: data.title,
    author: data.authorName,
    cover: data.coverUrl,
    download: data.originalVideoUrl
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text)
      return m.reply(
        `*Contoh:*\n${usedPrefix + command} https://open.spotify.com/track/xxxx`
      )

    await conn.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    })

    const res = await spotifyFetch(text)

    const caption = `
🎧 *Spotify Downloader*

• *Judul*   : ${res.title}
• *Artist*  : ${res.author || "-"}
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: res.cover },
        caption
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: res.download },
        mimetype: "audio/mpeg",
        ptt: false
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    m.reply("*❌ Gagal memproses Spotify*")
  } finally {
    await conn.sendMessage(m.chat, {
      react: { text: "", key: m.key }
    })
  }
}

handler.help = ["spotify"]
handler.tags = ["downloader"]
handler.command = /^(spotify)$/i
handler.limit = true;

export default handler
