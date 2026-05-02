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
    name: "saat",
    description: "Şehir saatini ayarla",
    role: "admin",

    options: [
        {
            name: "hour",
            description: "Ayarlanacak saat",
            required: true,
            type: "STRING",
            choices: [
                { name: "01:00", value: "1" },
                { name: "02:00", value: "2" },
                { name: "03:00", value: "3" },
                { name: "04:00", value: "4" },
                { name: "05:00", value: "5" },
                { name: "06:00", value: "6" },
                { name: "07:00", value: "7" },
                { name: "08:00", value: "8" },
                { name: "09:00", value: "9" },
                { name: "10:00", value: "10" },
                { name: "11:00", value: "11" },
                { name: "12:00", value: "12" },
                { name: "13:00", value: "13" },
                { name: "14:00", value: "14" },
                { name: "15:00", value: "15" },
                { name: "16:00", value: "16" },
                { name: "17:00", value: "17" },
                { name: "18:00", value: "18" },
                { name: "19:00", value: "19" },
                { name: "20:00", value: "20" },
                { name: "21:00", value: "21" },
                { name: "22:00", value: "22" },
                { name: "23:00", value: "23" },
                { name: "00:00", value: "24" },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "Bu komut çalışmak için QBCore'un `qb-weathersync` kaynağına ihtiyaç duyuyor.", ephemeral: false });
        // doesn't give any feedback to rely on :/
        emit("qb-weathersync:server:setTime", args.hour, "0");
        client.utils.log.info(`[${interaction.member.displayName}] saati ${args.hour} olarak ayarladı`);
        return interaction.reply({ content: "Saat ayarlandı.", ephemeral: false });
    },
};
