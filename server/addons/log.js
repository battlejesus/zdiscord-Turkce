/**
 * Bu dosya zdiscord'un bir parçasıdır.
 * Telif Hakkı (C) 2021 Tony/zfbx
 * kaynak: https://github.com/zfbx/zdiscord
 *
 * Bu eser, Creative Commons
 * Atıf-GayriTicari-AynıLisanslaPaylaş 4.0 Uluslararası Lisansı kapsamında lisanslanmıştır.
 * Bu lisansın bir kopyasını görüntülemek için http://creativecommons.org/licenses/by-nc-sa/4.0/
 * adresini ziyaret edin veya Creative Commons, PO Box 1866, Mountain View, CA 94042, ABD adresine mektup gönderin.
 */

const { MessageEmbed, WebhookClient } = require("discord.js");

class Log {
    constructor(z) {
        this.z = z;
        this.enabled = z.config.EnableLoggingWebhooks;
        this.hooks = {};

        if (this.enabled) {
            StopResource("qb-logs");
            let count = 0;

            Object.entries(z.config.LoggingWebhooks).forEach(entry => {
                const [key, value] = entry;
                const k = key.toLocaleLowerCase();

                if (this.hooks[k]) return client.z.utils.log.write(
                    `${k} için Webhook zaten kayıtlı. Yinelenen anahtarı kaldırın`,
                    { tag: "WEBHOOK", error: true }
                );

                const id = value.split("/").at(-2);
                const token = value.split("/").at(-1);

                if (id.length < 16 || id.length > 28 || token.length < 50 || token.length > 80) {
                    return this.z.utils.log.write(
                        `${k} için Webhook hatalı görünüyor, değerini kontrol edin.`,
                        { tag: "WEBHOOK", error: true }
                    );
                }

                this.hooks[k] = new WebhookClient({ id: id, token: token, url: value });
                count++;
            });

            this.z.utils.log.info(`${count} webhook yüklendi.`, { tag: "WEBHOOK" });
        }

        global.exports("log", async (type, message, pingRole, color) => {
            return z.log.send(type, message, { pingRole: pingRole, color: color });
        });
    }

    /**
     * Yapılandırmada belirtilen isimli bir webhook üzerinden log gönderir
     * @param {string} type - Hangi webhook'un kullanılacağını belirleyen log/olay türü
     * @param {string} message - Loglanacak mesaj
     * @param {boolean} pingRole - Mesajın yapılandırılmış rolü etiketleyip etiketlemeyeceği
     * @param {object} options - pingRole, color, username, pingId
     * @returns {boolean} - Log olayının başarılı veya başarısız olduğu
     */
    async send(type, message, options) {
        if (!this.enabled) return false;

        if (!message || !type) return this.z.utils.log.write(
            "Mesaj veya tür olmadan log göndermeye izin verilmez",
            { tag: "WEBHOOK", error: true }
        );

        const hook = this.hooks[type.toLocaleLowerCase()];

        if (!hook) return this.z.utils.log.write(
            `"${type}" Webhook'u tanımlanmamış. Mesaj: ${message}`,
            { tag: "WEBHOOK", error: true }
        );

        const embed = new MessageEmbed()
            .setDescription(message)
            .setColor(options.color || "#1e90ff");

        const data = {
            username: options.username || this.z.config.LoggingWebhookName,
            embeds: [embed],
        };

        if (options.pingRole) data.content = `<@${options.pingId || this.z.config.LoggingAlertPingId}>`;

        await hook.send(data).catch((e) => {
            return this.z.utils.log.write(
                `${type.toLowerCase()} logu başarısız. Mesaj: ${message}. Hata: ${reply.status}`,
                { tag: "WEBHOOK", error: true }
            );
        });

        return true;
    }
}

module.exports = Log;