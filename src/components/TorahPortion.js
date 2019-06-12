import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ko';
import Hebcal from 'hebcal';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { books, torahPortions } from '../config';

const keyToKo = books.reduce((acc, cur) => {
  acc[cur.key] = cur.ko;
  return acc;
}, {});

const convert = str => {
  for (const [key, ko] of Object.entries(keyToKo)){
    str = str.replace(key, ko);
  }
  return str;
};

const CustomTableCell = withStyles(theme => ({
  root: {
    textAlign: 'center',
  },
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: '0.9rem',
  },
}))(TableCell);

const CustomTableCellWithLink = withStyles(theme => ({
  link: {
    textDecoration: 'none',
    borderBottom: '1px #333 dashed',
    '&:link': {
      color: 'inherit',
    },
    '&:visited': {
      color: 'inherit',
    },
  },
}))(props => {
  const { classes, to } = props;
  return (
    <CustomTableCell>
      {to.reduce((acc, e) => acc.concat(e.split('; ').map(e => {
        if (e === '') return '';
        const res = /^(\w+) (\d+):(\d+)/.exec(e);
        const book = res[1];
        const chapter = Number(res[2]);
        const verse = Number(res[3]);
        return (
          <Link to={`/${book}/${chapter}/${verse}`} key={e} className={classes.link}>{convert(e)}</Link>
        );
      })), []).reduce((acc, cur) => [acc, '; ', cur])}
    </CustomTableCell>
  );
});

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    marginLeft: 0, marginRight: 0,
    paddingLeft: theme.spacing.unit*3,
    paddingRight: theme.spacing.unit*3,
    width: '100%',
  },
  tablePaper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 1000,
  },
  row: {
    '&:nth-of-type(1)': {
      backgroundColor: theme.palette.grey[200],
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
});

class TorahPortion extends Component {
  constructor(props) {
    super(props);
    const hnow = new Hebcal.HDate(moment().add(-1, 'day').toDate()).after(6);
    const thisParsha = hnow.getParsha();
    this.state = { rows: [] };
    for (let i=new Hebcal.HDate(hnow);;i=i.after(6)){
      const parshas = i.getParsha();
      const hparshas = i.getParsha('h');

      if (parshas[0] === 'Pesach'){
        const prevParshas = i.before(6).getParsha();
        const nextParshas = i.after(6).getParsha();
        if (prevParshas[0] === 'Pesach'){
          // 두 번째 유월절인 경우
          parshas[0] = 'Shemini Shel Pesach';
          hparshas[0] = 'שמיני של פסח';
        }
        else if (nextParshas[0] !== 'Pesach'){
          // 유월절이 한 번만 등장하는 경우
          parshas[0] = `Chol HaMo'ed Pesach`;
          hparshas[0] = 'חול המועד פסח';
        }
      }

      this.state.rows.push({
        parshas,
        hparshas,
        koDesc: parshas.map(e => torahPortions[e].koDesc).join('; '),
        date: moment(i.greg()).format('LL'),
        hdate: i.toString(),
        torah: parshas.map(e => torahPortions[e].torah),
        prophets: parshas.map(e => torahPortions[e].prophets),
        gospels: parshas.map(e => torahPortions[e].gospels),
      });
      if (i.year !== hnow.year && parshas.includes(thisParsha[0])) break;
    }
  }

  render() {
    const { classes } = this.props;
    
    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Paper className={classes.tablePaper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell style={{ maxWidth: '230px' }}>토라포션</CustomTableCell>
                  <CustomTableCell style={{ minWidth: '280px' }}>뜻</CustomTableCell>
                  <CustomTableCell>날짜 (Shabbat)</CustomTableCell>
                  <CustomTableCell>히브리력 날짜 (Shabbat)</CustomTableCell>
                  <CustomTableCell>토라</CustomTableCell>
                  <CustomTableCell>예언서</CustomTableCell>
                  <CustomTableCell>복음서</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.rows.map((row, i) => {
                  return (
                    <TableRow key={i} className={classes.row}>
                      <CustomTableCell>{row.parshas.map((e, i) => `${e} (${row.hparshas[i]})`).join(', ')}</CustomTableCell>
                      <CustomTableCell>{row.koDesc}</CustomTableCell>
                      <CustomTableCell>{row.date}</CustomTableCell>
                      <CustomTableCell>{row.hdate}</CustomTableCell>
                      <CustomTableCellWithLink to={row.torah} />
                      <CustomTableCellWithLink to={row.prophets} />
                      <CustomTableCellWithLink to={row.gospels} />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

TorahPortion.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TorahPortion);
