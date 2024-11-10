export const BLDG_CODES = [
  "ILC",
  "ARND",
  "BART",
  "BOYD",
  "FURC",
  "HILS",
  "MOR1",
  "MOR2",
  "MOR3",
  "MOR4",
  "MOR",
  "SOM",
  "THOM",
  "HAS",
  "AEBC",
  "JAME",
  "BCA",
  "BOWD",
  "BFLD",
  "CHEN",
  "CMPS",
  "CNTE",
  "DB",
  "CROT",
  "DKSN",
  "ECSC",
  "ELAB",
  "ELABII",
  "ELM",
  "EMLY",
  "FAC",
  "FREN",
  "FERN",
  "GDLL",
  "GORD",
  "GORM",
  "GSMN",
  "GUN",
  "HERT",
  "HICK",
  "HOLD",
  "LGRC",
  "LGRT",
  "LIB",
  "LSL",
  "MACH",
  "MARC",
  "MARX",
  "MRST",
  "NAH",
  "SAB",
  "SC",
  "SKIN",
  "STK",
  "TOBN",
  "CHN",
  "MAH",
  "ISB",
  "GOES",
  "FLIN",
] as const;

export const BLDG_NAMES: Record<(typeof BLDG_CODES)[number], string> = {
  ILC: "Integrative Learning Center",
  ARND: "Arnold House",
  BART: "Bartlett Hall",
  BOYD: "Boyden Gym",
  FURC: "Furculo Hall",
  HILS: "Hills House",
  MOR1: "Morrill Science Center (Bldg I)",
  MOR2: "Morrill Science Center (Bldg II)",
  MOR3: "Morrill Science Center (Bldg III)",
  MOR4: "Morrill Science Center (Bldg IV)",
  MOR: "Morrill Science Center",
  SOM: "School of Management",
  THOM: "Thompson Hall",
  HAS: "Hasbrouck Lab",
  AEBC: "Ag. Engin. Farm Srvc Bldg",
  JAME: "James House",
  BCA: "Bromery Center for Arts",
  BOWD: "Bowditch Hall",
  BFLD: "Butterfield House",
  CHEN: "Chenoweth Lab",
  CMPS: "Computer Science Building",
  CNTE: "Conte Polymer Resource Center",
  DB: "John Olver Design Building",
  CROT: "Crotty Hall",
  DKSN: "Dickinson",
  ECSC: "Engineering & Computer Science II",
  ELAB: "Engineering Laboratory",
  ELABII: "Engineering Lab II",
  ELM: "Elm",
  EMLY: "Emily Dickinson House",
  FAC: "Fine Arts Center",
  FREN: "French Hall",
  FERN: "Fernald Hall",
  GDLL: "Goodell Building",
  GORD: "Gordon Hall",
  GORM: "Gorman House",
  GSMN: "Goessmann Lab",
  GUN: "Gunness Laboratory",
  HERT: "Herter Hall",
  HICK: "Curry Hicks",
  HOLD: "Holdsworth Hall",
  LGRC: "Lederle Graduate Research Center",
  LGRT: "Lederle Graduate Research Tower",
  LIB: "W.E.B. Dubois Library",
  LSL: "Life Sciences Laboratory",
  MACH: "Machmer Hall",
  MARC: "Marcus Hall",
  MARX: "Marshall Hall",
  MRST: "Marston Hall",
  NAH: "New Africa House",
  SAB: "Studio Arts",
  SC: "South College",
  SKIN: "Skinner Hall",
  STK: "Stockbridge Hall",
  TOBN: "Tobin Hall",
  CHN: "Chenoweth Lab",
  MAH: "Mahar",
  ISB: "Integrated Sciences Building",
  GOES: "Goessmann Laboratory",
  FLIN: "Flint Laboratory",
};

export const BLDG_IDS: Record<(typeof BLDG_CODES)[number], string[]> = {
  LIB: ["40694454", "4054634"],
  SC: ["495323096"],
  THOM: ["147156729", "679153640"],
  MACH: ["40693158"],
  FLIN: ["147156735"],
  CHEN: ["304036839", "304036840"],
  CHN: ["304036839", "304036840"],
  HOLD: ["147156754"],
  BOWD: ["147156713"],
  ELABII: ["149698363"],
  CMPS: ["51650200"],
  ELAB: ["149698371"],
  MRST: ["51649170"],
  MARC: ["122197832"],
  AEBC: ["304036836", "147156716", "304036835", "304036834", "147156720"],
  GUN: ["149698361"],
  CNTE: ["122196718"],
  LGRT: ["122196717"],
  LGRC: ["676689778", "122196721"],
  GOES: ["51648973"],
  GSMN: ["51648973"],
  GDLL: ["147156711"],
  BART: ["147156714"],
  TOBN: ["147156703"],
  ELM: ["304034779"],
  HICK: ["147156702"],
  HERT: ["147156701", "668103247"],
  FAC: ["30698359"],
  DB: ["483220334"],
  SAB: ["217243375"],
  SOM: ["17798539"],
  MAH: ["30700447"],
  MOR3: ["844069509", "267026966"],
  MOR2: ["131281207"],
  MOR1: ["267026965"],
  MOR4: ["110428294"],
  LSL: ["217243843"],
  ISB: ["217244017"],
  MOR: ["217243924"],
  HAS: ["110428293"],
  ILC: ["292876549"],
  ARND: [],
  BOYD: [],
  FURC: [],
  HILS: [],
  JAME: [],
  BCA: [],
  BFLD: [],
  CROT: [],
  DKSN: [],
  ECSC: [],
  EMLY: [],
  FREN: [],
  FERN: [],
  GORD: [],
  GORM: [],
  MARX: [],
  NAH: [],
  SKIN: [],
  STK: []
};

export const BLDG_PARTS = Object.keys(BLDG_IDS).reduce(
  (acc, bldg) => {
    BLDG_IDS[bldg as keyof typeof BLDG_IDS].forEach((id) => (acc[id] = bldg as (typeof BLDG_CODES)[number]));

    return acc;
  },
  {} as Record<string, (typeof BLDG_CODES)[number]>,
);

export const REVERSED_BLDG_NAMES: Record<string, (typeof BLDG_CODES)[number]> = Object.fromEntries(
  Object.entries(BLDG_NAMES).map(([code, name]) => [name, code])
) as Record<string, (typeof BLDG_CODES)[number]>;
