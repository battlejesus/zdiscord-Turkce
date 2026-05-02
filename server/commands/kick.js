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
    name: "kick",
    description: "Bir oyuncuyu şehirden at",
    role: "mod",

    options: [
        {
            name: "id",
            description: "Oyuncunun mevcut ID'si",
            required: true,
            type: "INTEGER",
        },
        {
            name: "message",
            description: "Oyuncuya gösterilecek atma mesajı",
            required: false,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Bu ID geçersiz görünüyor.", ephemeral: true });
        const reason = client.utils.replaceGlobals(client, args.message || client.z.locale.kickedWithoutReason);
        DropPlayer(args.id, reason);
        client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuyu attı. Sebep: ${reason}`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncu atıldı.`, ephemeral: false });
    },
};
