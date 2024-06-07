const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

GOOD_EXTENSIONS = process.env.GOOD_EXTENSIONS.split(',')
IMGUR_LINKS = process.env.IMGUR_LINKS.split(',')

class Core {
    constructor(config) {
        this.config = config;
    }

    async fetchFromApi(url) {
        const response = await fetch(url);
        if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.json();
    }

    async _getImgs(subs) {
        const maxTries = 5;
        let tries = 0;

        const getRandomSub = () => subs[Math.floor(Math.random() * subs.length)];

        while (tries < maxTries) {
            const sub = getRandomSub();
            try {
                const useRedditApi = await this.config.useRedditApi();
                let url, subr;

                if (useRedditApi) {
                    const response = await this.fetchFromApi(process.env.REDDIT_BASEURL.replace("{sub}", sub));
                    const { data } = response;
                    if (!data || data.children.length === 0) {
                        tries++;
                        continue;
                    }

                    const content = data.children[0].data;
                    url = content.url;
                    subr = content.subreddit;
                } else {
                    const response = await this.fetchFromApi(`${process.env.MARTINE_API_BASE_URL}?name=${sub}`);
                    if (!response.data) {
                        tries++;
                        continue;
                    }

                    url = response.data.image_url;
                    subr = response.data.subreddit.name;
                }

                url = this.adjustImageUrl(url);
                if (!this.isValidUrl(url)) {
                    tries++;
                    continue;
                }
                return [url, subr];
            } catch (error) {
                console.error('Failed to get images:', error);
                tries++;
            }
        }
        return [null, null];
    }

    adjustImageUrl(url) {
        if (url.endsWith(".mp4")) {
            return url.slice(0, -4) + ".gif";
        } else if (url.endsWith(".gifv")) {
            return url.slice(0, -1);
        } else if (IMGUR_LINKS.some(link => url.startsWith(link))) {
            return url + ".png";
        }
        return url;
    }


    async _getOthersImgs(message, url) {
        try {
            const data = await this.fetchFromApi(url);
            return {
                img: data
            };
        } catch (error) {
            console.error(error);
            await this._apiErrorsMsg(message, "JSON decode failed");
            return null;
        }
    }

    async maybeSendEmbed(interaction, embed) {
        try {
            if (embed instanceof EmbedBuilder) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error sending embed:', error);
            return;
        }
    }

    async createImageEmbed(interaction, subs, name) {
        try {
            const [url, subr] = await this._getImgs(subs);
            if (!url) return;

            let em;
            if (url.includes("not_embed_domains")) {
                em = {
                    description: `Here is ${name} gif ... \n👀\n\nRequested by **${interaction.user.username}** • From **r/${subr}**\n${url}`,
                    color: 0xff6464
                };
            } else {
                em = {
                    title: `Here is ${name} image ... \n👀`,
                    description: `[Link if you don't see image](${url})`,
                    image: { url },
                    footer: {
                        text: `Requested by ${interaction.user.username} • From r/${subr}`
                    },
                    color: 0xff6464
                };
            }
            return em;
        } catch (error) {
            console.error('Error creating embed:', error);
            return null;
        }
    }

    async _apiErrorsMsg(message, errorCode) {
        await message.reply("Error when trying to contact image service, please try again later. (Code: " + errorCode + ")");
    }
}

module.exports = Core;