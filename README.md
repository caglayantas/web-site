# Perla Marine — Website

Kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve
tekneye özel bakım-onarım hizmetleri sunan Perla Marine'in kurumsal web sitesi.

## Teknoloji

- **Frontend:** React + Vite, statik olarak Vercel'de barındırılıyor
- **Veri / Auth / Storage:** Supabase (Postgres + Auth + Storage)
- **E-posta bildirimleri:** Supabase Edge Function + Resend

## Geliştirme

```bash
pnpm install
pnpm dev      # yerel geliştirme sunucusu
pnpm build    # üretim derlemesi (dist/public)
pnpm check    # TypeScript tip kontrolü
```

## Yönetim paneli

`/yonetim` altında Projeler, Teknik Bilgiler ve SSS içerikleri Supabase Auth ile
korunan bir panelden yönetilir.
