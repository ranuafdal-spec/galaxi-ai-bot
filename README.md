# 🤖 GALAXI AI Bot

Bot Discord untuk generate dan edit gambar menggunakan AI (Pollinations.ai).

## Fitur

| Command | Deskripsi |
|---------|-----------|
| `!img <prompt>` | Generate gambar dari teks |
| `!edit <prompt>` | Edit gambar yang di-reply dengan prompt |
| `!help` | Tampilkan semua command |
| `!ping` | Cek apakah bot aktif |

## Setup Lokal

1. **Clone repo ini**
   ```bash
   git clone https://github.com/username/galaxi-ai-bot.git
   cd galaxi-ai-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Buat file `.env`** (salin dari `.env.example`)
   ```bash
   cp .env.example .env
   ```
   Lalu isi dengan token dan ID yang sebenarnya.

4. **Jalankan bot**
   ```bash
   npm start
   ```

## Deploy ke Railway

1. Push repo ini ke GitHub
2. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Pilih repo ini
4. Buka tab **Variables** dan tambahkan:
   - `TOKEN_DISCORD` — token bot Discord kamu
   - `PREFIX` — prefix command (contoh: `!`)
   - `ALLOWED_CHANNEL_ID` — ID channel yang diizinkan
   - `ALLOWED_ROLE_ID` — ID role yang diizinkan
5. Railway akan otomatis deploy. Bot akan online!

## Environment Variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `TOKEN_DISCORD` | ✅ | Token bot dari Discord Developer Portal |
| `PREFIX` | ❌ | Prefix command, default `!` |
| `ALLOWED_CHANNEL_ID` | ❌ | ID channel khusus bot |
| `ALLOWED_ROLE_ID` | ❌ | ID role yang boleh pakai bot |

## Cara Dapat Token Discord

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Pilih aplikasi bot kamu → **Bot** → **Reset Token**
3. Salin token dan masukkan ke Railway Variable

> ⚠️ **PENTING:** Jangan pernah share atau commit file `.env` ke GitHub!
