const NAMES = {
  ar: "Argentina", br: "Brazil", fr: "France", de: "Germany", it: "Italy", es: "Spain",
  "gb-eng": "England", pt: "Portugal", nl: "Netherlands", be: "Belgium", hr: "Croatia",
  uy: "Uruguay", co: "Colombia", ma: "Morocco", sn: "Senegal", gh: "Ghana", ng: "Nigeria",
  eg: "Egypt", ci: "Ivory Coast", cm: "Cameroon", dk: "Denmark", se: "Sweden", no: "Norway",
  cz: "Czechia", bg: "Bulgaria", rs: "Serbia", dz: "Algeria", mx: "Mexico", us: "USA"
};

const REGIONS = {
  balkans: ["Balkans", "🏔️", ["hr", "rs", "ba", "me", "si", "mk", "bg"]],
  northafrica: ["North Africa", "🏜️", ["ma", "dz", "tn", "eg"]],
  westafrica: ["West Africa", "🌍", ["sn", "gh", "ng", "ci"]],
  nordic: ["Nordic", "❄️", ["se", "dk", "no", "is"]],
  southamerica: ["South America", "🌎", ["ar", "br", "uy", "co", "cl", "pe", "ec"]],
  concacaf: ["North & Central America", "🗺️", ["mx", "us", "cr", "jm"]]
};

const HONORS = {
  W: ["World Cup winner", "🏆"], B: ["World Cup Golden Boot", "👟"], L: ["World Cup Golden Ball", "⚽"],
  G: ["World Cup Golden Glove", "🧤"], F: ["Scored in a World Cup final", "🎯"], E: ["Euro winner", "⭐"],
  C: ["Copa América winner", "🌟"], A: ["AFCON winner", "🦁"], D: ["Ballon d'Or winner", "🥇"],
  U: ["Champions League winner", "🏅"], H: ["World Cup hat-trick", "🎩"],
  X: ["4+ World Cups", "🔁"], K: ["Goalkeeper", "🥅"], T: ["Treble winner", "3️⃣"]
};

const cats = {};
Object.entries(NAMES).forEach(([c, n]) => cats[c] = { label: n, flag: c, test: p => p.nat === c });
Object.entries(REGIONS).forEach(([k, [n, e, list]]) => cats[k] = { label: n, cluster: list.slice(0, 4), test: p => list.includes(p.nat) });
const CLUBS = {
  RM: ["Real Madrid", "#ffffff", "#1b1b3a"], FCB: ["Barcelona", "#a50044", "#edbb00"], JUV: ["Juventus", "#111111", "#ffffff"],
  ACM: ["AC Milan", "#e10f1a", "#111111"], INT: ["Inter", "#0068a8", "#111111"], MUN: ["Man United", "#da291c", "#ffe500"],
  CHE: ["Chelsea", "#034694", "#ffffff"], ARS: ["Arsenal", "#ef0107", "#ffffff"], LIV: ["Liverpool", "#c8102e", "#ffffff"],
  MCI: ["Man City", "#6cabdd", "#1c2c5b"], BAY: ["Bayern", "#dc052d", "#ffffff"], PSG: ["PSG", "#004170", "#ffffff"],
  AJX: ["Ajax", "#d2122e", "#ffffff"], ATM: ["Atlético", "#cb3524", "#ffffff"], NAP: ["Napoli", "#12a0d7", "#ffffff"]
};
Object.entries(CLUBS).forEach(([k, [n, bg, fg]]) => cats[k] = { label: n, badge: [k, bg, fg], test: p => p.c.includes(k) });
Object.entries(HONORS).forEach(([k, [n, e]]) => cats[k] = { label: n, emoji: e, test: p => p.h.includes(k) });

