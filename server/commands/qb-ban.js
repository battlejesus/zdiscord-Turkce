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
    name: "ban",
    description: "Bir oyuncuyu banla",
    role: "admin",

    options: [
        {
            name: "id",
            description: "Oyuncunun mevcut ID'si",
            required: true,
            type: "INTEGER",
        },
        {
            name: "time",
            description: "Oyuncunun kaç saniye banlanacağı",
            required: true,
            type: "INTEGER",
        },
        {
            name: "reason",
            description: "Ban sebebi",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Bu ID geçersiz görünüyor.", ephemeral: true });
        if (args.time < 0) return interaction.reply({ content: "Süre pozitif bir sayı olmalıdır.", ephemeral: true });
        // const player = client.QBCore.Functions.GetPlayer(args.id);
        /* If this event is fixed the code following can be removed.
        emit("qb-admin:server:ban", player, time, reason);
        */
        const bantime = args.time < 2147483647 ? (args.time + Math.floor(Date.now() / 1000)) : 2147483647;
        global.exports.oxmysql.insert_async("INSERT INTO bans (name, license, discord, ip, reason, expire, bannedby) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            GetPlayerName(args.id),
            client.QBCore.Functions.GetIdentifier(args.id, "license"),
            client.QBCore.Functions.GetIdentifier(args.id, "discord"),
            client.QBCore.Functions.GetIdentifier(args.id, "ip"),
            args.reason,
            bantime,
            interaction.member.id,
        ]);
        client.utils.chatMessage(-1, client.z.locale.announcement, `${GetPlayerName(args.id)} kurallara uymadığı için banlandı.`, { color: [ 155, 0, 0 ] });
        emit("qb-log:server:CreateLog", "bans", "Oyuncu Banlandı", "red", `${GetPlayerName(args.id)}, ${interaction.member.displayName} tarafından ${args.reason} sebebiyle banlandı.`, true);
        if (bantime >= 2147483647) {
            DropPlayer(args.id, `Banlandınız:\n${args.reason}\n\nBanınız kalıcıdır.\n🔸 Daha fazla bilgi için Discord sunucumuza katılın: ${client.QBCore.Config.Server.discord}`);
        } else {
            DropPlayer(args.id, `Banlandınız:\n${args.reason}\n\nBanınız ${args.time / 60} dakika sonra sona erecek.\n🔸 Daha fazla bilgi için Discord sunucumuza katılın: ${client.QBCore.Config.Server.discord}`);
        }

        // End of filler code

        client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuyu ${args.time} saniye banladı`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}), ${args.time / 60} dakika süreyle banlandı.`, ephemeral: false });
    },
};
