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

const fs = require("fs").promises;
const Buffer = require("buffer").Buffer;

module.exports = {
    name: "screenshot",
    description: "Oyuncunun ekranının görüntüsünü al",
    role: "god",

    options: [
        {
            name: "id",
            description: "Oyuncunun mevcut ID'si",
            required: true,
            type: "INTEGER",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Bu ID geçersiz görünüyor.", ephemeral: true });
        if (GetResourceState("screenshot-basic") !== "started") return interaction.reply({ content: "Bu komut çalışmak için citizenfx'in `screenshot-basic` kaynağına ihtiyaç duyuyor.", ephemeral: false });
        await interaction.reply("Ekran görüntüsü alınıyor..");
        const name = `${client.utils.log.timestamp(true)}_${args.id}.jpg`;
        const data = await takeScreenshot(args.id).catch(error => {
            client.utils.log.error(error);
            return interaction.editReply("**Ekran görüntüsü alınırken hata oluştu**");
        });
        const buffer = new Buffer.from(data, "base64");
        const embed = new client.Embed()
            .setTitle(`${GetPlayerName(args.id)} Ekranı`)
            .setImage(`attachment://${name}`)
            .setFooter({ text: `Alınma Zamanı: ${client.utils.log.timestamp()}` });
        await interaction.editReply({ content: null, embeds: [ embed ], files: [ { attachment: buffer, name: name } ] }).catch(console.error);
        if (client.config.SaveScreenshotsToServer) {
            await fs.mkdir(`${client.root}/screenshots`, { recursive: true }).catch();
            await fs.writeFile(`${client.root}/screenshots/${name}`, data, { encoding: "base64", flag:"w+" }).catch(client.utils.log.error);
        }
        return client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncunun ekranının görüntüsünü aldı`);
    },
};

const takeScreenshot = async (id) => {
    return new Promise((resolve, reject) => {
        global.exports["screenshot-basic"]["requestClientScreenshot"](id, {}, async (error, data) => {
            if (error) return reject(error);
            resolve(data.split(";base64,").pop());
        });
    });
};
