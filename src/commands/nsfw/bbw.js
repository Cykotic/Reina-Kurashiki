const {
    SlashCommandBuilder
} = require("discord.js");
const Core = require('../../utils/core');
const {
    getBBWSubreddits
} = require('../../utils/constants');

const core = new Core({
    useRedditApi: () => Promise.resolve(true)
});

module.exports = {
    nsfw: true,
    data: new SlashCommandBuilder()
        .setName('bbw')
        .setDescription('Sends some anal images from random subreddits.'),
    async execute(interaction) {
        try {
            const embedData = await core.createImageEmbed(interaction, getBBWSubreddits(), 'BBW');
            if (embedData) {
                await core.maybeSendEmbed(interaction, embedData);
            } else {
                await interaction.reply('An error occurred while creating the embed.');
            }
        } catch (error) {
            console.error('Error sending BBW images:', error);
            await interaction.reply('An error occurred while getting the bbw images. Please try again later.');
        }
    }
}