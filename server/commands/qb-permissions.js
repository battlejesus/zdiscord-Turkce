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
    name: "yetkiler",
    description: "Oyuncunun şehir içi yetkilerini yönet",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "Oyuncuya yetki ekle",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "permission",
                    description: "Verilecek yetki",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "admin", value: "admin" },
                        { name: "god", value: "god" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
            description: "Oyuncunun tüm yetkilerini kaldır",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Bu ID geçersiz görünüyor.", ephemeral: true });
        if (args.add) {
            client.QBCore.Functions.AddPermission(args.id, args.permission);
            client.utils.log.info(`[${interaction.member.displayName}] ${args.id} ID'li oyuncuya ${args.permission} yetkisi verdi`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncuya ${args.permission} yetkisi verildi.`, ephemeral: false });
        } else if (args.remove) {
            client.QBCore.Functions.RemovePermission(args.id);
            client.utils.log.info(`[${interaction.member.displayName}] ${args.id} ID'li oyuncunun yetkileri kaldırıldı`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun yetkileri kaldırıldı.`, ephemeral: false });
        }
    },
};
