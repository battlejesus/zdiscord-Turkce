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
    name: "embed",
    description: "Belirtilen kanala gömülü (şık) mesaj gönder",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "simple",
            description: "Kolay kullanımlı embed oluşturucu",
            options: [
                {
                    name: "channel",
                    description: "Embedin gönderileceği kanal",
                    required: true,
                    type: "CHANNEL",
                },
                {
                    name: "message",
                    description: "Markdown destekli mesaj",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "title",
                    description: "Embed başlığı (kısa)",
                    required: false,
                    type: "STRING",
                },
                {
                    name: "image",
                    description: "Embed edilecek resmin URL'si",
                    required: false,
                    type: "STRING",
                },
                {
                    name: "thumbnail",
                    description: "İkon olarak kullanılacak resmin URL'si",
                    required: false,
                    type: "STRING",
                },
                {
                    name: "footer",
                    description: "Alt bilgi metni",
                    required: false,
                    type: "STRING",
                },
                {
                    name: "color",
                    description: "Embed rengi (örnek: #007bff)",
                    required: false,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "complex",
            description: "JSON string ile embed gönder",
            options: [
                {
                    name: "channel",
                    description: "Embedin gönderileceği kanal",
                    required: true,
                    type: "CHANNEL",
                },
                {
                    name: "json",
                    description: "Gönderilecek JSON string",
                    required: true,
                    type: "STRING",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        const channel = interaction.guild.channels.cache.get(args.channel);
        if (!channel || channel.type !== "GUILD_TEXT") return interaction.reply({ content: "Bu, gönderi yapabileceğim geçerli bir kanal değil.", ephemeral: true });
        if (args.simple) {
            const embed = new client.Embed();
            if (args.title) embed.setTitle(args.title);
            if (args.footer) embed.setFooter({ text: args.footer });
            if (args.image) {
                if (/^(http[s]?:\/\/.*\.(?:png|jpg|gif|jpeg))/i.test(args.image)) embed.setImage(args.image);
                else return interaction.reply({ content: "Resim bağlantısı geçersiz görünüyor.", ephemeral: true });
            }
            if (args.color) {
                if (/^#[0-9A-F]{6}$/i.test(args.color)) embed.setColor(args.color);
                else return interaction.reply({ content: "Renk geçersiz. Hex değeri girin (örnek: #ff22cc).", ephemeral: true });
            }
            if (args.thumbnail) {
                if (/^(http[s]?:\/\/.*\.(?:png|jpg|gif|jpeg))/i.test(args.thumbnail)) embed.setThumbnail(args.thumbnail);
                else return interaction.reply({ content: "Thumbnail bağlantısı geçersiz görünüyor.", ephemeral: true });
            }
            embed.setDescription(args.message.replace(/<br>/ig, "\n"));
            channel.send({ embeds: [ embed ] });
        } else if (args.complex) {
            let embed = args.json;
            try {
                embed = JSON.parse(args.json);
            } catch (e) {
                return interaction.reply({ content: "JSON geçersiz görünüyor.", ephemeral: true });
            }
            channel.send({ embeds: [ embed ] });
        }
        return interaction.reply({ content: "Embed yayımlandı.", ephemeral: false });
    },
};
