import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import IntegrationReactSelect from './IntegrationReactSelect';
import ContentsContext from './ContentsContext';

import { books, languages } from '../config';

const styles = theme => ({
  root: {
    width: '100%',
    padding: 20,
  },
  card: {
    marginBottom: 10,
  },
  copyButton: {
    cursor: 'pointer',
  },
});

const valueToObj = books.reduce((acc, cur) => { acc[cur.value] = cur; return acc }, {});

class Bible extends Component {
  static contextType = ContentsContext;

  onBookChange = val => {
    if (val.value !== undefined)
      this.props.history.push(`/${val.value}`);
  };

  onChapterChange = val => {
    if (val.value !== undefined)
      this.props.history.push(`/${this.props.book}/${val.value}`);
  };

  render() {
    const { classes } = this.props;

    if (!valueToObj.hasOwnProperty(this.props.book))
      return <Redirect to="/" />;

    const chapters = {}; const { ko_abbr } = valueToObj[this.props.book];
    for (const [lang, books] of Object.entries(this.context)){
      for (const book of books){
        if (book.abbrev === this.props.book)
          chapters[lang] = book.chapters;
      }
    }

    const chapterCount = Object.values(chapters)[0].length;
    if (!(1 <= this.props.chapter && this.props.chapter <= chapterCount))
      return <Redirect to="/" />;

    const verseCount = Object.values(chapters)[0][this.props.chapter-1].length;
    const verses = [];
    for (let i=0;i<verseCount;i++){
      const v = {};
      for (const [lang, chapter] of Object.entries(chapters)){
        v[lang] = chapter[this.props.chapter-1][i];
      }
      verses.push(v);
    }
    return (
      <Grid container spacing={16} className={classes.root}>
        <Grid item xs={12} md={4} lg={3}>
          <IntegrationReactSelect
            suggestions={books}
            value={{ label: valueToObj[this.props.book].label, value: this.props.book }}
            onChange={this.onBookChange}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <IntegrationReactSelect
            suggestions={Array(chapterCount).fill().map((e, i) => ({ value: `${i+1}`, label: `${i+1}장` }))}
            value={{ value: this.props.chapter.toString(), label: `${this.props.chapter}장` }}
            onChange={this.onChapterChange}
          />
        </Grid>
        <Grid item xs={12}>
          {verses.map((e, i) => (
            <Card key={i} className={classes.card}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h5">{ko_abbr} {this.props.chapter}:{i+1}</Typography>
                {languages.map(lang => (
                  <Typography key={lang.code} component="p">
                    <strong>({lang.label})</strong>&nbsp;
                    <span dangerouslySetInnerHTML={{__html: e[lang.code]}} />&nbsp;
                    <CopyToClipboard
                      text={`(${ko_abbr} ${this.props.chapter}:${i+1}) ${e[lang.code]}`}
                      onCopy={() => alert('복사됨')}
                      className={classes.copyButton}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </CopyToClipboard>
                  </Typography>
                ))}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    );
  }
}

Bible.propTypes = {
  classes: PropTypes.object.isRequired,

  book: PropTypes.string.isRequired,
  chapter: PropTypes.number.isRequired,
};

export default withStyles(styles)(Bible);