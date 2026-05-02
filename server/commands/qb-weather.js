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
    name: "hava",
    description: "Şehir içi hava durumunu yönet",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "Hava durumunu bir ön ayara göre ayarla",
            options: [
                {
                    name: "weather",
                    description: "Mevcut hava durumu ön ayarları",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Güneşli", value: "EXTRASUNNY" },
                        { name: "Açık", value: "CLEAR" },
                        { name: "Nötr", value: "NEUTRAL" },
                        { name: "Sisli (Duman)", value: "SMOG" },
                        { name: "Puslu", value: "FOGGY" },
                        { name: "Kapalı", value: "OVERCAST" },
                        { name: "Bulutlu", value: "CLOUDS" },
                        { name: "Açılıyor", value: "CLEARING" },
                        { name: "Yağmurlu", value: "RAIN" },
                        { name: "Gök Gürültülü", value: "THUNDER" },
                        { name: "Karlı", value: "SNOW" },
                        { name: "Hafif Karlı", value: "SNOWLIGHT" },
                        { name: "Tipi", value: "BLIZZARD" },
                        { name: "Noel Teması", value: "XMAS" },
                        { name: "Cadılar Bayramı Teması", value: "HALLOWEEN" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "blackout",
            description: "Karartmayı aç/kapat",
        },
    ],

    run: async (client, interaction, args) => {
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "Bu komut çalışmak için QBCore'un `qb-weathersync` kaynağına ihtiyaç duyuyor.", ephemeral: false });
        if (args.blackout) {
            emit("qb-weathersync:server:toggleBlackout");
            client.utils.log.info(`[${interaction.member.displayName}] karartmayı değiştirdi`);
            return interaction.reply({ content: "Karartma durumu değiştirildi.", ephemeral: false });
        } else if (args.set) {
            emit("qb-weathersync:server:setWeather", args.weather);
            client.utils.log.info(`[${interaction.member.displayName}] hava durumunu ${args.weather} olarak değiştirdi`);
            return interaction.reply({ content: "Hava durumu güncellendi.", ephemeral: false });
        }
    },
};
