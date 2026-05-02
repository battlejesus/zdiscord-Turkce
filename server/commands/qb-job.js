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
    name: "meslek",
    description: "Oyuncunun şehir içi mesleğini yönet",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "Oyuncunun mesleğini ayarla",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "job",
                    description: "Verilecek meslek",
                    required: true,
                    type: "STRING",
                    /* choices: [ // If someone desired they could hard-code options to make it easier but there's a limit of 25 options allowed
                        { name: "Doctor / Ambulance", value: "ambulance" },
                        { name: "Police", value: "police" },
                    ],*/
                },
                {
                    name: "grade",
                    description: "Meslek derecesi (bazı dereceler bazı mesleklerde bulunmayabilir)",
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
                        { name: "Derece 11", value: "11" },
                        { name: "Derece 12", value: "12" },
                        { name: "Derece 13", value: "13" },
                        { name: "Derece 14", value: "14" },
                        { name: "Derece 15", value: "15" },
                        { name: "Derece 16", value: "16" },
                        { name: "Derece 17", value: "17" },
                        { name: "Derece 18", value: "18" },
                        { name: "Derece 19", value: "19" },
                        { name: "Derece 20", value: "20" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "fire",
            description: "Oyuncuyu mevcut mesleğinden işten at",
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
            description: "Oyuncunun mevcut mesleğini görüntüle",
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
        const prevJob = `${player.PlayerData.job.name} (${player.PlayerData.job.grade.level})`;
        if (args.set) {
            if (player.Functions.SetJob(args.job, args.grade)) {
                client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun mesleğini ${prevJob} → ${args.job} (${args.grade}) olarak değiştirdi`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun mesleği ${prevJob} → ${args.job} (${args.grade}) olarak güncellendi.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Geçersiz meslek veya derece.", ephemeral: false });
            }
        } else if (args.fire) {
            player.Functions.SetJob("unemployed", "0");
            client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuyu ${prevJob} mesleğinden işten attı`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncu ${prevJob} mesleğinden işten atıldı.`, ephemeral: false });
        } else if (args.inspect) {
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun mesleği: ${prevJob}`, ephemeral: false });
        }
    },
};
