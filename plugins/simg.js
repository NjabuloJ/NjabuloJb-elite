const config = require('../config.cjs');
const axios = require('axios');
const gis = require('g-i-s');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const imageCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const query = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['imgs', 'images'];

  if (!validCommands.includes(cmd)) {
    return;
  }

  if (!query) {
    return sock.sendMessage(m.from, { text: `Please provide some text, Example usage: ${prefix + cmd} black cats` });
  }

  try {
    await sock.sendMessage(m.from, { text: '*Please wait*' });

    gis(query, async (error, results) => {
      if (error) {
        sock.sendMessage(m.from, { text: "Oops! An error occurred." });
        return;
      }

      const numberOfImages = 5;
      const imagesToSend = results.slice(0, numberOfImages);

      for (let i = 0; i < imagesToSend.length; i++) {
        await sleep(500);
        sock.sendMessage(m.from, { image: { url: imagesToSend[i].url } }, { quoted: m });
      }
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    sock.sendMessage(m.from, { text: '*Oops! Something went wrong while generating images. Please try again later.*' });
  }
};

module.exports = imageCommand;
