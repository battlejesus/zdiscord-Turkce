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
    name: "whitelist",
    description: "Beyaz listeyi yönet",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "toggle",
            description: "Beyaz listeyi etkinleştir / devre dışı bırak",
            options: [
                {
                    name: "enabled",
                    description: "Beyaz listeyi aç veya kapat",
                    required: true,
                    type: "BOOLEAN",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "addrole",
            description: "Beyaz listeye geçici rol ekle (yeniden başlatmada config'e döner)",
            options: [
                {
                    name: "role",
                    description: "Beyaz listeye eklenecek rol",
                    required: true,
                    type: "ROLE",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "removerole",
            description: "Beyaz listeden geçici rol çıkar (yeniden başlatmada config'e döner)",
            options: [
                {
                    name: "role",
                    description: "Beyaz listeden çıkarılacak rol",
                    required: true,
                    type: "ROLE",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        if (args.toggle) {
            const prev = client.config.EnableWhitelistChecking;
            client.config.EnableWhitelistChecking = args.enabled;
            return interaction.reply({ content: `Beyaz liste daha önce ${prev ? "açık" : "kapalı"} idi, şimdi ${args.enabled ? "açık" : "kapalı"}.`, ephemeral: true });
        } else if (args.addrole) {
            if (client.config.DiscordWhitelistRoleIds.includes(args.role)) {
                return interaction.reply({ content: "Bu rol zaten beyaz listede.", ephemeral: true });
            }
            client.config.DiscordWhitelistRoleIds.push(args.role);
            return interaction.reply({ content: "Rol yeniden başlatılana kadar beyaz listeye eklendi.", ephemeral: true });
        } else if (args.removerole) {
            if (!client.config.DiscordWhitelistRoleIds.includes(args.role)) {
                return interaction.reply({ content: "Bu rol beyaz listede değil.", ephemeral: true });
            }
            client.config.DiscordWhitelistRoleIds = client.config.DiscordWhitelistRoleIds.filter(item => item !== args.role);
            return interaction.reply({ content: "Rol beyaz listeden çıkarıldı.", ephemeral: true });
        }

    },
};
