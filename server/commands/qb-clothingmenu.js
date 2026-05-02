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
    name: "skinmenu",
    description: "Bir oyuncuya kıyafet menüsü aç",
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
        emitNet("qb-clothing:client:openMenu", args.id);
        client.utils.log.info(`[${interaction.member.displayName}] ${args.id} ID'li oyuncuya kıyafet menüsü açtı`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncuya kıyafet menüsü açıldı.`, ephemeral: false });
    },
};
