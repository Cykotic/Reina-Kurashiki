const {
    SlashCommandBuilder
} = require("discord.js");
const Core = require('../../utils/core');
const {
    getDEEPTHROATSubreddits
} = require('../../utils/constants');

const core = new Core({
    useRedditApi: () => Promise.resolve(true)
});

module.exports = {
    nsfw: true,
    data: new SlashCommandBuilder()
        .setName('deepthroat')
        .setDescription('Sends some deepthroat images from random subreddits.'),
    async execute(interaction) {
        try {
            const embedData = await core.createImageEmbed(interaction, getDEEPTHROATSubreddits(), 'Deepthroat');
            if (embedData) {
                await core.maybeSendEmbed(interaction, embedData);
            } else {
                await interaction.reply('An error occurred while creating the embed.');
            }
        } catch (error) {
            console.error('Error sending Deepthroat images:', error);
            await interaction.reply('An error occurred while getting the deepthroat images. Please try again later.');
        }
    }
}