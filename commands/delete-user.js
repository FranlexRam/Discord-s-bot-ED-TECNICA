const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('borrar-usuario')
    .setDescription('Borra tu usuario de la base de datos'),
  async execute(interaction) {
    try {
      const discordId = interaction.user.id;
      db.prepare(`
            SELECT FROM users
            WHERE discord_id = ?
        `).run(discordId);
      if (result.changes === 0) return await interaction.reply('El usuario no existe');
      await interaction.reply('Tu usuario fue eliminado exxitosamente.');
    } catch (error) {
      console.log(error);
      await interaction.reply('Hubo un error.');
    }

  },
};