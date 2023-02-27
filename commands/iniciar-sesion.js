const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iniciar-sesion')
    .setDescription('Inicia sesion en la API'),
  async execute(interaction) {

    try {

      const credentials =db.prepare(`
        SELECT email, password
        FROM users
        WHERE discord_id =?
      `).get(interaction.user.id);
      const { data:response } = await axios.post('http://api.cup2022.ir/api/v1/user/login', credentials);
      const token = response.data.token;
      db.prepare (`
            UPDATE users
            SET token = ?
            WHERE discord_id = ?        
        `).run(token, interaction.user.id);
      await interaction.reply('Registrado exitosamente!');
    } catch (error) {
      console.log(error);

    }
  },
};