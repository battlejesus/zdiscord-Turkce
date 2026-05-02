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
    name: "tanimlayicilar",
    description: "Bir oyuncunun tüm tanımlayıcılarını görüntüle",
    role: "admin",

    options: [
        {
            name: "id",
            description: "Oyuncunun mevcut ID'si",
            required: true,
            type: "INTEGER",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Bu ID geçersiz görünüyor.", ephemeral: true });
        const embed = new client.Embed()
            .setColor(client.config.embedColor)
            .setTitle(`${GetPlayerName(args.id)} Tanımlayıcıları`)
            .setFooter({ text: "Lütfen gizliliğe saygı gösterin ve oyuncuları ifşa etmeyin." });
        let desc = "";
        for (const [key, value] of Object.entries(client.utils.getPlayerIdentifiers(args.id))) {
            if (key == "discord") desc += `**${key}:** <@${value}> (${value})\n`;
            else desc += `**${key}:** ${value}\n`;
        }
        embed.setDescription(desc);
        client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun tanımlayıcılarına baktı`);
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch();
    },
};
