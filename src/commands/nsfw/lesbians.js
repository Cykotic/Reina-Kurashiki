const {
    SlashCommandBuilder
} = require("discord.js");
const Core = require('../../utils/core');
const {
    getLESBIANSSubreddits
} = require('../../utils/constants');

const core = new Core({
    useRedditApi: () => Promise.resolve(true)
});

module.exports = {
    nsfw: true,
    data: new SlashCommandBuilder()
        .setName('lesbians')
        .setDescription('Sends some lesbians images from random subreddits.')
        .setNSFW(true),
    async execute(interaction) {
        try {
            const embedData = await core.createImageEmbed(interaction, getLESBIANSSubreddits(), 'lesbians');
            if (embedData) {
                await core.maybeSendEmbed(interaction, embedData);
            } else {
                await interaction.reply('An error occurred while creating the embed.');
            }
        } catch (error) {
            console.error('Error sending lesbians images:', error);
            await interaction.reply('An error occurred while getting the lesbians images. Please try again later.');
        }
    }
}