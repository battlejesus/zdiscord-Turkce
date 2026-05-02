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
    name: "para",
    description: "Oyuncunun şehir içi parasını yönet",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "Oyuncuya para ekle",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "Eklenecek para türü",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Nakit", value: "cash" },
                        { name: "Banka", value: "bank" },
                        { name: "Kripto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "Eklenecek miktar",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
            description: "Oyuncudan para çıkar",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "Çıkarılacak para türü",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Nakit", value: "cash" },
                        { name: "Banka", value: "bank" },
                        { name: "Kripto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "Çıkarılacak miktar",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "Oyuncunun parasını ayarla (ÜZERİNE YAZAR)",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "Ayarlanacak para türü",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Nakit", value: "cash" },
                        { name: "Banka", value: "bank" },
                        { name: "Kripto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "Ayarlanacak miktar",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Oyuncunun mevcut mali durumunu görüntüle",
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
        const characterName = `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`;
        const reason = "Yetkili müdahalesi";
        if (args.inspect) {
            const embed = new client.Embed().setTitle(`${characterName} Parası`);
            let desc = "";
            Object.entries(player.PlayerData.money).forEach(([type, value]) => {
                desc += `**${type}:** $${value.toLocaleString("en-US")}\n`;
            });
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }
        if (args.amount < 0) return interaction.reply({ content: "Lütfen yalnızca pozitif miktarlar kullanın.", ephemeral: true });
        const prevMoney = player.Functions.GetMoney(args.moneytype);
        if (args.add) {
            if (player.Functions.AddMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun ${args.moneytype} hesabına ${args.amount} ekledi [Önceki: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id}) adlı oyuncunun ${args.moneytype} bakiyesi ${prevMoney} → ${player.Functions.GetMoney(args.moneytype)} olarak güncellendi.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Bu oyuncuya para eklenmeye çalışılırken bir hata oluştu.", ephemeral: false });
            }
        } else if (args.remove) {
            if (player.Functions.RemoveMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun ${args.moneytype} hesabından ${args.amount} çıkardı [Önceki: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id}) adlı oyuncunun ${args.moneytype} bakiyesi ${prevMoney} → ${player.Functions.GetMoney(args.moneytype)} olarak güncellendi.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Bu oyuncudan para çıkarılmaya çalışılırken bir hata oluştu.", ephemeral: false });
            }
        } else if (args.set) {
            if (player.Functions.SetMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun ${args.moneytype} bakiyesini ${args.amount} olarak ayarladı [Önceki: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id}) adlı oyuncunun ${args.moneytype} bakiyesi ${player.Functions.GetMoney(args.moneytype)} olarak ayarlandı. (Önceki: ${prevMoney})`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Bu oyuncunun parası ayarlanmaya çalışılırken bir hata oluştu.", ephemeral: false });
            }
        }
    },
};
