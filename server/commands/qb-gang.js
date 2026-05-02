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
    name: "gang",
    description: "Oyuncunun şehir içi çetesini yönet",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "Oyuncunun çetesini ayarla",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "gang",
                    description: "Atanacak çete",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "grade",
                    description: "Çete derecesi (rütbesi)",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Derece 0", value: "0" },
                        { name: "Derece 1", value: "1" },
                        { name: "Derece 2", value: "2" },
                        { name: "Derece 3", value: "3" },
                        { name: "Derece 4", value: "4" },
                        { name: "Derece 5", value: "5" },
                        { name: "Derece 6", value: "6" },
                        { name: "Derece 7", value: "7" },
                        { name: "Derece 8", value: "8" },
                        { name: "Derece 9", value: "9" },
                        { name: "Derece 10", value: "10" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "kick",
            description: "Oyuncuyu bulunduğu çeteden at",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Oyuncunun mevcut çetesini görüntüle",
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
        const player = client.QBCore.Functions.GetPlayer(args.id);
        const prevGang = `${player.PlayerData.gang.name} (${player.PlayerData.gang.grade.level})`;
        if (args.set) {
            if (player.Functions.SetGang(args.gang, args.grade)) {
                client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun çetesini ${prevGang} → ${args.gang} (${args.grade}) olarak değiştirdi`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun çetesi ${prevGang} → ${args.gang} (${args.grade}) olarak güncellendi.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Geçersiz çete veya derece.", ephemeral: false });
            }
        } else if (args.kick) {
            player.Functions.SetGang("none", "0");
            client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuyu ${prevGang} çetesinden attı`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncu ${prevGang} çetesinden atıldı.`, ephemeral: false });
        } else if (args.inspect) {
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncu ${prevGang} çetesinde.`, ephemeral: false });
        }
    },
};
