/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 */

const util = require("util");


/** Oyuncu tanımlayıcılarını nesne olarak al
 * @param {number} id - Tanımlayıcıları alınacak oyuncu ID'si
 * @returns {object} - döndürülen tanımlayıcılar nesnesi */
const getPlayerIdentifiers = (id) => {
    const ids = {};
    for (let i = 0; i < GetNumPlayerIdentifiers(id); i++) {
        const identifier = GetPlayerIdentifier(id, i).split(":");
        ids[identifier[0]] = identifier[1];
    }
    return ids;
};
exports.getPlayerIdentifiers = getPlayerIdentifiers;


/** Kaynaktan oyuncunun discord id'sini al
 * @param {number} id - Tanımlayıcıları alınacak oyuncu ID'si
 * @returns {string|boolean} - discord id veya false */
const getPlayerDiscordId = (id) => {
    const ids = getPlayerIdentifiers(id);
    return ids["discord"] || false;
};
exports.getPlayerDiscordId = getPlayerDiscordId;


/** Discord id'den oyuncu kaynağını al
 * @param {string} discordid - Discord ID
 * @returns {string|boolean} - kaynak veya false */
const getPlayerFromDiscordId = async (discordid) => {
    let player = false;
    getPlayers().some(async function(p, i, a) {
        const id = getPlayerDiscordId(p);
        if (id == discordid) {
            player = p;
            return true;
        }
        return false;
    });
    return player;
};
exports.getPlayerFromDiscordId = getPlayerFromDiscordId;


/** Belirli milisaniye kadar beklemek için promise döndürür, tek satırda temiz duraklamalar sağlar
 * @param {number} ms - Beklenecek milisaniye sayısı
 * @returns {Promise} - discord id'leri dizisi */
exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


/** Bir dizinin ilk karakterini büyük harfe çevir
 * @param {string} string - bir kelime veya cümle
 * @returns {string} - ilk karakteri büyük olan aynı cümle */
