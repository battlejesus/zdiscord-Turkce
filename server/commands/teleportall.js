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
    name: "teleport-all",
    description: "Herkesi ışınla",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "coords",
            description: "Belirli koordinatlara ışınla",
            options: [
                {
                    name: "x",
                    description: "X koordinatı",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "y",
                    description: "Y koordinatı",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "z",
                    description: "Z koordinatı",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "preset",
            description: "Önceden belirlenmiş bir konuma ışınla",
            options: [
                {
                    name: "location",
                    description: "Işınlanılacak konum",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Havaalanı", value: "airport" },
                        { name: "Maze Bank Çatısı", value: "mazeroof" },
                        { name: "Del Perro İskelesi", value: "pier" },
                        { name: "Fort Zancudo Üssü", value: "militarybase" },
                        { name: "Mount Chiliad", value: "chiliad" },
                    ],
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        const locations = {
            "airport": [ -1096.19, -3501.1, 17.18 ],
            "mazeroof": [ -75.57, -818.88, 327.96 ],
            "pier": [ -1712.06, -1136.48, 13.08 ],
            "militarybase": [ -2105.88, 2871.16, 32.81 ],
            "chiliad": [ 453.73, 5572.2, 781.18 ],
        };
        if (args.coords) {
            teleportEveryone(args.x, args.y, args.z);
            client.utils.log.info(`[${interaction.member.displayName}] HERKESİ ${args.x}, ${args.y}, ${args.z} koordinatlarına ışınladı`);
            return interaction.reply({ content: "Herkes ışınlandı.", ephemeral: false });
        } else if (args.preset) {
            teleportEveryone(locations[args.location][0], locations[args.location][1], locations[args.location][2]);
            client.utils.log.info(`[${interaction.member.displayName}] HERKESİ ${args.location} konumuna ışınladı`);
            return interaction.reply({ content: `Herkes ${args.location} konumuna ışınlandı.`, ephemeral: false });
        }
    },
};

function teleportEveryone(x, y, z) {
    x = x.toFixed(2);
    y = y.toFixed(2);
    z = z.toFixed(2);
    emitNet(`${GetCurrentResourceName()}:teleport`, -1, x, y, z, false);
}
