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

const { MessageButton } = require("discord.js");

module.exports = {
    name: "kaynaklar",
    description: "Sunucu kaynaklarını / scriptleri yönet",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "start",
            description: "Bir kaynak / script başlat",
            options: [
                {
                    name: "script",
                    description: "Başlatılacak kaynak / script",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "ensure",
            description: "Bir kaynağı başlat veya yeniden başlat",
            options: [
                {
                    name: "script",
                    description: "Başlatılacak veya yeniden başlatılacak kaynak / script",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "stop",
            description: "Bir kaynağı durdur",
            options: [
                {
                    name: "script",
                    description: "Durdurulacak kaynak / script",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Bir kaynağın durumunu görüntüle",
            options: [
                {
                    name: "script",
                    description: "Durumu görüntülenecek kaynak / script",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "refresh",
            description: "Kaynakları yenile",
        },
        {
            type: "SUB_COMMAND",
            name: "list",
            description: "Kaynakları listele",
        },
    ],

    run: async (client, interaction, args) => {
        if (!(args.refresh || args.inspect) && args.script == GetCurrentResourceName()) return interaction.reply({ content: "Bu scripti yeniden başlatamazsınız.", ephemeral: true });
        if (!(args.refresh || args.inspect) && args.script == "qb-core") return interaction.reply({ content: "Bu scripti asla yeniden başlatmamalısınız; sunucunuz çökebilir.", ephemeral: true });
        await interaction.deferReply();
        if (args.refresh) {
            ExecuteCommand("refresh");
            return interaction.editReply({ content: "Kaynaklar yenilendi.", ephemeral: false });
        } else if (args.inspect) {
            const reply = GetResourceState(args.script);
            return interaction.editReply({ content: `${args.script} şu anda: ${reply}`, ephemeral: false });
        } else if (args.stop) {
            const reply = StopResource(args.script);
            if (reply) return interaction.editReply({ content: `${args.script} durduruldu.`, ephemeral: false });
            else return interaction.editReply({ content: `${args.script} DURDURULAMADI veya mevcut değil.`, ephemeral: false });
        } else if (args.start) {
            const reply = StartResource(args.script);
            if (reply) return interaction.editReply({ content: `${args.script} zaten başlı değilse başlatıldı.`, ephemeral: false });
            else return interaction.editReply({ content: `${args.script} BAŞLATILAMADI; mevcut olmayabilir.`, ephemeral: false });
        } else if (args.ensure) {
            StopResource(args.script);
            const reply = StartResource(args.script);
            if (reply) return interaction.editReply({ content: `${args.script} başlatıldı / yeniden başlatıldı.`, ephemeral: false });
            else return interaction.editReply({ content: `${args.script} BAŞLATILAMADI / YENİDEN BAŞLATILAMADI; mevcut olmayabilir.`, ephemeral: false });
        } else if (args.list) {
            const r = [];
            for (let i = 0; i < GetNumResources(); i++) {
                const res = GetResourceByFindIndex(i);
                if (res && res !== "_cfx_internal" && GetResourceState(res) == "started") {
                    r.push(res);
                }
            }
            const parts = [];
            r.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })).forEach((res, index) => {
                const i = Math.floor(index / 20);
                if (!parts[i]) parts[i] = "";
                parts[i] += `${res}\n`;
            });
            const pages = [];
            parts.forEach((part) => {
                const embed = new client.Embed()
                    .setTitle(`Kaynaklar (${GetNumResources()})`)
                    .setDescription(`${part}`);
                pages.push(embed);
            });
            const backBtn = new MessageButton().setCustomId("previousbtn").setEmoji("🔺").setStyle("SECONDARY");
            const forwardBtn = new MessageButton().setCustomId("nextbtn").setEmoji("🔻").setStyle("SECONDARY");
            client.paginationEmbed(interaction, pages, [backBtn, forwardBtn]);
        }
    },
};
