import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Switch, Route, Redirect, Link, useHistory, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames';

import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
  InputBase,
  fade,
} from '@material-ui/core';

import {
  ArrowForwardIos as ArrowForwardIosIcon,
  Book as BookIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';

import Loading from './components/Loading';
import Bible from './components/Bible';
import TorahPortion from './components/TorahPortion';
import SettingModal from './components/SettingModal';
import ContentsContext, { Contents } from './components/ContentsContext';
import SettingContext from './components/SettingContext';

import SettingManager, { Setting } from './SettingManager';

import { languages, books } from './config';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      width: '100%',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        marginRight: 20,
      },
    },
    bookIcon: {
      marginRight: theme.spacing(1),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(9),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(10),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
    settingsIcon: {
      marginLeft: theme.spacing(1),
    },
    sideMenu: {
      width: 250,
    },
    container: {
      marginTop: 56,
      [theme.breakpoints.up('sm')]: {
        marginTop: 64,
      },
    }
  })
);

export default function App(){
  const [contents, setContents] = React.useState<Contents | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [settingModalOpen, setSettingModalOpen] = React.useState(false);
  const [setting, setSetting] = React.useState<Setting | null>(null);
  const searchInput = React.useRef<HTMLInputElement>(null);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    setSetting(SettingManager.getSetting());
    const contents: Contents = {};
    const promises = languages.map(e => axios.get(`/json/${e.code}.json`).then(res => {
      contents[e.code] = res.data;
    }));
    Promise.all(promises).then(() => setContents(contents));
  }, []);

  if (contents === null || setting === null) return <Loading />;

  const onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key !== 'Enter' || searchInput.current === null) return;
    const query = searchInput.current.value;
    const res = /^\s*([\uAC00-\uD7AF]+)\s*(\d+)\s*[\s:]\s*(\d+)\s*$/.exec(query);
    if (res === null) return setSnackbarOpen(true);
    for (const book of books){
      if (book.ko_abbr === res[1]){
        for (const b of Object.values(contents)[0]){
          if (b.abbrev === book.key){
            const chapterCount = b.chapters.length;
            const chapter = Number(res[2]);
            if (chapter < 1 || chapter > chapterCount)
              return setSnackbarOpen(true);
            const verses = b.chapters[chapter-1];
            const verse = Number(res[3]);
            if (verse < 1 || verse > verses.length)
              return setSnackbarOpen(true);
          }
        }
        searchInput.current.value = '';
        searchInput.current?.blur();
        history.push(`/${book.key}/${res[2]}/${res[3]}`);
        break;
      }
    }
  };

  const handleSnackbarClose = (event: any, reason?: string) => {
    if (reason === 'clickaway')
      return;
    setSnackbarOpen(false);
  };

  const reloadSetting = () => {
    setSetting(SettingManager.getSetting());
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
          <div className={classNames(classes.bookIcon, classes.title)}>
            <BookIcon />
          </div>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            성경 - Holy Bible
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <ArrowForwardIosIcon />
            </div>
            <InputBase
              inputRef={searchInput}
              placeholder="말씀 바로가기"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onKeyDown={onKeyDown}
            />
          </div>
          <IconButton
            className={classes.settingsIcon}
            onClick={() => setSettingModalOpen(true)}
            color="inherit"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={() => setMenuOpen(false)}
          onKeyDown={() => setMenuOpen(false)}
        >
          <div className={classes.sideMenu}>
            <List component="nav">
              <ListItem button component={Link} to="/">
                <ListItemIcon><BookIcon /></ListItemIcon>
                <ListItemText primary="성경보기" />
              </ListItem>
              <ListItem button component={Link} to="/torahportions">
                <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                <ListItemText primary="토라포션" />
              </ListItem>
            </List>
          </div>
        </div>
      </Drawer>
      <SettingModal
        open={settingModalOpen}
        onSettingChange={reloadSetting}
        onClose={() => setSettingModalOpen(false)}
      />
      <div className={classes.container}>
        <SettingContext.Provider value={setting}>
          <ContentsContext.Provider value={contents}>
            <Switch>
              <Route exact path='/torahportions' component={TorahPortion} />
              <Route exact path='/torahportions/:year' component={(props: RouteComponentProps<{year: string}>) => <TorahPortion year={Number(props.match.params.year)} {...props} />} />
              <Route exact path='/:book' component={(props: RouteComponentProps<{book: string}>) => <Bible book={props.match.params.book} chapter={1} {...props} />} />
              <Route exact path='/:book/:chapter' component={(props: RouteComponentProps<{book: string, chapter: string}>) => <Bible book={props.match.params.book} chapter={Number(props.match.params.chapter)} {...props} />} />
              <Route exact path='/:book/:chapter/:verse' component={(props: RouteComponentProps<{book: string, chapter: string, verse: string}>) => <Bible book={props.match.params.book} chapter={Number(props.match.params.chapter)} verse={Number(props.match.params.verse)} {...props} />} />
              <Route path='/' render={() => <Redirect to="/gn" />} />
            </Switch>
          </ContentsContext.Provider>
        </SettingContext.Provider>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">검색결과가 없습니다.</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
};