const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cotizador')
    .setDescription('Cotiza una moneda')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The gif category')
        .setRequired(true)
        .addChoices(
          { name: 'Funny', value: 'gif_funny' },
          { name: 'Meme', value: 'gif_meme' },
          { name: 'Movie', value: 'gif_movie' },
        )),
  async execute(interaction) {
    await interaction.reply('chao!');
  },
};