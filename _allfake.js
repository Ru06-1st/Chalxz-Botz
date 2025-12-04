import fs from 'fs'
import moment from 'moment-timezone'

let handler = m => m
handler.all = async function (m) {
    let name = await conn.getName(m.sender) 
    let pp = 'https://telegra.ph/file/98a83fcdfdbea8be6d6b7.jpg'
    
    try {
        pp = await this.profilePictureUrl(m.sender, 'image')
    } catch (e) {}

    global.ucapan = ucapan()
    
    global.adReply = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": m.sender,
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": m.text,
    }
};

    global.fdocs = {
        key: { participant: '0@s.whatsapp.net' },
        message: {
            documentMessage: {
                title: 'ZERO - AI Assistant', 
                jpegThumbnail: fs.readFileSync('./thumbnail.jpg')
            }
        }
    }
}

export default handler

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    if (time >= 4 && time < 10) return "Selamat pagi 🌄"
    if (time >= 10 && time < 15) return "Selamat siang ☀️"
    if (time >= 15 && time < 18) return "Selamat sore 🌅"
    return "Selamat malam 🌙"
}
