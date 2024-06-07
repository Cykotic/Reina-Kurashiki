const {
    SlashCommandBuilder
} = require("discord.js");
const Core = require('../../utils/core');
const {
    getFUTASubreddits
} = require('../../utils/constants');

const core = new Core({
    useRedditApi: () => Promise.resolve(true)
});

module.exports = {
    nsfw: true,
    data: new SlashCommandBuilder()
        .setName('futa')
        .setDescription('Sends some Futa images from random subreddits.'),
    async execute(interaction) {
        try {
            const embedData = await core.createImageEmbed(interaction, getFUTASubreddits(), 'Futa');
            if (embedData) {
                await core.maybeSendEmbed(interaction, embedData);
            } else {
                await interaction.reply('An error occurred while creating the embed.');
            }
        } catch (error) {
            console.error('Error sending Futa images:', error);
            await interaction.reply('An error occurred while getting the futa images. Please try again later.');
        }
    }
}