const {
    SlashCommandBuilder
} = require("discord.js");
const Core = require('../../utils/core');
const {
    getTRANSSubreddits
} = require('../../utils/constants');

const core = new Core({
    useRedditApi: () => Promise.resolve(true)
});

module.exports = {
    nsfw: true,
    data: new SlashCommandBuilder()
        .setName('trans')
        .setDescription('Sends some trans images from random subreddits.'),
    async execute(interaction) {
        try {
            const embedData = await core.createImageEmbed(interaction, getTRANSSubreddits(), 'trans');
            if (embedData) {
                await core.maybeSendEmbed(interaction, embedData);
            } else {
                await interaction.reply('An error occurred while creating the embed.');
            }
        } catch (error) {
            console.error('Error sending trans images:', error);
            await interaction.reply('An error occurred while getting the trans images. Please try again later.');
        }
    }
}