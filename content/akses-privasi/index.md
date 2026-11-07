---
title: "Akses & Privasi"
description: "Bypass penyaringan, DNS adblock, browser anti-tracking, VPN, password manager, email alias, sampai cek kebocoran data. Alat untuk menjaga akses dan jejak digital."
category: "akses-privasi"
domain: utilitas
icon: "shield"
tags: ["privasi", "vpn", "keamanan"]
updated: "2026-11-07"
created: "2026-11-07"
draft: false
featured: true
order: 12
---

# Akses & Privasi

> Untuk membuka situs yang tersaring dan merapikan jejak digital. Sebagian besar
> alat di sini gratis dan open source, jadi bisa dipasang tanpa langganan. Yang
> berbayar biasanya cuma menambah server atau kuota.

## Bypass & Akses

Pasang satu saja lebih dulu. Menumpuk beberapa alat sekaligus justru membuat koneksi sulit dilacak saat bermasalah.

- [BebasID](https://github.com/bebasid/bebasid) — proyek hosts file untuk membuka situs yang diblokir ISP; sumbernya terbuka di GitHub. `hosts` ⭐
- [BebasDNS](https://github.com/bebasid/bebasdns) — DNS publik dari proyek BebasID, tanpa perlu mengubah hosts. `dns`
- [Psiphon](https://psiphon.ca/) — proxy dan VPN gratis dengan mode yang tetap jalan di jaringan ketat. `proxy`
- [dnstt](https://www.bamsoftware.com/software/dnstt/) — terowongan DNS untuk jaringan yang hanya meloloskan lalu lintas DNS. `dns`
- [Cloudflare WARP](https://1.1.1.1/) — klien 1.1.1.1 dengan WARP; sering dipakai saat koneksi biasa tersendat. `vpn`

## Adblock & DNS

- [uBlock Origin](https://ublockorigin.com/) — pemblokir iklan dan pelacak untuk Firefox dan Chromium; ringan dan tanpa daftar putih berbayar. `ekstensi` ⭐
- [AdGuard Home](https://adguard.com/en/adguard-home/overview.html) — DNS sinkhole self-host dengan dasbor dan filter per perangkat. `selfhost`
- [NextDNS](https://nextdns.io/) — DNS terkelola berbasis cloud, profil terpisah tiap perangkat, kuota gratis 300 ribu query per bulan. `dns` ⭐
- [Pi-hole](https://pi-hole.net/) — DNS sinkhole klasik untuk jaringan rumah; butuh perangkat yang menyala terus. `selfhost`

## Browser & Anti-Tracking

- [Mullvad Browser](https://mullvad.net/en/browser) — browser berbasis Tor Browser tanpa jaringan Tor, dirancang menyamakan fingerprint antar pengguna. `browser` ⭐
- [arkenfox user.js](https://github.com/arkenfox/user.js) — setelan Firefox yang diperketat, cocok kalau mau merakit sendiri. `firefox`
- [PrivacyRedirect](https://github.com/SimonBrazell/privacy-redirect) — ekstensi yang mengalihkan tautan YouTube, Twitter, dan Reddit ke frontend alternatif. `ekstensi`
- [Privacy Guides](https://www.privacyguides.org/) — rujukan independen untuk memilih alat privasi; pembaruannya rutin. `referensi` ⭐

## VPN

- [Proton VPN](https://protonvpn.com/) — tier gratis tanpa batas data, jumlah server terbatas; berbasis di Swiss. `vpn` ⭐
- [Windscribe](https://windscribe.com/) — gratis 10 GB per bulan setelah verifikasi email, dengan banyak lokasi. `vpn`
- [Mullvad](https://mullvad.net/) — bayar tanpa akun, cukup nomor acak; audit rutin dan klien open source. `vpn`
- [Techlore VPN Chart](https://techlore.tech/vpn) — tabel perbandingan VPN berdasarkan kebijakan privasi dan hasil audit. `referensi`

## Password & 2FA

- [Bitwarden](https://bitwarden.com/) — password manager open source, sinkron gratis di semua perangkat. `password` ⭐
- [KeePassXC](https://keepassxc.org/) — penyimpanan lokal berbasis file, tanpa server; cocok kalau mau kendali penuh. `password`
- [Ente Auth](https://ente.io/auth/) — aplikasi 2FA open source dengan sinkronisasi terenkripsi dan cadangan. `2fa` ⭐
- [Aegis](https://getaegis.app/) — aplikasi 2FA Android, ekspor dan impor mudah, tanpa iklan. `2fa`
- [2FA Directory](https://2fa.directory/) — daftar situs yang mendukung autentikasi dua faktor beserta metodenya. `referensi`

## Email & Alias

- [Proton Mail](https://proton.me/mail) — email terenkripsi dengan tier gratis 1 GB; pendaftaran tanpa nomor telepon. `email` ⭐
- [Tuta](https://tuta.com/) — email terenkripsi, gratis 1 GB, klien tersedia lintas platform. `email`
- [addy.io](https://addy.io/) — alias email open source; balasan diteruskan tanpa membuka alamat asli. `alias`
- [SimpleLogin](https://simplelogin.io/) — alias email dari Proton, terhubung ke password manager. `alias`

## Enkripsi & Sandbox

- [Cryptomator](https://cryptomator.org/) — enkripsi folder sebelum diunggah ke cloud, transparan di file manager. `enkripsi` ⭐
- [VeraCrypt](https://www.veracrypt.fr/) — volume terenkripsi dengan hidden volume; standar lama yang masih dipakai. `enkripsi`
- [Sandboxie-Plus](https://sandboxie-plus.com/) — menjalankan aplikasi di sandbox agar perubahan tidak menyentuh sistem. `sandbox`

## Cek Kebocoran

- [Have I Been Pwned](https://haveibeenpwned.com/) — cek email dan nomor telepon di basis data kebocoran; tersedia notifikasi lewat email. `keamanan` ⭐
