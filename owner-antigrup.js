import fs from 'fs'
import path from 'path'
import { areJidsSameUser } from '@whiskeysockets/baileys' // ganti adiwajshing → whiskeysockets

const dbFolder = './database'
const antiGroupPath = path.join(dbFolder, 'antigroup.json')

if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true })
if (!fs.existsSync(antiGroupPath)) fs.writeFileSync(antiGroupPath, JSON.stringify({ active: false }, null, 4))

const loadAntiGroup = () => {
    try {
        return JSON.parse(fs.readFileSync(antiGroupPath, 'utf-8')) || {}
    } catch (e) {
        console.error("Error loading antigroup data:", e)
        return { active: false }
    }
}
const saveAntiGroup = (data) => fs.writeFileSync(antiGroupPath, JSON.stringify(data, null, 4), 'utf-8')

let antiGroup = loadAntiGroup()

async function resolveAndCleanJid(inputJid, conn, groupParticipants = []) {
    if (inputJid.endsWith('@s.whatsapp.net')) {
        return inputJid
    }

    if (inputJid.endsWith('@lid')) {
        let resolved = groupParticipants.find(p => areJidsSameUser(p.id, inputJid) || areJidsSameUser(p.jid, inputJid))
        if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
            return resolved.jid
        }

        try {
            const [res] = await conn.onWhatsApp(inputJid)
            if (res?.exists) {
                return res.jid
            }
        } catch {}
    }
    return inputJid
}

let handler = async (m, { conn, args, isOwner }) => {
    if (!isOwner) return m.reply('❌ Hanya owner yang bisa mengaktifkan/mematikan fitur ini!')
    if (!args[0]) return m.reply('⚠️ Gunakan perintah: *.antigroup on / off*')

    if (args[0] === 'on') {
        antiGroup.active = true
        saveAntiGroup(antiGroup)
        m.reply('🍏 Fitur *Anti Grup* telah AKTIF.\nSekarang bot hanya akan merespons *owner* dan *admin grup* di dalam grup.\n> Ubed Bot 2025')
    } else if (args[0] === 'off') {
        antiGroup.active = false
        saveAntiGroup(antiGroup)
        m.reply('❌ Fitur *Anti Grup* telah DINONAKTIFKAN.')
    } else {
        m.reply('⚠️ Pilih: *on* / *off*')
    }
}

handler.before = async (m, { conn, isOwner, isAdmin, participants }) => {
    if (!antiGroup.active) return
    if (!m.isGroup) return

    let groupParticipants = participants
    if (!groupParticipants || groupParticipants.length === 0) {
        const metadata = await conn.groupMetadata(m.chat).catch(() => null)
        if (metadata) groupParticipants = metadata.participants
    }
    const senderJid = await resolveAndCleanJid(m.sender, conn, groupParticipants)

    const isSenderOwner = isOwner
    let isSenderAdmin = false
    if (m.isGroup) {
        const participantInfo = groupParticipants.find(p => areJidsSameUser(p.id, senderJid))
        if (participantInfo && participantInfo.admin) {
            isSenderAdmin = true
        }
    }

    if (isSenderOwner || isSenderAdmin) {
        return true
    }

    return false
}

handler.command = ['antigroup', 'antigrup']
handler.rowner = true

export default handler
