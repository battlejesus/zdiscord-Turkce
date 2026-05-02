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
    name: "envanter",
    description: "Oyuncunun şehir içi eşyalarını yönet",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "give",
            description: "Oyuncuya eşya ver",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "item",
                    description: "Verilecek eşya",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "count",
                    description: "Kaç adet verileceği [Varsayılan: 1]",
                    required: false,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "take",
            description: "Oyuncudan eşya al",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "item",
                    description: "Alınacak eşya",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "count",
                    description: "Kaç adet alınacağı [Varsayılan: 1]",
                    required: false,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Oyuncunun envanterine göz at",
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
        const amount = args.count || 1;
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Bu ID geçersiz görünüyor.", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(args.id);
        if (args.give) {
            const badItems = [ "id_card", "harness", "markedbills", "labkey", "printerdocument"];
            const itemData = client.QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply({ content: "Eşya bulunamadı.", ephemeral: false });
            if (badItems.includes(itemData["name"])) return interaction.reply({ content: "Bu benzersiz bir eşyadır ve bu şekilde işlem yapılamaz.", ephemeral: false });
            if (amount > 1 && itemData.unique) return interaction.reply({ content: "Bu eşyalar yığılamaz, birer birer verin.", ephemeral: false });
            if (player.Functions.AddItem(itemData["name"], amount, false)) {
                client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuya ${amount} adet ${args.item} verdi`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncuya ${amount} adet ${itemData.label} verildi.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Eşya verilmeye çalışılırken bir hata oluştu.", ephemeral: false });
            }
        } else if (args.take) {
            const itemData = client.QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply({ content: "Eşya bulunamadı.", ephemeral: false });
            if (player.Functions.RemoveItem(args.item, amount)) {
                client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun envanterinden ${amount} adet ${args.item} aldı`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncudan ${amount} adet ${itemData.label} alındı.`, ephemeral: false });
            } else {
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun envanterinden eşya alınamadı.`, ephemeral: false });
            }
        } else if (args.inspect) {
            const embed = new client.Embed().setTitle(`${GetPlayerName(args.id)} (${args.id}) Envanteri`);
            const items = player.PlayerData.items;
            let desc = "";
            if (typeof items === "object") {
                Object.entries(items).forEach(([key, i]) => {
                    desc += `[${i.slot}] ${i.amount}x - **${i.label}** (${i.name})\n`;
                });
            } else {
                items.forEach((i) => {
                    desc += `[${i.slot}] ${i.amount}x - **${i.label}** (${i.name})\n`;
                });
            }
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }

    },
};
