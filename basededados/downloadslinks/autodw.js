const fs = require(`fs`)

const { isJsonIncludes, linkfy, sleep, fetchJson, saveJSON } = require(`../../config.js`)

const { blacksite, API_KEY_BLACK } = require(`../../dono/config-all.json`)

var isUrl = (url) => {
if(linkfy.find(url)[0]) return true
return false
}

const autodwpath = `./basededados/downloadslinks/autodwlinks.json`

if(!fs.existsSync(autodwpath)) {fs.writeFileSync(autodwpath, JSON.stringify([]))}

const autodw = JSON.parse(fs.readFileSync(autodwpath))

function saveAutoDW() {saveJSON(autodw, autodwpath)}

function addUsuInAutoDW(sender, active = true) {
    platforms = [
        {youtube: true, audio: false},
        {facebook: true, audio: false},
        {instagram: true, audio: false},
        {tiktok: true, audio: false},
        {twitter: true, audio: false},
        {mediafire: true},
        {github: true},
        {xvideos: true},
        {xnxx: true}
    ]
    autodw.push({id: sender, multidl: false, active: active, platforms: platforms})
    saveAutoDW()
}

const getUsuAutoDW = (sender) => {
    AB = autodw.map(i => i.id).indexOf(sender)
    return autodw[AB]
}

function activateAutoDWinUsu(sender) {
    if(!isJsonIncludes(autodw, sender)) return addUsuInAutoDW(sender)
    data = getUsuAutoDW(sender)
    data.active = true
    saveAutoDW()
}

function disableAutoDWinUsu(sender) {
    if(!isJsonIncludes(autodw, sender)) return addUsuInAutoDW(sender, false)
    data = getUsuAutoDW(sender)
    data.active = false
    saveAutoDW()
}

function react(blackmd, from, emoji, info) {if(info) blackmd.sendMessage(from, {react: {text: emoji, key: info.key}})}

