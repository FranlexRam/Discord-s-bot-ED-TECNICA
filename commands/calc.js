const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Suma, resta, divide o multiplica dos numeros!')
    .addStringOption(option =>
      option.setName('operation')
        .setDescription('La operacion a realizar')
        .setRequired(true)),
  async execute(interaction) {
    const operation = interaction.options.getString('operation');
    if (operation.includes('+')) {
      await interaction.reply('tiene un +');
    } else {
      await interaction.reply('NO contine un +');
    }
    await interaction.reply(operation);
  },
};