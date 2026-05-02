/*
    zdiscord - Tony/zfbx tarafından - https://github.com/zfbx/zdiscord - Lisans: CC BY-NC-SA 4.0
    Bu dosya için belgeler: https://zfbx.github.io/zdiscord/config veya docs/config.md
*/


/** ******************************
 * GENEL YAPILANDIRMA AYARLARI
 ********************************/

const LanguageLocaleCode = "tr";

// GENEL DEĞERLER
const FiveMServerName = "My FiveM Server";
const DiscordInviteLink = "https://discord.gg/fivem";
const FiveMServerIP = "127.0.0.1";

// Konsolu çok doldurur, yalnızca gerektiğinde test için etkinleştirin
const DebugLogs = false;


/** ********************
 * DISCORD BOT AYARLARI
 ***********************/

const EnableDiscordBot = true;

// DISCORD BOT
const DiscordBotToken = "CHANGE";
const DiscordGuildId = "000000000000000000";

// PERSONEL SOHBETI
const EnableStaffChatForwarding = false;
const DiscordStaffChannelId = "000000000000000000";
const AdditionalStaffChatRoleIds = [
    // "000000000000000",
];

// BEYAZ LİSTE / İZİN LİSTESİ
const EnableWhitelistChecking = false;
const DiscordWhitelistRoleIds = "000000000000000000, 000000000000000000";

// SLASH KOMUTLARI / DISCORD İZİNLERİ
const EnableDiscordSlashCommands = true;
const DiscordModRoleId = "000000000000000000";
const DiscordAdminRoleId = "000000000000000000";
const DiscordGodRoleId = "000000000000000000";

// DISCORD BOT DURUM MESAJLARI
const EnableBotStatusMessages = true;
const BotStatusMessages = [
    "{servername}",
    "{playercount} online",
];

// ACE İZİNLERİ
const EnableAutoAcePermissions = false;
const AutoAcePermissions = {
    // "örnek": "000000000000000000",
    // "örnek2": [ "000000000000000000", "000000000000000000"],
};

// Diğer
const SaveScreenshotsToServer = false;


/** ************************
 * WEBHOOK LOG AYARLARI
**************************/

const EnableLoggingWebhooks = false;
const LoggingWebhookName = "zLogs";
// Bir rolü etiketleyecekseniz id'nin önüne "&" ekleyin
const LoggingAlertPingId = "&000000000000000000";
// örnek: "bank": "https://discord.com/webhook/...",
const LoggingWebhooks = {
    "example": "https://discord.com/api/webhooks/000000000/sEcRRet-ToK3n_5tUfF_tH8t_YUo-S40u1d-n07-sHar3",
};


/** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! NE YAPTIĞINIZI BİLMİYORSANIZ BU SATIRIN ALTINI DÜZENLEMEYIN !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

module.exports = {
    EnableDiscordBot: getConBool("discord_enable_bot", EnableDiscordBot),
    EnableStaffChatForwarding: getConBool("discord_enable_staff_chat", EnableStaffChatForwarding),
    EnableLoggingWebhooks: getConBool("discord_enable_logging_webhooks", EnableLoggingWebhooks),
    DebugLogs: getConBool("discord_debug", DebugLogs),
    DiscordBotToken: GetConvar("discord_token", DiscordBotToken),
    DiscordGuildId: GetConvar("discord_guild_id", DiscordGuildId),
    LanguageLocaleCode: GetConvar("discord_lang", LanguageLocaleCode),
    FiveMServerName: GetConvar("discord_server_name", FiveMServerName),
    DiscordInviteLink: GetConvar("discord_invite", DiscordInviteLink),
    FiveMServerIP: GetConvar("discord_server_ip", FiveMServerIP),
    EnableWhitelistChecking: getConBool("discord_enable_whitelist", EnableWhitelistChecking),
    DiscordWhitelistRoleIds: getConList("discord_whitelist_roles", DiscordWhitelistRoleIds),
    EnableDiscordSlashCommands: getConBool("discord_enable_commands", EnableDiscordSlashCommands),
    DiscordModRoleId: GetConvar("discord_mod_role", DiscordModRoleId),
    DiscordAdminRoleId: GetConvar("discord_admin_role", DiscordAdminRoleId),
    DiscordGodRoleId: GetConvar("discord_god_role", DiscordGodRoleId),
    EnableBotStatusMessages: getConBool("discord_enable_status", EnableBotStatusMessages),
    BotStatusMessages: BotStatusMessages,
    EnableAutoAcePermissions: getConBool("discord_enable_ace_perms", EnableAutoAcePermissions),
    AutoAcePermissions: AutoAcePermissions,
    SaveScreenshotsToServer: getConBool("discord_save_screenshots", SaveScreenshotsToServer),
    DiscordStaffChannelId: GetConvar("discord_staff_channel_id", DiscordStaffChannelId),
    LoggingWebhooks: LoggingWebhooks,
    LoggingAlertPingId: GetConvar("discord_logging_ping_id", LoggingAlertPingId),
    LoggingWebhookName: GetConvar("discord_logging_name", LoggingWebhookName),
    StaffChatRoleIds: [
        GetConvar("discord_mod_role", DiscordModRoleId),
        GetConvar("discord_admin_role", DiscordAdminRoleId),
        GetConvar("discord_god_role", DiscordGodRoleId),
        ...AdditionalStaffChatRoleIds,
    ],
};

/** Convar veya varsayılan değeri true/false boolean'a dönüştürerek döndürür
 * @param {boolean|string|number} con - Convar adı
 * @param {boolean|string|number} def - Varsayılan yedek değer
 * @returns {boolean} - ayrıştırılmış bool */
function getConBool(con, def) {
    if (typeof def == "boolean") def = def.toString();
    const ret = GetConvar(con, def);
    if (typeof ret == "boolean") return ret;
    if (typeof ret == "string") return ["true", "on", "yes", "y", "1"].includes(ret.toLocaleLowerCase().trim());
    if (typeof ret == "number") return ret > 0;
    return false;
}

/** Öğelerin dizisini veya sağlanan varsayılan diziyi döndürür
 * @param {string} con - virgülle ayrılmış değerler dizisi
 * @param {string|Array} def - virgülle ayrılmış değerler dizisi
 * @returns {object} - discord id'leri dizisi */
function getConList(con, def) {
    const ret = GetConvar(con, def);
    if (typeof ret == "string") return ret.replace(/[^0-9,]/g, "").replace(/(,$)/g, "").split(",");
    if (Array.isArray(ret)) return ret;
    if (!ret) return [];
}