async function idAllLinkAutoDW(blackmd, from, sender, body, info) {
    data = getUsuAutoDW(sender)
    if(data.active) {
        sp = body.split(`\n`).join(` `).split(`,`).join(` `).split(` `)
        links = []
        for(i of sp) {
            txt = i.replace(`\n`, ``).replace(`\n`, ``)
            if(isUrl(txt)) links.push(txt)
        }
        if(data.multidl) { alllinksplatforms = links
        } else { alllinksplatforms = [links[0]] }
        for(dw of alllinksplatforms) {
            if(dw.includes(`youtube`) || dw.includes(`youtu.be`)) {
                yt = data.platforms[0]
                if(yt.youtube) {
                    try {
                        if(!yt.audio) {
                            react(blackmd, from, `📽`, info)
                            blackmd.sendMessage(from, {video: {url: blacksite+`/api/dl/ytvideo?url=${dw}&apikey=`+API_KEY_BLACK}}, {quoted: info})
                        } else {
                            react(blackmd, from, `🎶`, info)
                            fetchyt = await fetchJson(blacksite+`/api/dl/ytdl?query=${dw}&apikey=`+API_KEY_BLACK)
                            blackmd.sendMessage(from, {audio: {url: fetchyt.resultado.audio}, mimetype: `audio/mpeg`}, {quoted: info})
                        }
                    } catch(e) {console.log(`Erro em dw do youtube - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`facebook`) || dw.includes(`fb.watch`)) {
                fb = data.platforms[1]
                if(fb.facebook) {
                    try {
                        if(!fb.audio) {
                            react(blackmd, from, `📽`, info)
                            fetchfb = await fetchJson(blacksite+`/api/v3/facebook?url=${dw}&apikey=`+API_KEY_BLACK)
                            blackmd.sendMessage(from, {video: {url: fetchfb.resultado.Normal_video}}, {quoted: info})
                        } else {
                            react(blackmd, from, `🎶`, info)
                            fetchfb = await fetchJson(blacksite+`/download/facebook2?url=${dw}&apikey=`+API_KEY_BLACK)
                            blackmd.sendMessage(from, {audio: {url: fetchfb.resultado.media.url}, mimetype: `audio/mpeg`}, {quoted: info})
                        }
                    } catch(e) {console.log(`Erro em dw do facebook - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`instagram`) || dw.includes(`reel`)) {
                ig = data.platforms[2]
                if(ig.instagram) {
                    try {
                        fetchig = await fetchJson(blacksite+`/api/instagram?url=${dw}&apikey=`+API_KEY_BLACK)
                        if(!ig.audio) {
                            react(blackmd, from, isJsonIncludes(fetchig.resultado, `image`) ? `📸` : `📽`, info)
                            for(ftigvd of fetchig.resultado) {
                                await sleep(700)
                                if(ftigvd.type == `video`) {
                                    blackmd.sendMessage(from, {video: {url: ftigvd.url}}, {quoted: info})
                                } else {
                                    blackmd.sendMessage(from, {image: {url: ftigvd.url}}, {quoted: info})
                                }
                            }
                        } else {
                            react(blackmd, from, `🎶`, info)
                            caixa = []
                            for(ftigad of fetchig.resultado) {
                                if(ftigad.type == `video`) caixa.push(i)
                            }
                            if(caixa.length <= 0) return console.log(`Nenhum áudio encontrado!`)
                            for(c of caixa) {
                                await sleep(700)
                                blackmd.sendMessage(from, {audio: {url: c.url}, mimetype: `audio/mpeg`}, {quoted: info})
                            }
                        }
                    } catch(e) {console.log(`Erro em dw do instagram - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`tiktok`)) {
                ttk = data.platforms[3]
                if(ttk.tiktok) {
                    try {
                        fetchttk = await fetchJson(blacksite+`/api/tiktokdl4?url=${dw}&apikey=`+API_KEY_BLACK)
                        if(!ttk.audio) {
                            if(fetchttk.resultado.type == `video`) {
                                react(blackmd, from, `🎥`, info)
                                blackmd.sendMessage(from, {video: {url: fetchttk.resultado.urls[0]}})
                              } else {
                                react(blackmd, from, `📸`, info)
                                if(i.type == `photo`) {
                                  blackmd.sendMessage(from, {image: {url: fetchttk.resultado.urls[0]}}, {quoted: info})
                                } else {
                                    for(image of fetchttk.resultado.urls[0]) {
                                        await sleep(1200)
                                        blackmd.sendMessage(from, {image: {url: image[0]}})
                                    }
                                }
                            }
                        } else {
                            fetchttk2 = await fetchJson(blacksite+`/api/tiktokdl2?url=${dw}&apikey=`+API_KEY_BLACK)
                            react(blackmd, from, `🎶`, info)
                            blackmd.sendMessage(from, {audio: {url: fetchttk2.resultado.music}, mimetype: `audio/mpeg`}, {quoted: info})
                        }
                    } catch(e) {console.log(`Erro em dw do tiktok - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`twitter`) || dw.includes(`x.com`)) {
                twt = data.platforms[4]
                if(twt.twitter) {
                    try {
                        fetchtwt = await fetchJson(blacksite+`/api/dl/twitter2?url=${dw}&apikey=`+API_KEY_BLACK)
                        if(!twt.audio) {
                            react(blackmd, from, `📷`, info)
                            for(ttrvd of fetchtwt.resultado.media) {
                                if(ttrvd.url.includes(`mp4`)) {
                                    blackmd.sendMessage(from, {video: {url: ttrvd.url}}, {quoted: info})
                                } else {
                                    blackmd.sendMessage(from, {image: {url: ttrvd.url}}, {quoted: info})
                                }
                            }
                        } else {
                            react(blackmd, from, `🎶`, info)
                            for(ttrad of fetchtwt.resultado.media) {
                                if(ttrad.url.includes(`mp4`)) {
                                    blackmd.sendMessage(from, {audio: {url: ttrad.url}, mimetype: `audio/mpeg`}, {quoted: info})
                                }
                            }
                        }
                    } catch(e) {console.log(`Erro em dw do twitter - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`mediafire`)) {
                mf = data.platforms[5]
                if(mf.mediafire) {
                    try {
                        fetchmf = await fetchJson(blacksite+`/api/dl/mediafire?url=${dw}&apikey=`+API_KEY_BLACK)
                        blackmd.sendMessage(from, {text: `📂 *Nome:* ${fetchmf.resultado.filename}\n🧮 *Tamanho:* ${fetchmf.resultado.size}\n_Criado em ${fetchmf.resultado.uploadDate}_`}, {quoted: info})
                        blackmd.sendMessage(from, {document: {url: fetchmf.resultado.url}, mimetype: "application/"+fetchmf.resultado.filetype, fileName: fetchmf.resultado.filename}, {quoted: info})
                    } catch(e) {console.log(`Erro em dw do mediafire - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`github`)) {
                gh = data.platforms[6]
                if(gh.github) {
                    try {
                        let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
                        let [, user, repo] = dw.match(regex1) || []
                        repo = repo.replace(/.git$/, '')
                        let giturl = `https://api.github.com/repos/${user}/${repo}/zipball`
                        let filename = (await fetch(giturl, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
                        let finishname = filename.split(`-`).splice(0, filename.split(`-`).length - 1).join(`-`)
                        blackmd.sendMessage(from, {document: {url: giturl}, fileName: finishname+'.zip', mimetype: 'application/zip'}, {quoted: info})
                    } catch(e) {console.log(`Erro em dw do github - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`xvideos`)) {
                xv = data.platforms[7]
                if(xv.xvideos) {
                    try {
                        fetchxv = await fetchJson(blacksite+`/api/xvideos?url=${dw}&apikey=`+API_KEY_BLACK)
                        blackmd.sendMessage(from, {video: {url: fetchxv.resultado.download}}, {quoted: info})
                    } catch(e) {console.log(`Erro em dw do xvideos - `, e)}
                }
                await sleep(1000)
            }
            if(dw.includes(`xnxx`)) {
                xx = data.platforms[7]
                if(xx.xnxx) {
                    try {
                        fetchxx = await fetchJson(blacksite+`/api/xnxxdl?url=${dw}&apikey=`+API_KEY_BLACK)
                        blackmd.sendMessage(from, {video: {url: fetchxx.resultado.url}}, {quoted: info})
                    } catch(e) {console.log(`Erro em dw do xnxx - `, e)}
                }
            }
        }
    }
}

module.exports = { autodw, saveAutoDW, addUsuInAutoDW, getUsuAutoDW, activateAutoDWinUsu, disableAutoDWinUsu, idAllLinkAutoDW }