const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios').default;

const createEmbed = (country) => {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(country.name.common)
    .setURL(`https://en.wikipedia.org/wiki/${country.name.common}`)
    .setDescription('Show country information')
    .setThumbnail(country.flags.png)
    .addFields(
      { name: 'Capital', value: country.capital[0] },
      { name: 'Region', value: country.subregion, inline: true },
      { name: 'Habitantes', value: `${country.population}`, inline: true },
    )
    // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    //.setImage('https://i.imgur.com/AfFp7pu.png')
    //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  return exampleEmbed;

};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-pais')
    .setDescription('Muestra informacion del pais suminstrado')
    .addStringOption(option =>
      option.setName('pais')
        .setDescription('Nombre del pais')
        .setRequired(true)),
  async execute(interaction) {
    const country = interaction.options.getString('pais');
    try {
      const { data: [countryApi] } = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
      console.log(countryApi);

      const embed = createEmbed(countryApi);
      await interaction.reply( { embeds: [embed] } );





    } catch (error) {
      console.log(error);
      await interaction.reply('El pais no existe. Intenta con otro.');
    }
  },
};


