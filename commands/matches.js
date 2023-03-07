const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

const createEmbed = (team) => {
  // 2. Create embed with builder
  const exampleEmbed = new EmbedBuilder()
    //.setColor()
    .setTitle(team.home_team_en)
    //.setURL(`https://en.wikipedia.org/wiki/${team.name.common}`)
    .setDescription('Shows team matches')
    .setThumbnail(team.home_flag)
    .addFields(
      { name: 'Local date', value: team.local_date },
      { name: 'Match Day', value: team.matchday, inline: true },
      { name: 'Home team', value: team.home_team_en, inline: true },
      { name: 'Away team', value: team.away_team_en, inline: true },
      { name: 'Home Score', value: `${team.home_score}`, inline: true },
      { name: 'Away Score', value: `${team.away_score}`, inline: true },
      //{ name: 'Temperature', value: `${weather.main.temp} C`, inline: true },
      //{ name: 'Weather', value: `${weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.substring(1)}`, inline: true },
    )
    //.addFields({ name: 'Time-zone', value: team.timezones[0], inline: true })
    //.setImage(team.home_flag);
    //.setImage(team.away_flag);
    //.setFooter({ text: 'Some climate here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  return exampleEmbed;

};






module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-partidos')
    .setDescription('Shows team matches!')
    .addStringOption(option =>
      option.setName('equipo')
        .setDescription('Nombre del equipo')
        .setRequired(true)),
  async execute(interaction) {


    await interaction.deferReply();

    try {
      const team = interaction.options.getString('equipo');

      const { token } = db.prepare(`
      SELECT token from users
      WHERE discord_id = ?
      `).get(interaction.user.id);

      console.log(token);

      const { data:response } = await axios.get('http://api.cup2022.ir/api/v1/match', {
        headers: { 'Authorization' : `Bearer ${token}` }
      });
      //const t = response.data.find(equipo => equipo.name_en === team);
      const matches = response.data.filter(equipo => equipo.home_team_en === team || equipo.away_team_en === team);

      if (matches.length === 0) {
        return await interaction.editReply('El pais no participo en el mundial Qatar22');
      }

      console.log(response);
      const embed = createEmbed(matches[2]);
      await interaction.editReply( { embeds: [embed] } );
    } catch (error) {
      //ver errores de la API
      console.log(error?.response?.data?.message);
      if (error?.response?.data?.message) {
        return await interaction.editReply('User validation failed: email: Please provide a valid email, password: Path `password` (`00`) is shorter than the minimum allowed length (8)., passwordConfirm: Path `passwordConfirm` (`00`) is shorter than the minimum allowed length (8)');
      }

      //otros errores
      console.log(error.message);
      switch (error.message) {
      case 'Cannot read properties of undefined (reading name_en)':
        return await interaction.editReply('El pais no participo en el mundial');
      case 'UNIQUE constraint failed: users.email':
        return await interaction.editReply('Tu email ya se encuentra registrado');
      default:
        return await interaction.editReply('Hubo un error!');
      }

    }
  },
};