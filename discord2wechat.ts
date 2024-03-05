import type * as PUPPET from 'wechaty-puppet'

import PuppetXp from './src/mod.js'
import qrcodeTerminal from 'qrcode-terminal'
import Discord from 'discord.js-self'
import {FileBox} from 'file-box'
// import config
import d2w from './config/d2w.json' assert {type: "json"}

const token = d2w.token
const discordChannel = d2w.discordChannel
const wechatTarget = d2w.wechatTarget
const logWechatMsg = d2w.logWechatMsg
const logDiscordMsg = d2w.logDiscordMsg

var discordReady = false
var wechatReady = false
var forwardCount = 0

// declare discord client
const client = new Discord.Client()

// declare bot for wechat
const puppet = new PuppetXp()

// register events
puppet
  .on('logout', onLogout)
  .on('login', onLogin)
  .on('scan', onScan)
  .on('error', onError)
  .on('message', onMessage)

// start bot
puppet.start()
  .catch(async e => {
    console.error('Bot start() fail:', e)
    await puppet.stop()
    process.exit(-1)
  })

// event
function onScan(payload: PUPPET.payloads.EventScan) {
  if (payload.qrcode) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(payload.qrcode),
    ].join('')
    console.info('StarterBot', 'onScan: %s(%s) - %s', payload.status, qrcodeImageUrl)

    qrcodeTerminal.generate(payload.qrcode, {small: true})  // show qrcode on console
    console.info(`[${payload.status}] ${payload.qrcode}\nScan QR Code above to log in: `)
  } else {
    console.info(`[${payload.status}]`)
  }
}

function onLogin(payload: PUPPET.payloads.EventLogin) {
  wechatReady = true;
  console.info(`${payload.contactId} login\n`)
  console.warn('Wechat Bot is ready to send messages.');
  logStatus();
}

function onLogout(payload: PUPPET.payloads.EventLogout) {
  console.info(`${payload.contactId} logouted`)
}

function onError(payload: PUPPET.payloads.EventError) {
  console.error('Bot error:', payload.data)
}

function logStatus() {
  const msg = `
  [STATUS] Discord: ${discordReady}
  [STATUS] Wechat: ${wechatReady}
  `
  console.warn(msg)
  if (discordReady && wechatReady) {
    console.log(`Discord2Wechat is ready: Discord[${discordChannel}] -> Wechat[${wechatTarget}]
    \t logDiscordMsg: [${logDiscordMsg}] logWechatMsg: [${logWechatMsg}]
    `);
  }
}

// wechat message
async function onMessage({
                           messageId,
                         }: PUPPET.payloads.EventMessage) {
  const {
    talkerId,
    roomId,
    text,
  } = await puppet.messagePayload(messageId)

  if (logWechatMsg) {
    console.log(`[Wechat] ${roomId || ''} | ${talkerId || ''} : ${text || ''}`)
  }
}

const welcome = `
Discord2Wechat Version: 1.0.0

Login in wechat...
`
console.info(welcome)

// discord client
client.on('ready', () => {
  discordReady = true;
  console.warn('Discord Bot is ready to receive messages.');
  logStatus();
});

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function onDiscordMessage(msg) {
  if (msg.channel.id == discordChannel) {
    if (logDiscordMsg) {
      console.log(`[Discord] ${msg.author.username}#${msg.author.discriminator}: ${msg.content}`)
      if (msg.attachments) {
        msg.attachments.forEach(function (attchment) {
          console.log(`[+Attachment] ${msg.author.username}#${msg.author.discriminator}: ${attchment.url}`)
        })
      }
    }

    await puppet.messageSendText(wechatTarget, msg.content)
    if (msg.attachments) {
      await Promise.all(msg.attachments.map(async (attchment) => {
        await puppet.messageSendFile(wechatTarget, FileBox.fromUrl(attchment.url))
        // use delay to avoid congestion
        await delay(1000)
      }));
    }
    forwardCount += 1
    console.log(`[Discord2Wechat] Forward messages count: ${forwardCount}`)
  }
}

client.on('message', onDiscordMessage);

client.login(token)
