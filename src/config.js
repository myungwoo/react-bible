// 로딩하는 언어 파일 목록
// 각 절마다 띄워주는 용도 (순서 중요)
const languages = [
  { code: 'ko_gae', label: '개역개정' },
  { code: 'en_nkjv', label: 'New King James Version' },
  // { code: 'en_bbe', label: 'Basic English' },
  { code: 'he', label: 'Hebrew' },
  { code: 'he_new', label: 'Modern Hebrew' },
];

// Setting Modal에 띄워주는 용도 (순서 중요)
const languageGroups = [
  { codes: ['ko_gae'], label: '개역개정' },
  { codes: ['en_nkjv'], label: 'New King James Version' },
  // { codes: ['en_bbe'], label: 'Basic English' },
  { codes: ['he', 'he_new'], label: 'Hebrew / Modern Hebrew' },
];

const books = [
  { ko: "창세기", en:"Genesis", key: "gn", ko_abbr: "창" },
  { ko: "출애굽기", en:"Exodus", key: "ex", ko_abbr: "출" },
  { ko: "레위기", en:"Leviticus", key: "lv", ko_abbr: "레" },
  { ko: "민수기", en:"Numbers", key: "nm", ko_abbr: "민" },
  { ko: "신명기", en:"Deuteronomy", key: "dt", ko_abbr: "신" },
  { ko: "여호수아", en:"Joshua", key: "js", ko_abbr: "수" },
  { ko: "사사기", en:"Judges", key: "jud", ko_abbr: "삿" },
  { ko: "룻기", en:"Ruth", key: "rt", ko_abbr: "룻" },
  { ko: "사무엘상", en:"1 Samuel", key: "1sm", ko_abbr: "삼상" },
  { ko: "사무엘하", en:"2 Samuel", key: "2sm", ko_abbr: "삼하" },
  { ko: "열왕기상", en:"1 Kings", key: "1kgs", ko_abbr: "왕상" },
  { ko: "열왕기하", en:"2 Kings", key: "2kgs", ko_abbr: "왕하" },
  { ko: "역대상", en:"1 Chronicles", key: "1ch", ko_abbr: "대상" },
  { ko: "역대하", en:"2 Chronicles", key: "2ch", ko_abbr: "대하" },
  { ko: "에스라", en:"Ezra", key: "ezr", ko_abbr: "스" },
  { ko: "느헤미야", en:"Nehemiah", key: "ne", ko_abbr: "느" },
  { ko: "에스더", en:"Esther", key: "et", ko_abbr: "에" },
  { ko: "욥기", en:"Job", key: "job", ko_abbr: "욥" },
  { ko: "시편", en:"Psalms", key: "ps", ko_abbr: "시" },
  { ko: "잠언", en:"Proverbs", key: "prv", ko_abbr: "잠" },
  { ko: "전도서", en:"Ecclesiastes", key: "ec", ko_abbr: "전" },
  { ko: "아가", en:"Song of Solomon", key: "so", ko_abbr: "아" },
  { ko: "이사야", en:"Isaiah", key: "is", ko_abbr: "사" },
  { ko: "예레미야", en:"Jeremiah", key: "jr", ko_abbr: "렘" },
  { ko: "예레미야애가", en:"Lamentations", key: "lm", ko_abbr: "애" },
  { ko: "에스겔", en:"Ezekiel", key: "ez", ko_abbr: "겔" },
  { ko: "다니엘", en:"Daniel", key: "dn", ko_abbr: "단" },
  { ko: "호세아", en:"Hosea", key: "ho", ko_abbr: "호" },
  { ko: "요엘", en:"Joel", key: "jl", ko_abbr: "욜" },
  { ko: "아모스", en:"Amos", key: "am", ko_abbr: "암" },
  { ko: "오바댜", en:"Obadiah", key: "ob", ko_abbr: "옵" },
  { ko: "요나", en:"Jonah", key: "jn", ko_abbr: "욘" },
  { ko: "미가", en:"Micah", key: "mi", ko_abbr: "미" },
  { ko: "나훔", en:"Nahum", key: "na", ko_abbr: "나" },
  { ko: "하박국", en:"Habakkuk", key: "hk", ko_abbr: "합" },
  { ko: "스바냐", en:"Zephaniah", key: "zp", ko_abbr: "습" },
  { ko: "학개", en:"Haggai", key: "hg", ko_abbr: "학" },
  { ko: "스가랴", en:"Zechariah", key: "zc", ko_abbr: "슥" },
  { ko: "말라기", en:"Malachi", key: "ml", ko_abbr: "말" },
  { ko: "마태복음", en:"Matthew", key: "mt", ko_abbr: "마" },
  { ko: "마가복음", en:"Mark", key: "mk", ko_abbr: "막" },
  { ko: "누가복음", en:"Luke", key: "lk", ko_abbr: "눅" },
  { ko: "요한복음", en:"John", key: "jo", ko_abbr: "요" },
  { ko: "사도행전", en:"Acts", key: "act", ko_abbr: "행" },
  { ko: "로마서", en:"Romans", key: "rm", ko_abbr: "롬" },
  { ko: "고린도전서", en:"1 Corinthians", key: "1co", ko_abbr: "고전" },
  { ko: "고린도후서", en:"2 Corinthians", key: "2co", ko_abbr: "고후" },
  { ko: "갈라디아서", en:"Galatians", key: "gl", ko_abbr: "갈" },
  { ko: "에베소서", en:"Ephesians", key: "eph", ko_abbr: "엡" },
  { ko: "빌립보서", en:"Philippians", key: "ph", ko_abbr: "빌" },
  { ko: "골로새서", en:"Colossians", key: "cl", ko_abbr: "골" },
  { ko: "데살로니가전서", en:"1 Thessalonians", key: "1ts", ko_abbr: "살전" },
  { ko: "데살로니가후서", en:"2 Thessalonians", key: "2ts", ko_abbr: "살후" },
  { ko: "디모데전서", en:"1 Timothy", key: "1tm", ko_abbr: "딤전" },
  { ko: "디모데후서", en:"2 Timothy", key: "2tm", ko_abbr: "딤후" },
  { ko: "디도서", en:"Titus", key: "tt", ko_abbr: "딛" },
  { ko: "빌레몬서", en:"Philemon", key: "phm", ko_abbr: "몬" },
  { ko: "히브리서", en:"Hebrews", key: "hb", ko_abbr: "히" },
  { ko: "야고보서", en:"James", key: "jm", ko_abbr: "약" },
  { ko: "베르도전서", en:"1 Peter", key: "1pe", ko_abbr: "벧전" },
  { ko: "베드로후서", en:"2 Peter", key: "2pe", ko_abbr: "벧후" },
  { ko: "요한일서", en:"1 John", key: "1jo", ko_abbr: "요일" },
  { ko: "요한이서", en:"2 John", key: "2jo", ko_abbr: "요이" },
  { ko: "요한삼서", en:"3 John", key: "3jo", ko_abbr: "요삼" },
  { ko: "유다서", en:"Jude", key: "jd", ko_abbr: "유" },
  { ko: "요한계시록", en:"Revelation", key: "re", ko_abbr: "계" },
];

