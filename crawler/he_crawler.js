const axios = require('axios');
const cheerio = require('cheerio');


async function getPage(book, chapter){
  const { data } = await axios.get(`http://www.ancient-hebrew.org/hebrewbible/${book}_${chapter}.html`);
  const $ = cheerio.load(data);
  const res = [];
  $('td[align=right] [face=david]').each((i, e) => res[i] = $(e).text());
  return res;
}

async function getBook(book, chapterCount, abbr) {
  const chapters = [];
  for (let i=1;i<=chapterCount;i++){
    chapters[i-1] = await getPage(book, i);
  }
  return { abbrev: abbr, chapters };
}

// http://www.ancient-hebrew.org/hebrewbible/0_index.html
const info = [
  { book: 'Genesis', chapters: 50, abbr: 'gn' },
  { book: 'Exodus', chapters: 40, abbr: 'ex' },
  { book: 'Leviticus', chapters: 27, abbr: 'lv' },
  { book: 'Numbers', chapters: 36, abbr: 'nm' },
  { book: 'Deuteronomy', chapters: 34, abbr: 'dt' },

  { book: 'Joshua', chapters: 24, abbr: 'js' },
  { book: 'Judges', chapters: 21, abbr: 'jud' },
  { book: '1Samuel', chapters: 31, abbr: '1sm' },
  { book: '2Samuel', chapters: 24, abbr: '2sm' },
  { book: '1Kings', chapters: 22, abbr: '1kgs' },
  { book: '2Kings', chapters: 25, abbr: '2kgs' },
  { book: 'Isaiah', chapters: 66, abbr: 'is' },
  { book: 'Jeremiah', chapters: 52, abbr: 'jr' },
  { book: 'Ezekiel', chapters: 48, abbr: 'ez' },
  { book: 'Hosea', chapters: 14, abbr: 'ho' },
  { book: 'Joel', chapters: 4, abbr: 'jl' },
  { book: 'Amos', chapters: 9, abbr: 'am' },
  { book: 'Obadiah', chapters: 1, abbr: 'ob' },
  { book: 'Jonah', chapters: 4, abbr: 'jn' },
  { book: 'Micah', chapters: 7, abbr: 'mi' },
  { book: 'Nahum', chapters: 3, abbr: 'na' },
  { book: 'Habakkuk', chapters: 3, abbr: 'hk' },
  { book: 'Zephaniah', chapters: 3, abbr: 'zp' },
  { book: 'Haggai', chapters: 2, abbr: 'hg' },
  { book: 'Zechariah', chapters: 14, abbr: 'zc' },
  { book: 'Malachi', chapters: 3, abbr: 'ml' },

  { book: 'Psalms', chapters: 150, abbr: 'ps' },
  { book: 'Proverbs', chapters: 31, abbr: 'prv' },
  { book: 'Job', chapters: 42, abbr: 'job' },
  { book: 'SofS', chapters: 8, abbr: 'so' },
  { book: 'Ruth', chapters: 4, abbr: 'rt' },
  { book: 'Lamentations', chapters: 5, abbr: 'lm' },
  { book: 'Ecclesiastes', chapters: 12, abbr: 'ec' },
  { book: 'Esther', chapters: 10, abbr: 'et' },
  { book: 'Daniel', chapters: 12, abbr: 'dn' },
  { book: 'Ezra', chapters: 10, abbr: 'ezr' },
  { book: 'Nehemiah', chapters: 13, abbr: 'ne' },
  { book: '1Chronicles', chapters: 29, abbr: '1ch' },
  { book: '2Chronicles', chapters: 36, abbr: '2ch' },
];

const res = [];
Promise.all(info.map((e, i) => getBook(e.book, e.chapters, e.abbr).then(v => res[i] = v))).then(() => {
  const fs = require('fs');
  fs.writeFile('he.json', JSON.stringify(res), () => {});
});