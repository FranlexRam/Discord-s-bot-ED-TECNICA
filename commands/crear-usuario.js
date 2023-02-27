const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crear-usuario')
    .setDescription('Un usuario en la base de datos')
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('Primer nombre y primer apellido')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('contrasena')
        .setDescription('Tu contrasena')
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
      const password = interaction.options.getString('contrasena');
      const email = interaction.options.getString('email');
      const country = interaction.options.getString('pais');


      const newUser = {
        name,
        email,
        password,
        passwordConfirm: password,
      };

      await axios.post('http://api.cup2022.ir/api/v1/user', newUser);

      db.prepare(`
      INSERT INTO users (discord_id, name, email, password, country)
      VALUES (?, ?, ?, ?, ?)
      `).run(interaction.user.id, name, email, password, country);
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