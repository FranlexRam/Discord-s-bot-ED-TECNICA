const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crear-usuario')
    .setDescription('Un usuario en la base de datos')
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('Tu primer nombre')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('apellido')
        .setDescription('Tu primer apellido')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('email')
        .setDescription('Tu correo electronico')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('pais')
        .setDescription('Tu pais de residencia')
        .setRequired(true)),
  async execute(interaction) {

    try {
      const name = interaction.options.getString('nombre');
      const lastName = interaction.options.getString('apellido');
      const email = interaction.options.getString('email');
      const country = interaction.options.getString('pais');

      db.prepare(`
      INSERT INTO users (discord_id, first_name, last_name, email, country)
      VALUES (?, ?, ?, ?, ?)
      `).run(interaction.user.id, name, lastName, email, country);
      await interaction.reply('Registrado exitosamente!');

    } catch (error) {
      console.log(error.message);
      switch (error.message) {
      case 'UNIQUE constraint failed: users.discord_id':
        return await interaction.reply('Tu usuario ya se encuentra registrado');
      case 'UNIQUE constraint failed: users.email':
        return await interaction.reply('Tu email ya se encuentra registrado');
      default:
        return await interaction.reply('Hubo un error!');
      }

    }
  },
};