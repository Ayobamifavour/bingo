/* Football Bingo data. Load after data.js, before script.js */

const WC_TECH = [
  ["World Cup winner", "part of a squad that won the tournament"],
  ["Golden Boot / Ball / Glove", "the tournament's top scorer, best player and best goalkeeper awards"],
  ["Regions", "based on the senior national team the player represented"],
  ["Clubs", "only players who made the first team count. Being in the academy doesn't qualify"],
  ["Nationality", "based on the senior team(s) they represented. If uncapped, it follows their declared allegiance, or if none, their birthplace"]
];

const FB = (() => {
  const flag = f => `<img src="https://flagcdn.com/w80/${f}.png" alt="">`;
  const shirt = (a, b) => `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 6 4 15l6 15 8-3v31h28V27l8 3 6-15L42 6c-2 4-6 6-10 6s-8-2-10-6z" fill="${a}" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M4 15 22 6l-4 21-8 3zM60 15 42 6l4 21 8 3z" fill="${b}" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg>`;

  // code: [name, shirt colour, sleeve colour, league]
  const CL = {
    RM: ["Real Madrid", "#ffffff", "#6d5acd", "ESP"], FCB: ["Barcelona", "#a50044", "#004d98", "ESP"], ATM: ["Atlético", "#cb3524", "#ffffff", "ESP"], SEV: ["Sevilla", "#ffffff", "#d71920", "ESP"],
    JUV: ["Juventus", "#ffffff", "#111111", "ITA"], ACM: ["AC Milan", "#e10f1a", "#111111", "ITA"], INT: ["Inter", "#0068a8", "#111111", "ITA"], NAP: ["Napoli", "#12a0d7", "#ffffff", "ITA"], ROM: ["Roma", "#8e1f2f", "#f0bc42", "ITA"], LAZ: ["Lazio", "#87d8f7", "#ffffff", "ITA"],
    MUN: ["Man United", "#da291c", "#ffffff", "ENG"], CHE: ["Chelsea", "#034694", "#ffffff", "ENG"], ARS: ["Arsenal", "#ef0107", "#ffffff", "ENG"], LIV: ["Liverpool", "#c8102e", "#ffffff", "ENG"],
    MCI: ["Man City", "#6cabdd", "#ffffff", "ENG"], TOT: ["Tottenham", "#ffffff", "#132257", "ENG"], EVE: ["Everton", "#003399", "#ffffff", "ENG"], LEI: ["Leicester", "#0053a0", "#ffffff", "ENG"], AVL: ["Aston Villa", "#670e36", "#95bfe5", "ENG"],
    BAY: ["Bayern", "#dc052d", "#ffffff", "GER"], BVB: ["Dortmund", "#fde100", "#111111", "GER"], HSV: ["Hamburg", "#ffffff", "#0a5ca8", "GER"], WER: ["Werder", "#1d9053", "#ffffff", "GER"],
    PSG: ["PSG", "#004170", "#da291c", "FRA"], MON: ["Monaco", "#e1001a", "#ffffff", "FRA"], OM: ["Marseille", "#ffffff", "#2faee0", "FRA"], LIL: ["Lille", "#d2122e", "#ffffff", "FRA"],
    AJX: ["Ajax", "#ffffff", "#d2122e", "NED"], BEN: ["Benfica", "#e30613", "#ffffff", "POR"], GAL: ["Galatasaray", "#f9a01b", "#a90432", "TUR"], FEN: ["Fenerbahçe", "#ffed00", "#00205b", "TUR"]
  };
  const CLUB_TILES = ["RM", "FCB", "ATM", "JUV", "ACM", "INT", "NAP", "MUN", "CHE", "ARS", "LIV", "MCI", "TOT", "BAY", "BVB", "PSG", "MON", "AJX"];
  const BIG5 = ["ENG", "ESP", "ITA", "GER", "FRA"];
  const s = k => shirt(CL[k][1], CL[k][2]);

  const ABBR = {
    ar: "ARG", br: "BRA", fr: "FRA", de: "GER", it: "ITA", es: "ESP", "gb-eng": "ENG", pt: "POR", nl: "NLD", be: "BEL", hr: "CRO",
    uy: "URU", co: "COL", ma: "MAR", sn: "SEN", gh: "GHA", ng: "NGA", eg: "EGY", ci: "CIV", cm: "CMR", dk: "DEN", se: "SWE",
    no: "NOR", cz: "CZE", dz: "ALG", tr: "TUR", us: "USA", pl: "POL", kr: "KOR"
  };
  const REG = {
    africa: ["Africa", ["eg", "ng", "sn", "ci"], ["ma", "dz", "tn", "eg", "sn", "gh", "ng", "ci", "cm"]],
    northafrica: ["North Africa", ["ma", "dz", "tn", "eg"], ["ma", "dz", "tn", "eg"]],
    southamerica: ["South America", ["ar", "br", "uy", "co"], ["ar", "br", "uy", "co", "cl", "pe", "ec"]],
    nordic: ["Nordic", ["se", "dk", "no", "is"], ["se", "dk", "no", "is"]],
    balkans: ["Balkans", ["hr", "rs", "ba", "me"], ["hr", "rs", "ba", "me", "si", "mk", "bg"]]
  };
  const HON = {
    W: ["World Cup winner", "🏆"], D: ["Ballon d'Or winner", "🥇"], U: ["Champions League winner", "🏅"], E: ["Euro winner", "⭐"],
    C: ["Copa América winner", "🌟"], A: ["AFCON winner", "🦁"], T: ["Treble winner", "3️⃣"],
    P: ["EPL Golden Boot", "👟"], S: ["Serie A Golden Boot", "👟"], G: ["UCL Golden Boot", "👟"]
  };
  const LG = { ENG: ["English League", "gb-eng"], ESP: ["Spanish League", "es"], ITA: ["Italian League", "it"], GER: ["German League", "de"], FRA: ["French League", "fr"], TUR: ["Turkish League", "tr"] };
  const MG = { Anc: "Ancelotti", Mou: "Mourinho", Gua: "Guardiola", VG: "Van Gaal", Wen: "Wenger", Fer: "Ferguson" };

  // Name|nation|clubs|honours|managers
  const ROWS = `
Lionel Messi|ar|FCB PSG|WDUTCG|Gua
Cristiano Ronaldo|pt|MUN RM JUV|DUEPSG|Fer Anc Mou
Zlatan Ibrahimović|se|AJX JUV INT FCB ACM PSG MUN|S|Mou Anc Gua
Thierry Henry|fr|MON JUV ARS FCB|WEUPT|Wen Gua
Kylian Mbappé|fr|MON PSG RM|W|Anc
Zinedine Zidane|fr|JUV RM|WEUD|Anc
Ronaldinho|br|PSG FCB ACM|WUD|Anc
Neymar|br|FCB PSG|UTG|
Ronaldo Nazário|br|FCB INT RM ACM|WDC|Anc
Kaká|br|ACM RM|WDU|Anc Mou
Thiago Silva|br|ACM PSG CHE|U|Anc
Dani Alves|br|FCB JUV PSG|CUT|Gua
Andrea Pirlo|it|ACM JUV INT|WU|Anc
Gianluigi Buffon|it|JUV PSG|W|
Fabio Cannavaro|it|NAP INT JUV RM|WD|
Roberto Baggio|it|JUV ACM INT|D|
Leonardo Bonucci|it|JUV INT ACM|E|
Gianluigi Donnarumma|it|ACM PSG MCI|EU|
Andrés Iniesta|es|FCB|WEUT|Gua VG
Xavi|es|FCB|WEUT|Gua VG
Gerard Piqué|es|MUN FCB|WEUT|Fer Gua
Sergio Ramos|es|RM PSG SEV|WEU|Mou Anc
Iker Casillas|es|RM|WEU|Mou Anc
David Villa|es|FCB ATM|WEU|Gua
Cesc Fàbregas|es|ARS FCB CHE MON|WE|Wen Gua Mou
Fernando Torres|es|ATM LIV CHE ACM|WEU|
Harry Kane|gb-eng|TOT BAY|P|Mou
Wayne Rooney|gb-eng|MUN EVE|U|Fer VG Mou
David Beckham|gb-eng|MUN RM PSG ACM|UT|Fer
Gary Lineker|gb-eng|EVE TOT FCB||
Frank Lampard|gb-eng|CHE MCI|U|Anc Mou
Jude Bellingham|gb-eng|BVB RM|U|Anc
Didier Drogba|ci|OM CHE GAL|UP|Mou Anc
Yaya Touré|ci|FCB MCI|AUT|Gua
Samuel Eto'o|cm|FCB INT CHE|AUT|Gua Mou
Mohamed Salah|eg|CHE ROM LIV|UP|Mou
Sadio Mané|sn|LIV BAY|UAP|
Riyad Mahrez|dz|LEI MCI|AUT|Gua
Achraf Hakimi|ma|RM INT PSG BVB|U|
Michael Essien|gh|CHE RM ACM|U|Mou Anc
Nwankwo Kanu|ng|AJX INT ARS|U|VG Wen
Jay-Jay Okocha|ng|FEN PSG||
Kevin De Bruyne|be|CHE MCI|UT|Mou Gua
Eden Hazard|be|LIL CHE RM||Mou Anc
Thibaut Courtois|be|CHE ATM RM|U|Mou Anc
Romelu Lukaku|be|EVE CHE MUN INT NAP ROM||Mou
Luka Modrić|hr|TOT RM|UD|Anc
Ivan Rakitić|hr|SEV FCB|UT|
Mario Mandžukić|hr|BAY ATM JUV ACM|UT|Gua
Davor Šuker|hr|RM ARS||
Luis Suárez|uy|AJX LIV FCB ATM|PUTC|
Edinson Cavani|uy|NAP PSG MUN|CS|Anc
Diego Forlán|uy|MUN ATM INT||Fer
Robert Lewandowski|pl|BVB BAY FCB|UTG|Gua Anc
Miroslav Klose|de|LAZ BAY|W|VG
Thomas Müller|de|BAY|WUT|Gua VG Anc
Manuel Neuer|de|BAY|WUT|Gua Anc
Toni Kroos|de|BAY RM|WUT|Gua Anc
Bastian Schweinsteiger|de|BAY MUN|WUT|Gua VG Mou
Mesut Özil|de|WER RM ARS|W|Wen Mou Anc
Franck Ribéry|fr|OM BAY|UT|VG Gua Anc
Patrick Vieira|fr|ACM JUV INT ARS MCI|WE|Wen
Karim Benzema|fr|RM|DUG|Mou Anc
Antoine Griezmann|fr|ATM FCB|W|
Raphaël Varane|fr|RM MUN|WU|Mou Anc
Paul Pogba|fr|JUV MUN|W|Fer VG Mou
N'Golo Kanté|fr|LEI CHE|WU|
Gabriel Batistuta|ar|INT ROM|CS|
Diego Maradona|ar|FCB NAP|WS|
Ángel Di María|ar|RM PSG JUV MUN BEN|WUC|Mou Anc VG
Carlos Tevez|ar|MUN MCI JUV|U|Fer
Emiliano Martínez|ar|ARS AVL|WC|Wen
Robin van Persie|nl|ARS MUN|P|Wen Fer VG
Wesley Sneijder|nl|AJX RM INT GAL|UT|Mou
Marco van Basten|nl|AJX ACM|DUES|
Ruud Gullit|nl|ACM CHE|DEU|
Edwin van der Sar|nl|AJX JUV MUN|U|VG Fer
Clarence Seedorf|nl|AJX RM INT ACM|U|VG Anc
Patrick Kluivert|nl|AJX ACM FCB|U|VG
Dennis Bergkamp|nl|AJX INT ARS||VG Wen
Peter Schmeichel|dk|MUN MCI|EUT|Fer
Christian Eriksen|dk|AJX TOT INT MUN||Mou
Erling Haaland|no|BVB MCI|UPTG|Gua
Henrik Larsson|se|FCB MUN|U|Fer
Christian Pulisic|us|BVB CHE ACM|U|
Son Heung-min|kr|HSV TOT|P|Mou
Hakan Şükür|tr|GAL INT||
Arda Turan|tr|GAL ATM FCB||`;

  const WITH = {
    Zlatan: "Lionel Messi|Ronaldinho|Andrea Pirlo|Gianluigi Buffon|Samuel Eto'o|Thierry Henry|Xavi|Andrés Iniesta|Wesley Sneijder|Edinson Cavani|Ángel Di María|Thiago Silva|Dani Alves|Romelu Lukaku|Paul Pogba|Wayne Rooney|David Beckham|Clarence Seedorf",
    Messi: "Zlatan Ibrahimović|Ronaldinho|Neymar|Luis Suárez|Thierry Henry|Samuel Eto'o|Xavi|Andrés Iniesta|Gerard Piqué|David Villa|Dani Alves|Ivan Rakitić|Ángel Di María|Kylian Mbappé|Sergio Ramos|Cesc Fàbregas|Yaya Touré|Carlos Tevez|Emiliano Martínez",
    Ronaldo: "Wayne Rooney|Edwin van der Sar|Carlos Tevez|Gerard Piqué|Karim Benzema|Sergio Ramos|Iker Casillas|Kaká|Luka Modrić|Raphaël Varane|Gianluigi Buffon|Leonardo Bonucci|Mario Mandžukić|Paul Pogba|Edinson Cavani|Mesut Özil|Toni Kroos|Ángel Di María|Diego Forlán"
  };

  const players = ROWS.trim().split("\n").map(line => {
    const [name, nat, clubs, h = "", m = ""] = line.split("|");
    const c = clubs.split(" ").filter(Boolean);
    return {
      name, nat, c, h,
      m: m.split(" ").filter(Boolean).map(k => MG[k]),
      w: [],
      lg: [...new Set(c.map(k => CL[k][3]))]
    };
  });
  players.forEach(p => Object.entries(WITH).forEach(([k, names]) => { if (names.split("|").includes(p.name)) p.w.push(k); }));

  const cats = {};
  const add = (id, label, g, test, extra) => cats[id] = { label, g, test, ...extra };

  CLUB_TILES.forEach(k => add(k, CL[k][0], "club", p => p.c.includes(k), { html: s(k) }));
  Object.entries(ABBR).forEach(([k, a]) => add(k, a, "country", p => p.nat === k, { flag: k }));
  Object.entries(HON).forEach(([k, [n, e]]) => add("h_" + k, n, "honor", p => p.h.includes(k), { emoji: e }));
  Object.entries(REG).forEach(([k, [n, cluster, list]]) => add("r_" + k, n, "misc", p => list.includes(p.nat), { cluster }));
  Object.entries(LG).forEach(([k, [n, f]]) => add("lg_" + k, n, "misc", p => p.lg.includes(k), { flag: f }));
  Object.values(MG).forEach(n => add("m_" + n, "Managed by " + n, "misc", p => p.m.includes(n), { emoji: "🧑‍💼" }));
  ["Zlatan", "Messi", "Ronaldo"].forEach(n => add("w_" + n, "Played with " + n, "misc", p => p.w.includes(n), { emoji: "🤝" }));
  add("big5", "Played in 3+ Big 5 lges", "misc", p => p.lg.filter(l => BIG5.includes(l)).length >= 3, { emoji: "🌍" });
  add("x_acm_che", "AC Milan + Chelsea", "misc", p => p.c.includes("ACM") && p.c.includes("CHE"), { html: s("ACM") + s("CHE") });
  add("x_mun_rm", "Man United + Real Madrid", "misc", p => p.c.includes("MUN") && p.c.includes("RM"), { html: s("MUN") + s("RM") });
  add("x_juv_int", "Juventus + Inter", "misc", p => p.c.includes("JUV") && p.c.includes("INT"), { html: s("JUV") + s("INT") });
  add("x_che_rm", "Chelsea + Real Madrid", "misc", p => p.c.includes("CHE") && p.c.includes("RM"), { html: s("CHE") + s("RM") });
  add("x_br_rm", "BRA + Real Madrid", "misc", p => p.nat === "br" && p.c.includes("RM"), { html: flag("br") + s("RM") });
  add("x_ar_fcb", "ARG + Barcelona", "misc", p => p.nat === "ar" && p.c.includes("FCB"), { html: flag("ar") + s("FCB") });

  const tech = [
    ["Serie A Golden Boot", "data is available from 1954/55 onwards"],
    ["EPL Golden Boot", "covers the Premier League era, from 1992/93 onwards"],
    ["UCL Golden Boot", "covers the Champions League and European Cup"],
    ["Copa América", "data is available from 1960 onwards"],
    ["Treble Winner", "won the domestic league, the main national cup and the Champions League in the same season (1992 onwards). League cups don't count."],
    ["English League", "had a spell at a club in England. The same applies to the other league tiles"],
    ["Africa", "players from countries in the Confederation of African Football, which includes Egypt, Nigeria, Senegal and others, not just based on geographic location"],
    ["Played in 3+ Big 5 lges", "played in at least three of England, Spain, Italy, Germany and France"],
    ["Played with / Managed by", "shared a first-team squad with, or played under, that person at a club"],
    ["Teams", "only players who made the first team count. Being in the academy doesn't qualify"],
    ["Nationality", "based on the senior team(s) they represented. If uncapped, it follows their declared allegiance, or if none, their birthplace"]
  ];

  return { players, cats, tech };
})();