const torahPortions = {
  "Bereshit": {
    "koDesc": "태초에",
    "torah": "gn 1:1-6:8",
    "prophets": "is 42:5-43:10",
    "gospels": "jo 1:1-17"
  },
  "Noach": {
    "koDesc": "노아",
    "torah": "gn 6:9-11:32",
    "prophets": "is 54:1-55:5",
    "gospels": "lk 17:20-27"
  },
  "Lech-Lecha": {
    "koDesc": "너를 향해 가라",
    "torah": "gn 12:1-17:27",
    "prophets": "is 40:27-41:16",
    "gospels": "jo 8:51-58"
  },
  "Vayera": {
    "koDesc": "그리고 그가 나타났다",
    "torah": "gn 18:1-22:24",
    "prophets": "2kgs 4:1-37",
    "gospels": "lk 17:28-37"
  },
  "Chayei Sara": {
    "koDesc": "사라의 일생",
    "torah": "gn 23:1-25:18",
    "prophets": "1kgs 1:1-31",
    "gospels": "jo 4:3-14"
  },
  "Toldot": {
    "koDesc": "계보, 족보",
    "torah": "gn 25:19-28:9",
    "prophets": "ml 1:1-2:7",
    "gospels": "mt 10:21-38"
  },
  "Vayetzei": {
    "koDesc": "그리고 나갔다",
    "torah": "gn 28:10-32:2",
    "prophets": "ho 12:12-14:10",
    "gospels": "jo 1:41-51"
  },
  "Vayishlach": {
    "koDesc": "그리고 그가 보냈다",
    "torah": "gn 32:3-36:43",
    "prophets": "ho 11:7-12:12; ob 1:1-21",
    "gospels": "mt 2:13-23"
  },
  "Vayeshev": {
    "koDesc": "그리고 그는 정착했다",
    "torah": "gn 37:1-40:23",
    "prophets": "am 2:6-3:8",
    "gospels": "mt 1:18-25"
  },
  "Miketz": {
    "koDesc": "~끝에",
    "torah": "gn 41:1-44:17",
    "prophets": "is 66:1-24",
    "gospels": "lk 24:13-29"
  },
  "Vayigash": {
    "koDesc": "그가 가까이 갔다",
    "torah": "gn 44:18-47:27",
    "prophets": "ez 37:15-28",
    "gospels": "lk 24:30-48"
  },
  "Vayechi": {
    "koDesc": "그가 살았다",
    "torah": "gn 47:28-50:26",
    "prophets": "1kgs 2:1-12",
    "gospels": "jo 13:1-19"
  },
  "Shemot": {
    "koDesc": "이름들",
    "torah": "ex 1:1-6:1",
    "prophets": "is 27:6-28:13; is 29:22-23",
    "gospels": "mt 2:1-12"
  },
  "Vaera": {
    "koDesc": "내가 나타났다",
    "torah": "ex 6:2-9:35",
    "prophets": "ez 28:25-29:21",
    "gospels": "lk 11:14-22"
  },
  "Bo": {
    "koDesc": "들어가라",
    "torah": "ex 10:1-13:16",
    "prophets": "jr 46:13-28",
    "gospels": "jo 19:31-37"
  },
  "Beshalach": {
    "koDesc": "그리고 그가 나타났다",
    "torah": "ex 13:17-17:16",
    "prophets": "jud 4:4-5:31",
    "gospels": "mt 14:22-33"
  },
  "Yitro": {
    "koDesc": "이드로",
    "torah": "ex 18:1-20:23",
    "prophets": "is 6:1-7:6; is 9:5-6",
    "gospels": "mt 19:16-26"
  },
  "Mishpatim": {
    "koDesc": "법규들",
    "torah": "ex 21:1-24:18",
    "prophets": "jr 34:8-22; jr 33:25-26",
    "gospels": "mt 26:20-30"
  },
  "Terumah": {
    "koDesc": "헌물, 예물",
    "torah": "ex 25:1-27:19",
    "prophets": "1kgs 5:26-6:13",
    "gospels": "mk 12:35-44"
  },
  "Tetzaveh": {
    "koDesc": "명령하라",
    "torah": "ex 27:20-30:10",
    "prophets": "ez 43:10-27",
    "gospels": "mt 5:13-20"
  },
  "Ki Tisa": {
    "koDesc": "네가 셀 때",
    "torah": "ex 30:11-34:35",
    "prophets": "1kgs 18:1-39",
    "gospels": "mk 9:1-10"
  },
  "Vayakhel": {
    "koDesc": "그가 불러모았다",
    "torah": "ex 35:1-38:20",
    "prophets": "2kgs 11:17-12:17",
    "gospels": "mt 12:1-13"
  },
  "Pekudei": {
    "koDesc": "물목, 물품",
    "torah": "ex 38:21-40:38",
    "prophets": "1kgs 7:51-8:21",
    "gospels": "lk 16:1-13"
  },
  "Vayikra": {
    "koDesc": "그가 부르셨다",
    "torah": "lv 1:1-5:26",
    "prophets": "1sm 15:1-34",
    "gospels": "mt 5:23-30"
  },
  "Tzav": {
    "koDesc": "명령하라",
    "torah": "lv 6:1-8:36",
    "prophets": "jr 7:21-8:3; jr 9:22-23",
    "gospels": "mt 9:10-17"
  },
  "Shmini": {
    "koDesc": "여덟 번째",
    "torah": "lv 9:1-11:47",
    "prophets": "ez 36:16-38",
    "gospels": "mt 3:11-17"
  },
  "Tazria": {
    "koDesc": "임신했을 때",
    "torah": "lv 12:1-13:59",
    "prophets": "ez 45:16-46:18",
    "gospels": "lk 2:22-35"
  },
  "Metzora": {
    "koDesc": "악성 피부병",
    "torah": "lv 14:1-15:33",
    "prophets": "2kgs 7:3-20",
    "gospels": "mk 1:35-45"
  },
  "Pesach": {
    "koDesc": "유월절",
    "torah": "ex 12:21-51",
    "prophets": "js 3:5-7; jr 5:2-6:1; jr 6:27",
    "gospels": "jo 19:31-20:1"
  },
  "Shemini Shel Pesach": {
    "koDesc": "유월절 여덟 번째 날",
    "torah": "dt 14:22-16:17",
    "prophets": "is 10:32-12:6",
    "gospels": "jo 20:15-20"
  },
  "Chol HaMo'ed Pesach": {
    "koDesc": "유월절",
    "torah": "ex 33:12-34:26",
    "prophets": "ez 37:1-37:14",
    "gospels": ""
  },
  "Achrei Mot": {
    "koDesc": "죽음 후에",
    "torah": "lv 16:1-18:30",
    "prophets": "ez 22:1-19",
    "gospels": "mt 15:10-20; mk 12:28-34"
  },
  "Kedoshim": {
    "koDesc": "거룩함",
    "torah": "lv 19:1-20:27",
    "prophets": "am 9:7-15",
    "gospels": "mk 12:28-34"
  },
  "Emor": {
    "koDesc": "말하라",
    "torah": "lv 21:1-24:23",
    "prophets": "ez 44:15-31",
    "gospels": "mt 26:59-66"
  },
  "Behar": {
    "koDesc": "산에서",
    "torah": "lv 25:1-26:2",
    "prophets": "jr 32:6-27",
    "gospels": "lk 4:14-22"
  },
  "Bechukotai": {
    "koDesc": "내 규례들 안에서",
    "torah": "lv 26:3-27:34",
    "prophets": "jr 16:19-17:14",
    "gospels": "mt 16:20-28"
  },
  "Bamidbar": {
    "koDesc": "그 광야에서",
    "torah": "nm 1:1-4:20",
    "prophets": "ho 2:1-22",
    "gospels": "mt 4:1-17"
  },
  "Nasso": {
    "koDesc": "들어라, 계수하라",
    "torah": "nm 4:21-7:89",
    "prophets": "jud 13:2-5",
    "gospels": "lk 1:11-20"
  },
  "Beha'alotcha": {
    "koDesc": "네가 켤 때",
    "torah": "nm 8:1-12:15",
    "prophets": "zc 2:14-4:7",
    "gospels": "mt 14:14-21"
  },
  "Sh'lach": {
    "koDesc": "너를 위해 보내라",
    "torah": "nm 13:1-15:41",
    "prophets": "js 2:1-24",
    "gospels": "mt 10:1-14"
  },
  "Korach": {
    "koDesc": "고라",
    "torah": "nm 16:1-18:32",
    "prophets": "1sm 11:14-12:22",
    "gospels": "jo 19:1-17"
  },
  "Chukat": {
    "koDesc": "율례, 규례, (마음에) 새기다",
    "torah": "nm 19:1-22:1",
    "prophets": "jud 11:1-33",
    "gospels": "jo 19:38-42"
  },
  "Balak": {
    "koDesc": "발락",
    "torah": "nm 22:2-25:9",
    "prophets": "mi 5:6-6:8",
    "gospels": "mt 21:1-11"
  },
  "Pinchas": {
    "koDesc": "비느하스",
    "torah": "nm 25:10-30:1",
    "prophets": "jr 1:1-2:3",
    "gospels": "jo 2:13-22"
  },
  "Matot": {
    "koDesc": "지파들",
    "torah": "nm 30:2-32:42",
    "prophets": "jr 2:4-28",
    "gospels": "lk 13:1-9"
  },
  "Masei": {
    "koDesc": "여정들",
    "torah": "nm 33:1-36:13",
    "prophets": "jr 3:4; jr 4:1-2",
    "gospels": "mk 11:12-23"
  },
  "Devarim": {
    "koDesc": "말씀들",
    "torah": "dt 1:1-3:22",
    "prophets": "is 1:1-27",
    "gospels": "mt 24:1-22"
  },
  "Vaetchanan": {
    "koDesc": "그리고 그는 간구했다",
    "torah": "dt 3:23-7:11",
    "prophets": "is 40:1-26",
    "gospels": "lk 3:2-15"
  },
  "Eikev": {
    "koDesc": "~의 결과로써, 발꿈치, 야곱",
    "torah": "dt 7:12-11:25",
    "prophets": "is 49:14-51:3",
    "gospels": "mt 16:13-20"
  },
  "Re'eh": {
    "koDesc": "보라",
    "torah": "dt 11:26-16:17",
    "prophets": "is 66:1-24",
    "gospels": "jo 6:35-51"
  },
  "Shoftim": {
    "koDesc": "재판관들",
    "torah": "dt 16:18-21:9",
    "prophets": "is 51:12-52:12",
    "gospels": "jo 14:9-20"
  },
  "Ki Teitzei": {
    "koDesc": "네가 나갈 때",
    "torah": "dt 21:10-25:19",
    "prophets": "is 54:1-10",
    "gospels": "mt 24:29-42"
  },
  "Ki Tavo": {
    "koDesc": "너는 올 것이다",
    "torah": "dt 26:1-29:8",
    "prophets": "is 60:1-22",
    "gospels": "mt 4:13-24"
  },
  "Nitzavim": {
    "koDesc": "견고하게 서다",
    "torah": "dt 29:9-30:20",
    "prophets": "is 61:10-63:9",
    "gospels": "jo 12:41-50"
  },
  "Vayeilech": {
    "koDesc": "그리고 그가 간다",
    "torah": "dt 31:1-31:30",
    "prophets": "ho 14:2-10; mi 7:18-20; jl 2:15-27",
    "gospels": "mt 21:9-17"
  },
  "Ha'Azinu": {
    "koDesc": "들으라, 귀를 기울이라",
    "torah": "dt 32:1-32:52",
    "prophets": "2sm 22:1-51",
    "gospels": "jo 6:26-35"
  },
  "End-of-Year: Simchat-Torah, Sukkot": {
    "koDesc": "토라를 기뻐하다, 초막절",
    "torah": "ex 33:12-34:26",
    "prophets": "ez 38:18-39:16",
    "gospels": "jo 7:31-43"
  },
  "Shavuot": {
    "koDesc": "오순절",
    "torah": "dt 14:22-16:17",
    "prophets": "hk 2:20-3:19",
    "gospels": "jo 4:25-42"
  },
  "Rosh Hashana": {
    "koDesc": "나팔절",
    "torah": "gn 21:1-21:34",
    "prophets": "jr 31:1-19",
    "gospels": "mt 24:29-36; lk 1:39-55"
  },
  "Sukkot": {
    "koDesc": "초막절",
    "torah": "lv 22:26-23:44",
    "prophets": "zc 14:1-21",
    "gospels": "lk 2:1-20"
  },
  "Shmini Atzeret": {
    "koDesc": "여덟 번째 집회",
    "torah": "dt 14:22-16:17",
    "prophets": "1kgs 8:54-9:1",
    "gospels": "lk 2:21-32"
  }
};

export { languages, languageGroups, books, torahPortions };