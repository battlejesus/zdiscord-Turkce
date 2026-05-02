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

module.exports = {
    name: "sunucu",
    description: "FiveM ve Discord istatistiklerini görüntüle",

    run: async (client, interaction) => {
        if (client.isRolePresent(interaction.member, [client.config.DiscordModRoleId, client.config.DiscordAdminRoleId, client.config.DiscordGodRoleId])) {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField("FiveM Sunucusu:", `**Sürüm:** ${GetConvar("version", "Bilinmiyor")}
                    **Sunucu Adı:** ${client.config.FiveMServerName}
                    **Sunucu IP:** ${client.config.FiveMServerIP}
                    **Kaynak Sayısı:** ${GetNumResources()}
                    **Oyun Yapısı:** ${GetConvar("sv_enforceGameBuild", "Bilinmiyor")}
                    **Maksimum Oyuncu:** ${GetConvar("sv_maxClients", "Bilinmiyor")}
                    **OneSync:** ${GetConvar("onesync_enabled", "Bilinmiyor")}
                    **Çalışma Süresi:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} dakika
                    **Çevrimiçi Oyuncular:** ${GetNumPlayerIndices()}`, false)
                .addField("Discord Sunucusu:", `**ID:** ${interaction.guildId}
                    **Davet:** ${client.config.DiscordInviteLink}
                    **Roller:** ${interaction.guild.roles.cache.size}
                    **Kanallar:** ${interaction.guild.channels.cache.filter((chan) => chan.type === "GUILD_TEXT").size}
                    **Üyeler:** ${interaction.guild.memberCount}${getWhitelisted(client, interaction)}
                    **Sahip:** <@${interaction.guild.ownerId}> (${interaction.guild.ownerId})`, true)
                .setFooter({ text: "zdiscord by zfbx" });
            return interaction.reply({ embeds: [ embed ] });
        } else {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField(client.config.FiveMServerName, `**Sunucu IP:** ${client.config.FiveMServerIP}
                    **Çalışma Süresi:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} dakika
                    **Oyuncular:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "Bilinmiyor")}`, false)
                .setFooter({ text: "zdiscord by zfbx" });
            return interaction.reply({ embeds: [ embed ] });
        }
    },
};


function getWhitelisted(client, interaction) {
    if (!client.config.EnableWhitelistChecking) return "";
    const membersWithRole = interaction.guild.members.cache.filter(member => {
        let found = false;
        client.config.DiscordWhitelistRoleIds.forEach(role => {
            if (member.roles.cache.has(role)) found = true;
        });
        return found;
    });
    return `\n**Beyaz Listeli:** ${membersWithRole.size}`;
}
