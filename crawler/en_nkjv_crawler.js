const axios = require('axios');
const cheerio = require('cheerio');
const { TaskQueue } = require('cwait');

const taskQueue = new TaskQueue(Promise, 60); // 최대 동시에 처리하는 request의 개수

async function getPage(book, chapter){
  const { data } = await (taskQueue.wrap(() => axios.get(`https://www.biblestudytools.com/nkjv/${book}/${chapter}.html`)
    .catch(err => {
      console.log('error', book, chapter);
    })))();
  const $ = cheerio.load(data);
  const res = [];
  $('.verse-number').each((i, e) => {
    res[i] = $(e).parent().children(':nth-child(2)').text().trim();
  });
  return res;
}

async function getBook(book, abbr) {
  const { data } = await (taskQueue.wrap(() => axios.get(`https://www.biblestudytools.com/nkjv/${book}/`)))();
  const $ = cheerio.load(data);
  const chapterCount = $('.row .col-md-12 .bst-panel .panel-body .pull-left a[href]').length;
  
  const chapters = [];
  await Promise.all(Array(chapterCount).fill(0).map((e, i) => getPage(book, i+1).then(res => {
    chapters[i] = res;
    console.log('success', book, i+1);
  })));
  return { abbrev: abbr, chapters };
}

// https://www.biblestudytools.com/nkjv/
const info = [
  { book: 'genesis', abbr: 'gn' },
  { book: 'exodus', abbr: 'ex' },
  { book: 'leviticus', abbr: 'lv' },
  { book: 'numbers', abbr: 'nm' },
  { book: 'deuteronomy', abbr: 'dt' },

  { book: 'joshua', abbr: 'js' },
  { book: 'judges', abbr: 'jud' },
  { book: '1-samuel', abbr: '1sm' },
  { book: '2-samuel', abbr: '2sm' },
  { book: '1-kings', abbr: '1kgs' },
  { book: '2-kings', abbr: '2kgs' },
  { book: 'isaiah', abbr: 'is' },
  { book: 'jeremiah', abbr: 'jr' },
  { book: 'ezekiel', abbr: 'ez' },
  { book: 'hosea', abbr: 'ho' },
  { book: 'joel', abbr: 'jl' },
  { book: 'amos', abbr: 'am' },
  { book: 'obadiah', abbr: 'ob' },
  { book: 'jonah', abbr: 'jn' },
  { book: 'micah', abbr: 'mi' },
  { book: 'nahum', abbr: 'na' },
  { book: 'habakkuk', abbr: 'hk' },
  { book: 'zephaniah', abbr: 'zp' },
  { book: 'haggai', abbr: 'hg' },
  { book: 'zechariah', abbr: 'zc' },
  { book: 'malachi', abbr: 'ml' },

  { book: 'psalms', abbr: 'ps' },
  { book: 'proverbs', abbr: 'prv' },
  { book: 'job', abbr: 'job' },
  { book: 'song-of-solomon', abbr: 'so' },
  { book: 'ruth', abbr: 'rt' },
  { book: 'lamentations', abbr: 'lm' },
  { book: 'ecclesiastes', abbr: 'ec' },
  { book: 'esther', abbr: 'et' },
  { book: 'daniel', abbr: 'dn' },
  { book: 'ezra', abbr: 'ezr' },
  { book: 'nehemiah', abbr: 'ne' },
  { book: '1-chronicles', abbr: '1ch' },
  { book: '2-chronicles', abbr: '2ch' },

  { book: "matthew", abbr: 'mt' },
  { book: "mark", abbr: 'mk' },
  { book: "luke", abbr: 'lk' },
  { book: "john", abbr: 'jo' },
  { book: "acts", abbr: 'act' },
  { book: "romans", abbr: 'rm' },
  { book: "1-corinthians", abbr: '1co' },
  { book: "2-corinthians", abbr: '2co' },
  { book: "galatians", abbr: 'gl' },
  { book: "ephesians", abbr: 'eph' },
  { book: "philippians", abbr: 'ph' },
  { book: "colossians", abbr: 'cl' },
  { book: "1-thessalonians", abbr: '1ts' },
  { book: "2-thessalonians", abbr: '2ts' },
  { book: "1-timothy", abbr: '1tm' },
  { book: "2-timothy", abbr: '2tm' },
  { book: "titus", abbr: 'tt' },
  { book: "philemon", abbr: 'phm' },
  { book: "hebrews", abbr: 'hb' },
  { book: "james", abbr: 'jm' },
  { book: "1-peter", abbr: '1pe' },
  { book: "2-peter", abbr: '2pe' },
  { book: "1-john", abbr: '1jo' },
  { book: "2-john", abbr: '2jo' },
  { book: "3-john", abbr: '3jo' },
  { book: "jude", abbr: 'jd' },
  { book: "revelation", abbr: 're' },
];

const res = [];
Promise.all(info.map((e, i) => getBook(e.book, e.abbr).then(v => res[i] = v))).then(() => {
  const fs = require('fs');
  fs.writeFile('en_nkjv.json', JSON.stringify(res), () => {});
});