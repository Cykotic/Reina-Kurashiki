const ownerId = process.env.OwnersId;
const {
    EmbedBuilder
} = require("discord.js");
const mainSchema = require("../../modals/maintenance");


module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            if (interaction.isCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;

                /* NSFW channel check */
                if (command.nsfw && !interaction.channel.nsfw) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`This command can only be used in NSFW channels.`)
                            .setColor(0xff6464)
                        ],
                        ephemeral: true
                    });
                }

                /* owner check */
                if (command.ownerId && !ownerId.includes(interaction.user.id)) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`Only The **"Bot Owner"** can you use this command`)
                            .setColor(0xff6464)
                        ],
                        ephemeral: true
                    });
                }
                /* maintenance checks */
                const dataMain = await mainSchema.findOne({
                    Type: "Main"
                });
                const maintenance = !!dataMain;

                if (maintenance && !ownerId.includes(interaction.user.id)) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`${client.user.username} is currently under maintenance!`)
                            .setColor(0xff6464)
                        ],
                        ephemeral: true
                    });
                } else {
                    await command.execute(interaction, client);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
};