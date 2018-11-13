process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const axios = require('axios');
const cheerio = require('cheerio');

const info = [
  { book: 'mat', abbr: 'mt'},
  { book: 'mar', abbr: 'mk'},
  { book: 'luk', abbr: 'lk'},
  { book: 'joh', abbr: 'jo'},
  { book: 'act', abbr: 'act'},
  { book: 'rom', abbr: 'rm'},
  { book: 'co1', abbr: '1co'},
  { book: 'co2', abbr: '2co'},
  { book: 'gal', abbr: 'gl'},
  { book: 'eph', abbr: 'eph'},
  { book: 'phi', abbr: 'ph'},
  { book: 'col', abbr: 'cl'},
  { book: 'th1', abbr: '1ts'},
  { book: 'th2', abbr: '2ts'},
  { book: 'ti1', abbr: '1tm'},
  { book: 'ti2', abbr: '2tm'},
  { book: 'tit', abbr: 'tt'},
  { book: 'plm', abbr: 'phm'},
  { book: 'heb', abbr: 'hb'},
  { book: 'jam', abbr: 'jm'},
  { book: 'pe1', abbr: '1pe'},
  { book: 'pe2', abbr: '2pe'},
  { book: 'jo1', abbr: '1jo'},
  { book: 'jo2', abbr: '2jo'},
  { book: 'jo3', abbr: '3jo'},
  { book: 'jde', abbr: 'jd'},
  { book: 'rev', abbr: 're'},
];

async function getBook({ book, abbr }) {
  const ret = { abbrev: abbr, chapters: []};
  const { data } = await axios.get(`https://www.sacred-texts.com/bib/wb/heb/${book}.htm`);

  const $ = cheerio.load(data);
  $('a[name]').parent().each((i, e) => {
    const res = /^(\d+):(\d+)\s+([\u0000-\uffff]+)$/.exec($(e).text().trim());
    if (res === null)
      return console.error('Unexpected error');
    const c = Number(res[1]), v = Number(res[2]), t = res[3];
    if (ret.chapters[c-1] === undefined)
      ret.chapters[c-1] = [];
    ret.chapters[c-1][v-1] = t;
  });
  return ret;
}

const res = [];
Promise.all(info.map((e, i) => getBook(e).then(v => res[i] = v))).then(() => {
  const fs = require('fs');
  fs.writeFile('he_new.json', JSON.stringify(res), () => {});
});