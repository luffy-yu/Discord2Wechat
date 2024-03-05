# Discord2Wechat
## Auto Forward Discord Message to Wechat

![d2w.png](./docs/d2w.png "Discord2Wechat")

## Environment
- **Windows**
- [Node.js](https://nodejs.org)
> Worked on windows v18.12.0. Untested on other versions.
- [WeChat-v3.9.2.23](https://github.com/tom-snow/wechat-windows-versions/releases/download/v3.9.2.23/WeChatSetup-3.9.2.23.exe)
> **Decline all automatic update notice to prevent Wechat from updating!**

## How to Start

### Install & Clone
- Install [WeChat-v3.9.2.23](https://github.com/tom-snow/wechat-windows-versions/releases/download/v3.9.2.23/WeChatSetup-3.9.2.23.exe)
- Install Node.js
- Clone this repository

`git clone https://github.com/luffy-yu/Discord2Wechat.git`

###  Config
- The configuration file is `{ROOT}/config/d2w.json`
  ```json
  "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "discordChannel": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  "wechatTarget": "xxxxxxxxxxxxxxxxxxxxxx",
  "logWechatMsg": false,
  "logDiscordMsg": false
  ```
  
  - `token` [String] is the Discord token.
  - `discordChannel` [String] is the channel where messages are from.
  - `wechatTarget` [String] is the target person/group where messages will be sent to.
  - `logWechatMsg` [false/true] whether to show Wechat messages (**All received Wechat messsages**) on the terminal window.
  - `logDiscordMsg` [false/true] whether to show Discord messages on the terminal window.

> Tip: How to get (Discord) token?
```
- Open https://discord.com/ On Chrome
- Press F12
- Switch to Network pannel
- Press Ctrl + E to recording network activity
- Login in
- Search auth/login in the Network pannel
- Click that and then click Response
- Copy token
```

> Tip: How to get wechatTarget?
```
- Set logWechatMsg to true
- Run Wechat windows
- Run Discord2Wechat and watch the terminal output
  - If the target is a person, let that person send a message to you.
    - e.g., [Wechat]  | wxid_abcdefghij : Hello
    - Then wxid_abcdefghij is the expected wechatTarget.
  - If the target is a group chat, let someone send a message to that group.
    - e.g., [Wechat] 123456789@chatroom | wxid_abcdefghij : ?
    - The 123456789@chatroom is the expected wechatTarget.
- Update wechatTarget in the config file
- [Optional] Set logWechatMsg to false
- Run Discord2Wechat
```

> What if I wanna Discord2Wechat to forward messages from multiple Discord channels?
> - Send them to a SINGLE discord channel first via [Discord2Discord](https://github.com/luffy-yu/Discord2Discord).

### Run

#### Open Wechat windows and login

#### Run Discord2Wechat
- First Run
```
cd Discord2Wechat
npm install
npm start 
```

- Non-first Run
```
cd Discord2Wechat
npm start
```

- **Shortcut**

  - Create a cmd file on desktop named `d2w.cmd`
  - Write the following content (Remember to replace the 2nd line with the real path)
  ```
  D:
  cd D:\Discord2Wechat
  npm start
  ```
  - Double click this `d2w.cmd` to start it
  

## Acknowledgements
Thanks to [puppet-xp](https://github.com/wechaty/puppet-xp)! This project is using its commit [724138a](https://github.com/wechaty/puppet-xp/commit/724138aa7c6072ba6619963997fbb5857e3d5595).
