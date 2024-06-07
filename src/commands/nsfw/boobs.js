const {
    SlashCommandBuilder
} = require("discord.js");
const Core = require('../../utils/core');
const {
    getBoobsSubreddits
} = require('../../utils/constants');

const core = new Core({
    useRedditApi: () => Promise.resolve(true)
});

module.exports = {
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName('boobs')
        .setDescription('Sends some lesbians images from random subreddits.'),
    async execute(interaction) {
        try {
            const embedData = await core.createImageEmbed(interaction, getBoobsSubreddits(), 'boobs');
            if (embedData) {
                await core.maybeSendEmbed(interaction, embedData);
            } else {
                await interaction.reply('An error occurred while creating the embed.');
            }
        } catch (error) {
            console.error('Error sending boobs images:', error);
            await interaction.reply('An error occurred while getting the lesbians images. Please try again later.');
        }
    }
}