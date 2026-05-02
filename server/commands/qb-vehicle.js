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

const useNotifyInsteadOfChat = false;
const vehicleStates = {
    0: "Sokakta",
    1: "Garajda",
    2: "Polis Müsaderesinde",
    3: "3",
};

module.exports = {
    name: "arac",
    description: "Oyuncuya sabit plakalı araç ver",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "give",
            description: "Oyuncuya araç ver",
            options: [
                {
                    name: "id",
                    description: "Oyuncunun mevcut ID'si",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "model",
                    description: "Aracın spawn hash'i (örn: t20)",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "plate",
                    description: "Araca verilecek plaka (maks 8 karakter)",
                    required: false,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "lookup",
            description: "Plakaya göre araç sorgula",
            options: [
                {
                    name: "plate",
                    description: "Sorgulanacak plaka",
                    required: true,
                    type: "STRING",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {

        if (args.give) {
            if (!GetPlayerName(args.id)) return interaction.reply({ content: "Bu ID geçersiz görünüyor.", ephemeral: true });
            const player = client.QBCore.Functions.GetPlayer(args.id);
            const vehicles = client.QBCore.Shared.Vehicles;
            const vehicle = vehicles[Object.keys(vehicles).find(key => key.toLowerCase() === args.model.toLowerCase())];
            if (!vehicle) return interaction.reply({ content: `\`${args.model}\` adlı araç modeli mevcut değil.`, ephemeral: true });

            const plate = args.plate ? args.plate.toUpperCase() : await createPlate();
            if (plate.length > 8) return interaction.reply({ content: "Plaka en fazla 8 karakter olabilir.", ephemeral: true });
            const exists = await getVehicleByPlate(plate);
            if (exists.length > 0) return interaction.reply({ content: "Bu plaka başka bir araçta kullanılıyor.", ephemeral: true });

            const save = await global.exports.oxmysql.insert_async("INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state, garage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                player.PlayerData.license, player.PlayerData.citizenid, vehicle.model, vehicle.hash, "{}", plate, 1, "pillboxgarage",
            ]);
            if (!save) return interaction.reply({ content: "Araç kaydedilirken bir hata oluştu.", ephemeral: true });

            client.utils.log.info(`[${interaction.member.displayName}] ${GetPlayerName(args.id)} (${args.id}) adlı oyuncuya ${plate} plakalı ${args.model} aracı verdi`);
            const playerMessage = `${vehicle.name} garajınıza eklendi (Plaka: ${plate})`;

            if (useNotifyInsteadOfChat) emitNet("QBCore:Notify", args.id, playerMessage);
            else client.utils.chatMessage(args.id, "Hükümet", playerMessage, { color: [65, 105, 225] });

            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncuya ${vehicle.name} aracı verildi. Plaka: ${plate}`, ephemeral: false });
        }
        else if (args.lookup) {
            let vehicle = await getVehicleByPlate(args.plate);
            if (vehicle.length < 1) return interaction.reply({ content: "Bu plakaya sahip araç bulunamadı.", ephemeral: true });
            vehicle = vehicle[0];
            const embed = new client.Embed();
            embed.setDescription(`**Plaka:** ${vehicle.plate}
                **Sahip ID:** ${vehicle.citizenid}
                **Araç:** ${vehicle.vehicle}
                **Garaj:** ${vehicle.garage}
                **Durum:** ${vehicleStates[vehicle.state] ?? "Yakın Zamanda Satın Alındı?"}
                **Yakıt:** ${vehicle.fuel}/100
                **Kasa:** ${vehicle.body}/1000
                **Statü:** ${vehicle.status ?? "Yok"}
                **Kilometre:** ${vehicle.drivingdistance ?? 0}

                **Finansman Detayları:**
                **Bakiye:** $${vehicle.balance}
                **Taksit Tutarı:** $${vehicle.paymentamount}
                **Kalan Taksit:** ${vehicle.paymentsleft}
                **Finansman Süresi:** ${vehicle.financetime}`);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }
    },
};

async function getVehicleByPlate(plate) {
    return await global.exports.oxmysql.query_async("SELECT * FROM player_vehicles WHERE plate = ?", [plate]);
}

async function createPlate() {
    let plate = generatePlate();
    let taken = true;
    while (taken) {
        const exists = await getVehicleByPlate(plate);
        if (exists.length > 0) plate = generatePlate();
        else taken = false;
    }
    return plate;
}

function generatePlate() {
    return `${random(1, false)}${random(2)}${random(3, false)}${random(2)}`;
}

const random = (length = 8, alphabetical = true) => {
    const chars = alphabetical ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
};