const P = (name, nat, h = "") => ({ name, nat, h });
const players = [
  P("Lionel Messi", "ar", "WLCDUF"), P("Diego Maradona", "ar", "WL"), P("Mario Kempes", "ar", "WBLF"),
  P("Ángel Di María", "ar", "WCUF"), P("Emiliano Martínez", "ar", "WGC"), P("Gabriel Batistuta", "ar", "C"),
  P("Pelé", "br", "WLF"), P("Ronaldo Nazário", "br", "WBLCDF"), P("Ronaldinho", "br", "WCDU"),
  P("Kaká", "br", "WDU"), P("Romário", "br", "WLC"), P("Neymar", "br", "U"),
  P("Kylian Mbappé", "fr", "WBF"), P("Zinedine Zidane", "fr", "WELDUF"), P("Michel Platini", "fr", "ED"),
  P("Just Fontaine", "fr", "B"), P("Karim Benzema", "fr", "DU"), P("Antoine Griezmann", "fr", "W"),
  P("Raphaël Varane", "fr", "WU"), P("N'Golo Kanté", "fr", "WU"), P("Lilian Thuram", "fr", "WE"),
  P("Thierry Henry", "fr", "WEU"),
  P("Miroslav Klose", "de", "WB"), P("Thomas Müller", "de", "WBU"), P("Gerd Müller", "de", "WBEFU"),
  P("Manuel Neuer", "de", "WGU"), P("Oliver Kahn", "de", "GLU"), P("Lothar Matthäus", "de", "WD"),
  P("Franz Beckenbauer", "de", "WEDU"), P("Mario Götze", "de", "WF"),
  P("Gianluigi Buffon", "it", "WG"), P("Fabio Cannavaro", "it", "WD"), P("Andrea Pirlo", "it", "WU"),
  P("Roberto Baggio", "it", "D"), P("Paolo Rossi", "it", "WBLDF"), P("Salvatore Schillaci", "it", "BL"),
  P("Gianluigi Donnarumma", "it", "E"),
  P("Andrés Iniesta", "es", "WEUF"), P("Xavi", "es", "WEU"), P("Sergio Ramos", "es", "WEU"),
  P("Iker Casillas", "es", "WEGU"), P("David Villa", "es", "WEU"),
  P("Harry Kane", "gb-eng", "B"), P("Geoff Hurst", "gb-eng", "WF"), P("Bobby Moore", "gb-eng", "W"),
  P("Gary Lineker", "gb-eng", "B"),
  P("Cristiano Ronaldo", "pt", "EDU"), P("Eusébio", "pt", "BDU"), P("Luís Figo", "pt", "DU"),
  P("Johan Cruyff", "nl", "DU"), P("Marco van Basten", "nl", "EDU"), P("Ruud Gullit", "nl", "EDU"),
  P("Wesley Sneijder", "nl", "U"),
  P("Kevin De Bruyne", "be", "U"), P("Thibaut Courtois", "be", "GU"), P("Eden Hazard", "be"),
  P("Luka Modrić", "hr", "LDU"), P("Davor Šuker", "hr", "B"), P("Ivan Rakitić", "hr", "U"),
  P("Diego Forlán", "uy", "LC"), P("Luis Suárez", "uy", "CU"),
  P("James Rodríguez", "co", "B"),
  P("Achraf Hakimi", "ma"), P("Sadio Mané", "sn", "AU"), P("Michael Essien", "gh", "U"),
  P("Abedi Pelé", "gh", "U"), P("Asamoah Gyan", "gh"), P("Nwankwo Kanu", "ng", "U"), P("Jay-Jay Okocha", "ng"),
  P("Mohamed Salah", "eg", "U"), P("Didier Drogba", "ci", "U"), P("Yaya Touré", "ci", "AU"),
  P("Samuel Eto'o", "cm", "AU"), P("Roger Milla", "cm"), P("Riyad Mahrez", "dz", "AU"),
  P("Peter Schmeichel", "dk", "EU"), P("Brian Laudrup", "dk", "E"), P("Christian Eriksen", "dk"),
  P("Zlatan Ibrahimović", "se"), P("Henrik Larsson", "se", "U"), P("Erling Haaland", "no", "U"),
  P("Pavel Nedvěd", "cz", "D"), P("Hristo Stoichkov", "bg", "BD"), P("Nemanja Vidić", "rs", "U"),
  P("Dejan Savićević", "me", "U"),
  P("Guillermo Ochoa", "mx"), P("Christian Pulisic", "us"),
  P("Son Heung-min", "kr"), P("Cha Bum-kun", "kr"), P("Hong Myung-bo", "kr"), P("Keisuke Honda", "jp"),
  P("Shinji Kagawa", "jp"), P("Hidetoshi Nakata", "jp"), P("Tim Cahill", "au"), P("Mark Viduka", "au"),
  P("Ali Daei", "ir"), P("Mehdi Taremi", "ir"), P("Sami Al-Jaber", "sa"), P("Saeed Al-Owairan", "sa"),
  P("Hakan Şükür", "tr"), P("Arda Turan", "tr"), P("Andrei Arshavin", "ru"), P("Andriy Yarmolenko", "ua"),
  P("Robbie Keane", "ie"), P("Damien Duff", "ie"), P("Jakub Błaszczykowski", "pl"), P("Granit Xhaka", "ch"),
  P("Zoltán Gera", "hu"), P("Toni Polster", "at")
];

