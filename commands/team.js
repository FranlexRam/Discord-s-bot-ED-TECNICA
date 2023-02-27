const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-equipo')
    .setDescription('Muestra informacion del equipo en el mundial!')
    .addStringOption(option =>
      option.setName('equipo')
        .setDescription('Nombre del equipo')
        .setRequired(true)),
  async execute(interaction) {

    try {
      const team = interaction.options.getString('equipo');

      const { token } = db.prepare(`
      SELECT token from users
      WHERE discord_id = ?
      `).get(interaction.user.id);

      console.log(token);

      const { data:response } = await axios.get('http://api.cup2022.ir/api/v1/team', {
        headers: { 'Authorization' : `Bearer ${token}` }
      });
      console.log(response.data);

      await interaction.reply('Registrado exitosamente!');
    } catch (error) {
      //ver errores de la API
      console.log(error?.response?.data?.message);
      if (error?.response?.data?.message) {
        return await interaction.reply('User validation failed: email: Please provide a valid email, password: Path `password` (`00`) is shorter than the minimum allowed length (8)., passwordConfirm: Path `passwordConfirm` (`00`) is shorter than the minimum allowed length (8)');
      }
      //otros errores
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