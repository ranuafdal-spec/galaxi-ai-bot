require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType
} = require("discord.js");

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = process.env.PREFIX || "!";

// =========================================
// KONFIGURASI CHANNEL & ROLE
// =========================================

const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID || "1505027483244826645";
const ALLOWED_ROLE_ID = process.env.ALLOWED_ROLE_ID || "1503997352782856222";

client.once("ready", () => {
  console.log(`✅ Bot online sebagai ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: "GALAXI AI IMAGE",
        type: ActivityType.Watching
      }
    ],
    status: "online"
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // =========================================
  // VALIDASI CHANNEL KHUSUS
  // =========================================

  if (message.channel.id !== ALLOWED_CHANNEL_ID) return;

  // =========================================
  // VALIDASI ROLE KHUSUS
  // =========================================

  if (!message.member.roles.cache.has(ALLOWED_ROLE_ID)) {
    return message.reply(
      "❌ Kamu tidak memiliki role untuk menggunakan GALAXI AI."
    );
  }

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // =========================================
  // !PING
  // =========================================

  if (command === "ping") {
    return message.reply("🏓 Pong!");
  }

  // =========================================
  // !HELP
  // =========================================

  if (command === "help") {
    const embed = new EmbedBuilder()
      .setTitle("🤖 GALAXI AI COMMANDS")
      .setDescription(
        `🖼 \`!edit <prompt>\` — Edit gambar dengan AI\n` +
        `🎨 \`!img <prompt>\` — Generate gambar dari teks\n` +
        `🔍 \`!vision\` — Analisis gambar (soon)\n` +
        `✨ \`!hd\` — Generate gambar HD (soon)\n` +
        `🧹 \`!removebg\` — Hapus background (soon)\n` +
        `🏓 \`!ping\` — Cek bot aktif`
      )
      .setColor("Blue")
      .setFooter({ text: "Powered by GALAXI AI" })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  // =========================================
  // !IMG
  // =========================================

  if (command === "img") {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("❌ Masukkan prompt gambar. Contoh: `!img pemandangan pantai sunset`");
    }

    const loading = await message.reply(
      "🧠 GALAXI AI sedang membuat gambar..."
    );

    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const embed = new EmbedBuilder()
        .setTitle("🎨 GALAXI AI IMAGE")
        .setDescription(`**Prompt:** ${prompt}`)
        .setImage(imageUrl)
        .setColor("Purple")
        .setFooter({ text: `Requested by ${message.author.username} • Powered by GALAXI AI` })
        .setTimestamp();

      await loading.edit({
        content: "✅ Gambar berhasil dibuat!",
        embeds: [embed]
      });
    } catch (err) {
      console.error(err);
      await loading.edit("❌ Gagal membuat gambar. Coba lagi nanti.");
    }
  }

  // =========================================
  // !EDIT
  // =========================================

  if (command === "edit") {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply(
        "❌ Contoh penggunaan: `!edit ubah jadi anime cyberpunk`\nReply ke foto yang ingin diedit."
      );
    }

    let attachment;

    if (message.reference) {
      const referencedMessage = await message.channel.messages.fetch(
        message.reference.messageId
      );
      attachment = referencedMessage.attachments.first();
    }

    if (!attachment) {
      attachment = message.attachments.first();
    }

    if (!attachment) {
      return message.reply(
        "❌ Reply ke foto yang ingin diedit dengan command `!edit <prompt>`"
      );
    }

    const loading = await message.reply(
      "🧠 GALAXI AI sedang mengedit gambar..."
    );

    const filePath = path.join(__dirname, `temp_${Date.now()}.png`);

    try {
      const response = await axios({
        url: attachment.url,
        method: "GET",
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, response.data);

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt + " ultra detailed realistic edited image"
      )}`;

      const embed = new EmbedBuilder()
        .setTitle("✨ GALAXI AI IMAGE EDIT")
        .setDescription(`**Prompt:** ${prompt}`)
        .setImage(imageUrl)
        .setColor("Aqua")
        .setFooter({ text: `Requested by ${message.author.username} • Powered by GALAXI AI` })
        .setTimestamp();

      await loading.edit({
        content: "✅ Hasil edit berhasil dibuat!",
        embeds: [embed]
      });
    } catch (err) {
      console.error(err);
      await loading.edit("❌ Gagal mengedit gambar. Coba lagi nanti.");
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
});

client.login(process.env.TOKEN_DISCORD);