const EXTRA = {
  H: ["Geoff Hurst", "Gabriel Batistuta", "Miroslav Klose", "Thomas Müller", "Kylian Mbappé", "Paolo Rossi", "Harry Kane", "Gary Lineker", "Gerd Müller", "Just Fontaine", "Pelé"],
  X: ["Lionel Messi", "Cristiano Ronaldo", "Lothar Matthäus", "Gianluigi Buffon", "Guillermo Ochoa", "Miroslav Klose", "Luka Modrić", "Manuel Neuer", "Iker Casillas"],
  K: ["Iker Casillas", "Manuel Neuer", "Oliver Kahn", "Gianluigi Buffon", "Thibaut Courtois", "Emiliano Martínez", "Gianluigi Donnarumma", "Peter Schmeichel", "Guillermo Ochoa"],
  T: ["Lionel Messi", "Andrés Iniesta", "Xavi", "Luis Suárez", "Manuel Neuer", "Thomas Müller", "Kevin De Bruyne", "Erling Haaland", "Samuel Eto'o", "Wesley Sneijder", "Yaya Touré"]
};
players.forEach(p => Object.entries(EXTRA).forEach(([k, names]) => { if (names.includes(p.name)) p.h += k; }));

const CLUB_DATA = {
  "Lionel Messi": "FCB PSG", "Diego Maradona": "FCB NAP", "Ángel Di María": "RM PSG JUV MUN", "Emiliano Martínez": "ARS",
  "Gabriel Batistuta": "INT", "Ronaldo Nazário": "FCB INT RM ACM", "Ronaldinho": "PSG FCB ACM", "Kaká": "ACM RM",
  "Romário": "FCB", "Neymar": "FCB PSG", "Kylian Mbappé": "PSG RM", "Zinedine Zidane": "JUV RM", "Michel Platini": "JUV",
  "Karim Benzema": "RM", "Antoine Griezmann": "ATM FCB", "Raphaël Varane": "RM MUN", "N'Golo Kanté": "CHE",
  "Lilian Thuram": "JUV FCB", "Thierry Henry": "ARS FCB JUV", "Miroslav Klose": "BAY", "Thomas Müller": "BAY",
  "Gerd Müller": "BAY", "Manuel Neuer": "BAY", "Oliver Kahn": "BAY", "Lothar Matthäus": "BAY INT", "Franz Beckenbauer": "BAY",
  "Mario Götze": "BAY", "Gianluigi Buffon": "JUV PSG", "Fabio Cannavaro": "JUV RM INT NAP", "Andrea Pirlo": "ACM JUV INT",
  "Roberto Baggio": "JUV ACM INT", "Paolo Rossi": "JUV ACM", "Salvatore Schillaci": "JUV INT", "Gianluigi Donnarumma": "ACM PSG",
  "Andrés Iniesta": "FCB", "Xavi": "FCB", "Sergio Ramos": "RM PSG", "Iker Casillas": "RM", "David Villa": "FCB ATM",
  "Harry Kane": "BAY", "Gary Lineker": "FCB", "Cristiano Ronaldo": "MUN RM JUV", "Luís Figo": "FCB RM INT",
  "Johan Cruyff": "AJX FCB", "Marco van Basten": "AJX ACM", "Ruud Gullit": "ACM CHE", "Wesley Sneijder": "AJX RM INT",
  "Kevin De Bruyne": "CHE MCI", "Thibaut Courtois": "CHE RM ATM", "Eden Hazard": "CHE RM", "Luka Modrić": "RM",
  "Davor Šuker": "RM ARS", "Ivan Rakitić": "FCB", "Diego Forlán": "MUN ATM INT", "Luis Suárez": "LIV FCB AJX ATM",
  "James Rodríguez": "RM BAY", "Achraf Hakimi": "RM INT PSG", "Sadio Mané": "LIV BAY", "Michael Essien": "CHE",
  "Nwankwo Kanu": "AJX INT ARS", "Mohamed Salah": "CHE LIV", "Didier Drogba": "CHE", "Yaya Touré": "FCB MCI",
  "Samuel Eto'o": "FCB INT CHE", "Riyad Mahrez": "MCI", "Peter Schmeichel": "MUN MCI", "Brian Laudrup": "BAY ACM CHE AJX",
  "Christian Eriksen": "AJX INT MUN", "Zlatan Ibrahimović": "AJX JUV INT FCB ACM PSG MUN", "Henrik Larsson": "FCB MUN",
  "Erling Haaland": "MCI", "Pavel Nedvěd": "JUV", "Hristo Stoichkov": "FCB", "Nemanja Vidić": "MUN INT",
  "Dejan Savićević": "ACM", "Christian Pulisic": "CHE ACM", "Keisuke Honda": "ACM", "Shinji Kagawa": "MUN",
  "Ali Daei": "BAY", "Mehdi Taremi": "INT", "Hakan Şükür": "INT", "Arda Turan": "ATM FCB", "Andrei Arshavin": "ARS",
  "Robbie Keane": "INT", "Damien Duff": "CHE", "Granit Xhaka": "ARS"
};
players.forEach(p => p.c = (CLUB_DATA[p.name] || "").split(" ").filter(Boolean));

