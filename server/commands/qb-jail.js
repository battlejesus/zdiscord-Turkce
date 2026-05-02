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
    name: "hapis",
    description: "Oyuncunun hapis cezasını yönet",
    role: "mod",

    options: [
        {
            type: "SUB_COMMAND",
            name: "sentence",
            description: "Oyuncuyu hapse at",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "time",
                    description: "Oyuncunun kaç dakika hapiste kalacağı",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "free",
            description: "Oyuncuyu hapisten serbest bırak",
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
        if (args.sentence) {
            if (args.time < 5) return interaction.reply({ content: "Hapis süresi en az 5 olmalıdır.", ephemeral: true });
            const player = client.QBCore.Functions.GetPlayer(args.id);
            const d = new Date();
            // Stupid hack to replicate lua's os.date("*t") for the prison jail script is stupid..
            const currentDate = {
                ["month"]: d.getDate(),
                ["sec"]: d.getSeconds(),
                ["year"]: d.getFullYear(),
                ["day"]: (d.getDate() > 30) ? 30 : d.getDate(),
                ["min"]: d.getMinutes(),
                ["wday"]: d.getDay() + 1,
                ["isdst"]: false,
                ["yday"]: (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000,
                ["hour"]: d.getHours(),
            };
            player.Functions.SetMetaData("injail", args.time);
            player.Functions.SetMetaData("criminalrecord", { ["hasRecord"]: true, ["date"]: currentDate });
            emitNet("police:client:SendToJail", args.id, parseInt(args.time));
            emitNet("QBCore:Notify", args.id, `${args.time} ay hapis cezasına çarptırıldınız.`);
            client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuyu ${args.time} dakika hapse attı`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncu ${args.time} ay hapis cezasına çarptırıldı.`, ephemeral: false });
        } else if (args.free) {
            emitNet("prison:client:UnjailPerson", args.id);
            client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuyu hapisten serbest bıraktı`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncu serbest bırakıldı.`, ephemeral: false });
        }
    },
};