exports.uppercaseFirstLetter = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}` || "";
};


/** Yaygın global değişkenleri değiştirir: {servername} {invite} {playercount}
 * @param {string} string - dönüştürülecek dize
 * @return {string} - { değişkenler } değiştirilmiş dize */
exports.replaceGlobals = (z, string) => {
    return string
        .replace(/{servername}/g, z.config.FiveMServerName)
        .replace(/{invite}/g, z.config.DiscordInviteLink)
        .replace(/{playercount}/g, GetNumPlayerIndices());
};


/** Daha temiz bir konsol loglama deneyimi için loglama sınıfı */
const log = {
    /** `YYYY-MM-DD HH:MM` biçiminde basit bir zaman damgası döndürür
     * @returns {string} şu anın biçimlendirilmiş zaman damgası */
    timestamp: (noSpaces = false) => {
        function pad(n) { return n < 10 ? "0" + n : n; }
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}${noSpaces ? "_" : " "}${pad(date.getHours())}${noSpaces ? "-" : ":"}${pad(date.getMinutes())}${noSpaces ? "-" : ":"}${pad(date.getSeconds())}`;
    },

    /** Zaman damgalı, renksiz genel log
     * @param {string} content - Konsola loglanacak bilgi
     * @param {object} settings - İsteğe bağlı stil ve etiket geçersiz kılmaları */
    log: (content, { color = "\x1b[37m", tag = "LOG" } = {}) => {
        log.write(content, { color, tag });
    },

    /** Zaman damgalı, konsolda camgöbeği renkli bilgi mesajı
     * @param {string} content - Konsola loglanacak bilgi
     * @param {object} settings - İsteğe bağlı stil ve etiket geçersiz kılmaları */
    info: (content, { color = "\x1b[1;36m", tag = "INF" } = {}) => {
        log.write(content, { color, tag });
    },

    /** Zaman damgalı, konsolda sarı renkli uyarı mesajı
     * @param {string} content - Konsola loglanacak bilgi
     * @param {object} settings - İsteğe bağlı stil ve etiket geçersiz kılmaları */
    warn: (content, { color = "\x1b[33m", tag = "WRN" } = {}) => {
        log.write(content, { color, tag });
    },

    /** Zaman damgalı, konsolda kırmızı renkli hata mesajı
     * @param {string} content - Konsola loglanacak bilgi
     * @param {object} settings - İsteğe bağlı stil ve etiket geçersiz kılmaları */
    error: (content, { color = "\x1b[1;31m", tag = "ERR" } = {}) => {
        log.write(content, { color, tag, error: true });
        return false;
    },

    /** Kendi etiket ve stilinizle doğrudan konsola yaz
     * @param {string} content - Konsola loglanacak bilgi
     * @param {object} settings - İsteğe bağlı stil ve etiket geçersiz kılmaları */
    write: (content, { color = "\x1b[37m", tag = "LOG", error = false } = {}) => {
        const stream = error ? process.stderr : process.stdout;
        stream.write(`\x1b[1;36m[zdiscord]\x1b[0m[${log.timestamp()}]${color}[${tag}]: ${log.clean(content)}\x1b[0m\n`);
        return false;
    },

    /** Konsol loglaması için içeriği temizle
     * @param {string|object} item - Konsola loglanacak bilgi
     * @returns {string} sağlanan içeriğin temizlenmiş dizesi */
    clean: (item) => {
        if (typeof item === "string") return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    },

    /** zdiscord'a özgü loglar için özel durum log işleyicisi
     *  Veya spam oluşturan logları (heartbeat) tamamen yoksay
     * @param {string|object} err - işlenecek hata */
    handler: (type, err) => {
        const e = err.toString();
        if (e.includes("[DISALLOWED_INTENTS]")) log.error("INTENT'LERİ ETKİNLEŞTİRMEDİNİZ - zdiscord readme.md dosyasına geri dönün ve \"kurulum\" bölümünü okuyun");
        else if (e.includes("[TOKEN_INVALID]")) log.error("DISCORD API TOKEN'INIZ GEÇERSİZ VEYA İPTAL EDİLMİŞ - YENİ BİR TANE OLUŞTURUN VE CONFIG'İ GÜNCELLEYİN");
        else if (e.includes("Missing Access")) log.error("KOMUT OLUŞTURMA İZNİ YOK - Botu sunucunuza kurulum kılavuzundaki davet bağlantısıyla yeniden davet etmelisiniz");
        else if (e.includes("[HeartbeatTimer]")) return;
        else if (e.includes("Heartbeat acknowledged")) return;
        else if (type === "error") log.error(e);
        else if (type === "warn") log.warn(e);
        else if (type === "info") log.info(e);
        else log.log(e);
    },

    /** zdiscord'a özgü hatalar için özel durum hata işleyicisi
     * @param {boolean} statement - Kontrol edilecek ifade (true = hata fırlat)
     * @param {string} error - true ise fırlatılacak mesaj */
    assert: (statement, error) => {
        if (statement == true) {
            log.error(error);
        }
    },
};
exports.log = log;


/** Rol veya sunucu ID'sinin en azından doğru görünüp görünmediğini kontrol et
 * @param {string} id - rol id'si
 * @returns {boolean} - ID'nin doğru görünüp görünmediği */
const isValidID = (id) => {
    return /^\d{17,21}$/.test(id);
};
exports.isValidID = isValidID;


/** Oyun içindeki tüm personele personel mesajı gönder
 * @param {object} z - z
 * @param {string} name - Mesajın gönderildiği kişinin adı
 * @param {string} msg - gönderilecek mesaj */
const sendStaffChatMessage = (z, name, msg) => {
    if (!msg) return;
    getPlayers().forEach(async function(player, index, array) {
        if (IsPlayerAceAllowed(player, "zdiscord.staffchat")) {
            chatMessage(player, `[${z.locale.staffchat}] ${name}`, msg, { multiline: false, color: [ 255, 100, 0 ] });
        }
    });
};
exports.sendStaffChatMessage = sendStaffChatMessage;


/** Sohbet mesajı gönder
 * @param {number} destination - kaynak id veya tümü için -1
 * @param {string} label - Mesajın gönderildiği kişinin adı
 * @param {string} msg - gönderilecek mesaj
 * @param {object} options - seçenekler: dizi color[r, g, b], bool multiline */
const chatMessage = (destination, label, msg, options) => {
    if (!options) { options = {}; }
    TriggerClientEvent("chat:addMessage", destination, {
        color: (options.color || [ 255, 255, 255 ]),
        multiline: options.multiline || false,
        args: [ label, msg ],
    });
};
exports.chatMessage = chatMessage;