const has = (p, ...l) => l.every(k => p.h.includes(k));
const SPECIAL = {
  WE: ["WC + Euro", "🏆", p => has(p, "W", "E")],
  WU: ["WC + Champions Lg", "🏅", p => has(p, "W", "U")],
  CW: ["Copa + WC", "🌟", p => has(p, "C", "W")],
  EU: ["Euro + Champions Lg", "⭐", p => has(p, "E", "U")],
  AU: ["AFCON + Champions Lg", "🦁", p => has(p, "A", "U")],
  GB: ["Golden Boot, no WC", "👟", p => has(p, "B") && !has(p, "W")],
  DN: ["Ballon d'Or, no WC", "🥇", p => has(p, "D") && !has(p, "W")]
};
Object.entries(SPECIAL).forEach(([k, [n, e, f]]) => cats[k] = { label: n, emoji: e, test: f });

const cards = [
  ["ar", "fr", "northafrica", "balkans", "RM", "FCB", "JUV", "MUN", "W", "B", "T", "H", "K", "DN", "CW", "F"],
  ["br", "de", "westafrica", "nordic", "BAY", "PSG", "CHE", "ARS", "E", "C", "A", "X", "EU", "GB", "L", "G"],
  ["es", "it", "nl", "gb-eng", "ACM", "INT", "MCI", "LIV", "AJX", "WU", "WE", "AU", "U", "D", "H", "T"],
  ["hr", "uy", "be", "pt", "ng", "southamerica", "ATM", "NAP", "RM", "K", "X", "GB", "DN", "CW", "B", "F"],
  ["concacaf", "balkans", "northafrica", "nordic", "westafrica", "FCB", "BAY", "MUN", "CHE", "JUV", "T", "H", "K", "EU", "AU", "L"],
  ["ar", "br", "fr", "de", "it", "es", "PSG", "MCI", "W", "B", "G", "D", "X", "WE", "WU", "DN"]
];