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

const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");

class Bot extends Client {

    constructor(z) {
        super({
            intents: 14335,
            fetchAllMembers: true,
            messageCacheMaxSize: 10,
        });
        this.enabled = z.config.EnableDiscordBot;
        this.z = z;
        this.config = z.config;
        this.QBCore = z.QBCore;
        this.log = z.utils.log;
        this.utils = z.utils;
        this.Embed = MessageEmbed;
        this.commands = new Collection();
        this.arrayOfCommands = [];

        if (this.enabled) this.start();
    }

    start() {
        this.utils.log.assert((process.version == "v12.13.0"), "Desteklenmeyen artifact sürümü kullanıyorsunuz, daha yeni bir artifact indirin veya zdiscord'un 4.0.0 sürümüne geri dönün");
        this.utils.log.assert((this.config.DiscordBotToken == "CHANGE"), "Bu modülün çalışması için bir Discord bot token'ı gereklidir. config.js dosyasını kontrol edin");
        this.utils.log.assert((this.config.DiscordGuildId == "000000000000000000"), "Bu kaynağın düzgün çalışması için bir Discord sunucu ID'si gereklidir. config.js dosyasını kontrol edin");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordGuildId)), "DiscordGuildId değeriniz doğru görünmüyor");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordModRoleId)), "DiscordModRoleId değeriniz doğru görünmüyor");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordAdminRoleId)), "DiscordAdminRoleId değeriniz doğru görünmüyor");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordGodRoleId)), "DiscordGodRoleId değeriniz doğru görünmüyor");
        this.utils.log.assert(this.config.EnableStaffChatForwarding && !(this.utils.isValidID(this.config.DiscordStaffChannelId)), "DiscordStaffChannelId değeriniz doğru görünmüyor");

        if (this.config.EnableDiscordSlashCommands) this.loadCommands();
        this.loadEvents();

        if (this.config.DebugLogs) this.on("debug", (debug) => this.log.handler("log", debug));
        this.on("warn", (warning) => this.log.handler("warn", warning));
        this.on("error", (error) => this.log.handler("error", error));

        this.login(this.config.DiscordBotToken).catch((e) => this.log.handler("error", e));
    }

    loadCommands() {
        const commandFiles = readdirSync(`${this.z.root}/server/commands`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${this.z.root}/server/commands/${file}`);
            if (!command?.name) continue;
            if (command.args || command.alias) {
                this.log.warn(`${file} v4 veya üzeri bir komuttur ve desteklenmemektedir, güncelleyin veya kaldırın`);
                continue;
            }
            if (this.commands.has(command.name)) {
                this.log.warn(`${file} başka bir komut tarafından zaten kayıt edilmiş bir isim kullanıyor [atlanıyor]`);
                continue;
            }
            if (file.startsWith("qb-") && !this.QBCore) continue;
            this.commands.set(command.name, command);
            if (["MESSAGE", "USER"].includes(command.type)) delete command.description;
            this.arrayOfCommands.push(command);
        }
    }

    loadEvents() {
        const eventFiles = readdirSync(`${this.z.root}/server/events`).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`${this.z.root}/server/events/${file}`);
            if (event.once) this.once(event.name, (...args) => event.run(this, ...args));
            else this.on(event.name, (...args) => event.run(this, ...args));
        }
    }


    /**
     * Sayfalandırılmış bir embed oluşturur
     * kaynak: https://github.com/ryzyx/discordjs-button-pagination
     * @param {Interaction} interaction - tepki verilecek mesaj etkileşimi
     * @param {MessageEmbed[]} pages - embed dizisi
     * @param {MessageButton[]} buttonList - 2 buton nesnesi içermeli
     * @param {number} timeout - İsteğe bağlı yanıt süresi uzunluğu
     * @returns {Interaction} mevcut sayfa
     */
    async paginationEmbed(interaction, pages, buttonList, timeout = 120000) {
        let page = 0;
        const row = new MessageActionRow().addComponents(buttonList);
        if (interaction.deferred == false) await interaction.deferReply();
        const curPage = await interaction.editReply({
            embeds: [pages[page].setFooter({ text: `Sayfa ${page + 1} / ${pages.length}` })],
            components: [row], fetchReply: true,
        });
        const filter = (i) => i.customId === buttonList[0].customId || i.customId === buttonList[1].customId;
        const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });
        collector.on("collect", async (i) => {
            switch (i.customId) {
            case buttonList[0].customId:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[1].customId:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
            }
            await i.deferUpdate();
            await i.editReply({ embeds: [pages[page].setFooter({ text: `Sayfa ${page + 1} / ${pages.length}` })], components: [row] });
            collector.resetTimer();
        });
        collector.on("end", () => {
            const disabledRow = new MessageActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true));
            curPage.edit({ embeds: [pages[page].setFooter({ text: `Sayfa ${page + 1} / ${pages.length}` })], components: [disabledRow] }).catch(console.error);
        });
        return curPage;
    }

    /** Kullanıcı ID'sine göre discord üye nesnesini al
     * @param {number} userid - discordid
     * @returns {object|boolean} - discord üyesi veya false */
    getMember(userid) {
        const guild = this.guilds.cache.get(this.config.DiscordGuildId);
        if (!guild) {
            this.utils.log.error("Discord sunucusu alınamadı.");
            return false;
        }
        return guild.members.cache.get(userid) || false;
    }

    /** Kaynak ID'sine göre discord üye nesnesini al
     * @param {number} id - Oyuncu ID / kaynak
     * @returns {object|boolean} - discord üyesi veya false */
    getMemberFromSource(id) {
        const ids = this.utils.getPlayerIdentifiers(id);
        if (!ids.discord) return false;
        return this.getMember(ids.discord);
    }

    /** Herhangi bir tanımlayıcı alıp discord üyesi bulmaya çalış
     * @param {number|string|object} member - kaynak | discordid | üye nesnesi
     * @returns {object|boolean} - discord üyesi veya false */
    parseMember(member) {
        if (!member || !this.enabled) return false;
        if (typeof member === "number") {
            return this.getMemberFromSource(member);
        } else if (typeof member === "string") {
            return this.getMember(member);
        } else { return member || false; }
    }

    /** ID veya ID dizisi ile rol bulunursa true döner
     * @param {number|object|string} member - kaynak | üye | discordid
     * @param {string|object} role - Rol ID veya Rol ID'leri
     * @returns {boolean} - rol bulunduysa true, bulunamadıysa false */
    isRolePresent(member, role) {
        if (!role || !member || !this.enabled) return false;
        member = this.parseMember(member);
        if (!member) return false;
        if (typeof role === "object") {
            let found = false;
            role.forEach(function(item) {
                if (member.roles.cache.has(item)) found = true;
            });
            return found;
        } else {
            return member.roles.cache.has(role);
        }
    }

    /** ID'ye göre discord üyesinin rol dizisini al
     * @param {number|object|string} member - kaynak | üye | discordid
     * @returns {Array} - rol id'leri dizisi */
    getMemberRoles(member) {
        if (!member || !this.enabled) return [];
        member = this.parseMember(member);
        if (!member) return [];
        return member.roles.cache.map(r => r.id);
    }

    hasPermission(member, level) {
        switch (level) {
        case "mod":
            return (
                member.roles.cache.has(this.config.DiscordModRoleId) ||
                member.roles.cache.has(this.config.DiscordAdminRoleId) ||
                member.roles.cache.has(this.config.DiscordGodRoleId));
        case "admin":
            return (
                member.roles.cache.has(this.config.DiscordAdminRoleId) ||
                member.roles.cache.has(this.config.DiscordGodRoleId));
        case "god":
            return (member.roles.cache.has(this.config.DiscordGodRoleId));
        default:
            return true;
        }
    }

}

module.exports = Bot;
