# Web-based system for property rentals

Diplomski rad – full-stack aplikacija za izdavanje i rezervaciju nekretnina (konceptualno slično Airbnb).  
Aplikacija omogućava pregled, rezervacije i upravljanje nekretninama sa različitim tipovima (rezidencijalni i poslovni).

---

## 🛠️ Tehnologije

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- Redis (BullMQ queue za background jobove)
- JWT autentikacija
- ImageKit API (upload i optimizacija slika)
- Google Places API (adrese i lokacije)

**Frontend**
- React + Vite
- React Query
- Axios
- React Router
- MUI (custom theme + responsive UI)

---

## 📂 Struktura projekta

- server --> backend (Express, MongoDB, Redis, API rute...)
- frontend --> frontend (React + Vite + MUI + Redux + React Query...)

---

## ✨ Funkcionalnosti

- ✅ Registracija i login korisnika (JWT)
- ✅ Pregled detalja nekretnine (Estate details)
- ✅ Rezervacije (kratkoročne i dugoročne)
- ✅ Upload i prikaz slika (ImageKit)
- ✅ Validacija dostupnosti (kroz kalendar i zauzete datume)
- ✅ Google Places API integracija za adrese
- ✅ Redis Cloud + BullMQ za background jobove

**Planirano / u toku**
- 🔄 Upravljanje nekretninama od strane domacina
- 🔄 Upravljanje korisničkim profilima
- 🔄 Wishlist (dodavanje i uklanjanje nekretnina)
- 🔄 Recenzije i ocjene
- 🔄 Chat sistem
- 🔄 Docker (mongo, redis, server i frontend u docker-compose)

---

## 🚀 Pokretanje projekta

### 1. Kloniranje repozitorija
```bash
git clone <repo-url>
cd <repo-name>
```

### 2. Pokretanje backenda
```bash
cd server
npm install
npm run dev
```

### 3. Pokretanje frontenda
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment variables

U repozitoriju se nalazi `.env.example` fajl. Potrebno je napraviti `.env` i popuniti vrijednostima.

**Primjer (`server/.env.example`):**
```env
MONGO_URI=mongodb+srv://...
REDIS_URL=...
JWT_SECRET=...
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
GOOGLE_PLACES_API_KEY=...
```

> ℹ️ API ključevi nisu dio repozitorija iz sigurnosnih razloga.

---

## 📌Status projekta
Projekat je još u fazi izrade...
