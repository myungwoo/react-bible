import React from 'react';
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import {
  Button,
  ButtonGroup,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
} from '@mui/material';

import moment from 'moment';
import 'moment/locale/ko';
import { HDate, Location, Event, Sedra } from '@hebcal/core';

import { books, torahPortions } from '../config';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    textAlign: 'center',
  },
}));

const keyToKo = books.reduce<{[key: string]: string}>((acc, cur) => {
  acc[cur.key] = cur.ko;
  return acc;
}, {});

const convert = (str: string) => {
  for (const [key, ko] of Object.entries(keyToKo)){
    str = str.replace(key, ko);
  }
  return str;
};

const StyledLinkInTableCell = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  borderBottom: '1px #333 dashed',
  '&:link': {
    color: 'inherit',
  },
  '&:visited': {
    color: 'inherit',
  },
}));

const CustomTableCellWithLink = (({to}: {to: string[]}) => {
  const links: React.ReactNode[] = to.map((e) => {
    if (e === '') return '';
    const res = /^(\w+) (\d+):(\d+)/.exec(e);
    if (res === null) return '';
    const book = res[1];
    const chapter = Number(res[2]);
    const verse = Number(res[3]);
    return (
      <StyledLinkInTableCell to={`/${book}/${chapter}/${verse}`} key={e}>{convert(e)}</StyledLinkInTableCell>
    );
  });

  return (
    <CustomTableCell>
      {links.reduce((acc, cur) => [acc, '; ', cur])}
    </CustomTableCell>
  );
});

const location = new Location(37.532600, 127.024612, false, 'Asia/Seoul', 'Seoul', 'KR');

interface ITorahPortion{
  shabbat: HDate;
  parshas: {
    en: string;
    he: string;
    koDesc: string;
    torah: string;
    prophets: string;
    gospels: string;
  }[];
}

const ContainerGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  marginLeft: 0, marginRight: 0,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  width: '100%',
}));

const TablePaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
  overflowX: 'auto',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 1000,
}));

const CurrentTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 700 : 300],
}));

const TorahPortion = () => {
  const navigate = useNavigate();
  const { year: yearString } = useParams();
  const year = Number(yearString);

  const today = new HDate();

  // year가 명시되어 있지 않으면 현재 년도를 구해서 redirect
  if (isNaN(year) || year <= 0){
    const currentYear = today.getFullYear();
    return <Navigate to={`/torahportions/${currentYear}`} replace />;
  }

  const firstShabbat = new HDate(1, 7, year).onOrAfter(6);
  const sedraObj = new Sedra(year, location.getIsrael());

  const torahportions: ITorahPortion[] = [];
  for (let i=firstShabbat;i.getFullYear()===year;i=i.after(6)){
    const parshas = sedraObj.get(i).map((str) => {
      const en = str;
      const he = new Event(i, str).render('he');
      return {
        en,
        he,
        koDesc: torahPortions[en]?.koDesc,
        torah: torahPortions[en]?.torah,
        prophets: torahPortions[en]?.prophets,
        gospels: torahPortions[en]?.gospels,
      };
    });
    torahportions.push({
      shabbat: i,
      parshas,
    });
  }

  return (
    <ContainerGrid container>
      <Grid item xs={12}>
        <ButtonGroup>
          <Button onClick={() => navigate(`/torahportions/${year-1}`)}>&lt;</Button>
          <Button onClick={() => navigate(`/torahportions/${today.getFullYear()}`)}>{year}</Button>
          <Button onClick={() => navigate(`/torahportions/${year+1}`)}>&gt;</Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        <TablePaper>
          <StyledTable>
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
              {torahportions.map((row, i) => {
                const Row = row.shabbat.isSameDate(today.onOrAfter(6)) ? CurrentTableRow : TableRow;
                return (
                  <Row key={i}>
                    <CustomTableCell>{row.parshas.map((e) => `${e.en} (${e.he})`).join('; ')}</CustomTableCell>
                    <CustomTableCell>{row.parshas.map((e) => e.koDesc).join('; ')}</CustomTableCell>
                    <CustomTableCell>{moment(row.shabbat.greg()).format('LL')}</CustomTableCell>
                    <CustomTableCell>{row.shabbat.render()}</CustomTableCell>
                    <CustomTableCellWithLink to={row.parshas.map((e) => e.torah)} />
                    <CustomTableCellWithLink to={row.parshas.map((e) => e.prophets)} />
                    <CustomTableCellWithLink to={row.parshas.map((e) => e.gospels)} />
                  </Row>
                );
              })}
            </TableBody>
          </StyledTable>
        </TablePaper>
      </Grid>
    </ContainerGrid>
  );
}

export default TorahPortion;
