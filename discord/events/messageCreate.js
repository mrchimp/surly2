import { Events, MessageFlags } from "discord.js";

import surly from "../../instance.js";

export default {
  name: Events.MessageCreate,
  async execute(interaction) {
    if (interaction.author.username === "surly") {
      return;
    }

    if (interaction.author.bot) {
      return;
    }

    const response = surly.talk(interaction.content, {
      username: interaction.author.globalName,
      isDm: "FALSE",
    });

    if (response) {
      interaction.client.channels.cache
        .get(interaction.channelId)
        .send(response);
    }
  },
};
