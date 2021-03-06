const fs = require('fs');
const path = require('path');

const books = [
  { label: "창세기 (Genesis)", value: "gn", ko_abbr: "창" },
  { label: "출애굽기 (Exodus)", value: "ex", ko_abbr: "출" },
  { label: "레위기 (Leviticus)", value: "lv", ko_abbr: "레" },
  { label: "민수기 (Numbers)", value: "nm", ko_abbr: "민" },
  { label: "신명기 (Deuteronomy)", value: "dt", ko_abbr: "신" },
  { label: "여호수아 (Joshua)", value: "js", ko_abbr: "수" },
  { label: "사사기 (Judges)", value: "jud", ko_abbr: "삿" },
  { label: "룻기 (Ruth)", value: "rt", ko_abbr: "룻" },
  { label: "사무엘상 (1 Samuel)", value: "1sm", ko_abbr: "삼상" },
  { label: "사무엘하 (2 Samuel)", value: "2sm", ko_abbr: "삼하" },
  { label: "열왕기상 (1 Kings)", value: "1kgs", ko_abbr: "왕상" },
  { label: "열왕기하 (2 Kings)", value: "2kgs", ko_abbr: "왕하" },
  { label: "역대상 (1 Chronicles)", value: "1ch", ko_abbr: "대상" },
  { label: "역대하 (2 Chronicles)", value: "2ch", ko_abbr: "대하" },
  { label: "에스라 (Ezra)", value: "ezr", ko_abbr: "스" },
  { label: "느헤미야 (Nehemiah)", value: "ne", ko_abbr: "느" },
  { label: "에스더 (Esther)", value: "et", ko_abbr: "에" },
  { label: "욥기 (Job)", value: "job", ko_abbr: "욥" },
  { label: "시편 (Psalms)", value: "ps", ko_abbr: "시" },
  { label: "잠언 (Proverbs)", value: "prv", ko_abbr: "잠" },
  { label: "전도서 (Ecclesiastes)", value: "ec", ko_abbr: "전" },
  { label: "아가 (Song of Solomon)", value: "so", ko_abbr: "아" },
  { label: "이사야 (Isaiah)", value: "is", ko_abbr: "사" },
  { label: "예레미야 (Jeremiah)", value: "jr", ko_abbr: "렘" },
  { label: "예레미야애가 (Lamentations)", value: "lm", ko_abbr: "애" },
  { label: "에스겔 (Ezekiel)", value: "ez", ko_abbr: "겔" },
  { label: "다니엘 (Daniel)", value: "dn", ko_abbr: "단" },
  { label: "호세아 (Hosea)", value: "ho", ko_abbr: "호" },
  { label: "요엘 (Joel)", value: "jl", ko_abbr: "욜" },
  { label: "아모스 (Amos)", value: "am", ko_abbr: "암" },
  { label: "오바댜 (Obadiah)", value: "ob", ko_abbr: "옵" },
  { label: "요나 (Jonah)", value: "jn", ko_abbr: "욘" },
  { label: "미가 (Micah)", value: "mi", ko_abbr: "미" },
  { label: "나훔 (Nahum)", value: "na", ko_abbr: "나" },
  { label: "하박국 (Habakkuk)", value: "hk", ko_abbr: "합" },
  { label: "스바냐 (Zephaniah)", value: "zp", ko_abbr: "습" },
  { label: "학개 (Haggai)", value: "hg", ko_abbr: "학" },
  { label: "스가랴 (Zechariah)", value: "zc", ko_abbr: "슥" },
  { label: "말라기 (Malachi)", value: "ml", ko_abbr: "말" },
  { label: "마태복음 (Matthew)", value: "mt", ko_abbr: "마" },
  { label: "마가복음 (Mark)", value: "mk", ko_abbr: "막" },
  { label: "누가복음 (Luke)", value: "lk", ko_abbr: "눅" },
  { label: "요한복음 (John)", value: "jo", ko_abbr: "요" },
  { label: "사도행전 (Acts)", value: "act", ko_abbr: "행" },
  { label: "로마서 (Romans)", value: "rm", ko_abbr: "롬" },
  { label: "고린도전서 (1 Corinthians)", value: "1co", ko_abbr: "고전" },
  { label: "고린도후서 (2 Corinthians)", value: "2co", ko_abbr: "고후" },
  { label: "갈라디아서 (Galatians)", value: "gl", ko_abbr: "갈" },
  { label: "에베소서 (Ephesians)", value: "eph", ko_abbr: "엡" },
  { label: "빌립보서 (Philippians)", value: "ph", ko_abbr: "빌" },
  { label: "골로새서 (Colossians)", value: "cl", ko_abbr: "골" },
  { label: "데살로니가전서 (1 Thessalonians)", value: "1ts", ko_abbr: "살전" },
  { label: "데살로니가후서 (2 Thessalonians)", value: "2ts", ko_abbr: "살후" },
  { label: "디모데전서 (1 Timothy)", value: "1tm", ko_abbr: "딤전" },
  { label: "디모데후서 (2 Timothy)", value: "2tm", ko_abbr: "딤후" },
  { label: "디도서 (Titus)", value: "tt", ko_abbr: "딛" },
  { label: "빌레몬서 (Philemon)", value: "phm", ko_abbr: "몬" },
  { label: "히브리서 (Hebrews)", value: "hb", ko_abbr: "히" },
  { label: "야고보서 (James)", value: "jm", ko_abbr: "약" },
  { label: "베르도전서 (1 Peter)", value: "1pe", ko_abbr: "벧전" },
  { label: "베드로후서 (2 Peter)", value: "2pe", ko_abbr: "벧후" },
  { label: "요한일서 (1 John)", value: "1jo", ko_abbr: "요일" },
  { label: "요한이서 (2 John)", value: "2jo", ko_abbr: "요이" },
  { label: "요한삼서 (3 John)", value: "3jo", ko_abbr: "요삼" },
  { label: "유다서 (Jude)", value: "jd", ko_abbr: "유" },
  { label: "요한계시록 (Revelation)", value: "re", ko_abbr: "계" },
];

const abbrToValue = books.reduce((acc, cur) => {
  acc[cur.ko_abbr] = cur.value;
  return acc;
}, {});

async function main() {
  const files = await new Promise((resolve, reject) => {
    fs.readdir('./txt', (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });

  const result = [];
  for (const fn of files){
    const fp = path.join('./txt', fn);
    const content = await new Promise((resolve, reject) => {
      fs.readFile(fp, (err, data) => {
        if (err) return reject(err);
        resolve(data.toString());
      });
    });
    const reg = /^([\u00FF-\uFFFF]+)(\d+):(\d+) ([\u0000-\uFFFF]+)$/;
    const chapters = [];
    let val;
    const lines = content.trim().split('\n').filter(e => reg.exec(e)).map(e => {
      const res = reg.exec(e);
      const bookKoAbbr = res[1];
      const chapter = Number(res[2]);
      const verse = Number(res[3]);
      const txt = res[4];
      if (!abbrToValue.hasOwnProperty(bookKoAbbr))
        console.error('hey!', bookKoAbbr);
      val = abbrToValue[bookKoAbbr];
      if (chapters[chapter-1] === undefined)
        chapters[chapter-1] = [];
      chapters[chapter-1][verse-1] = txt;
    });
    result.push({ abbrev: val, chapters });
  }
  return result;
}

main().then(res => fs.writeFile('ko.json', JSON.stringify(res), () => console.log('done')));
