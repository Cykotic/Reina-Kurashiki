const {
    SlashCommandBuilder
} = require("discord.js");
const Core = require('../../utils/core');
const {
    getR34Subreddits
} = require('../../utils/constants');

const core = new Core({
    useRedditApi: () => Promise.resolve(true)
});

module.exports = {
    nsfw: true,
    data: new SlashCommandBuilder()
        .setName('r34')
        .setDescription('Sends some r34 images from random subreddits.'),
    async execute(interaction) {
        try {
            const embedData = await core.createImageEmbed(interaction, getR34Subreddits(), 'r34');
            if (embedData) {
                await core.maybeSendEmbed(interaction, embedData);
            } else {
                await interaction.reply('An error occurred while creating the embed.');
            }
        } catch (error) {
            console.error('Error sending r34 images:', error);
            await interaction.reply('An error occurred while getting the r34 images. Please try again later.');
        }
    }
}