import React, { useEffect, useRef, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
  InputBase,
} from '@mui/material';

import {
  ArrowForwardIos as ArrowForwardIosIcon,
  Book as BookIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import Loading from './components/Loading';
import Bible from './components/Bible';
import TorahPortion from './components/TorahPortion';
import SettingModal from './components/SettingModal';
import ContentsContext, { Contents } from './contexts/ContentsContext';
import SettingContext from './contexts/SettingContext';

import { Setting, getSetting } from './SettingManager';

import { languages, books } from './config';

const RootWrapper = styled('div')(() => ({
  width: '100%',
}));

const BookIconWrapper = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SettingsIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const SideMenu = styled('div')(({ theme }) => ({
  width: 250,
}));

const Container = styled('div')(({ theme }) => ({
  marginTop: 56,
  [theme.breakpoints.up('sm')]: {
    marginTop: 64,
  },
}));

const App = () => {
  const [contents, setContents] = useState<Contents | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [setting, setSetting] = useState<Setting | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSetting(getSetting());
    const contents: Contents = {};
    const promises = languages.map(e => fetch(`/json/${e.code}.json`).then(res =>
      res.json().then(data => {
        contents[e.code] = data;
      })
    ));
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
        navigate(`/${book.key}/${res[2]}/${res[3]}`);
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
    setSetting(getSetting());
  };

  return (
    <RootWrapper>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <BookIconWrapper>
            <BookIcon />
          </BookIconWrapper><Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            성경 - Holy Bible
          </Typography>
          <Search>
            <SearchIconWrapper>
              <ArrowForwardIosIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="말씀 바로가기"
              inputProps={{ 'aria-label': 'search' }}
              onKeyDown={onKeyDown}
              inputRef={searchInput}
            />
          </Search>
          <SettingsIconButton
            color="inherit"
            onClick={() => setSettingModalOpen(true)}
          >
            <SettingsIcon />
          </SettingsIconButton>
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
          <SideMenu>
            <List component="nav">
              <ListItemButton component={Link} to="/">
                <ListItemIcon><BookIcon /></ListItemIcon>
                <ListItemText primary="성경보기" />
              </ListItemButton>
              <ListItemButton component={Link} to="/torahportions">
                <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                <ListItemText primary="토라포션" />
              </ListItemButton>
            </List>
          </SideMenu>
        </div>
      </Drawer>
      <SettingModal
        open={settingModalOpen}
        onSettingChange={reloadSetting}
        onClose={() => setSettingModalOpen(false)}
      />
      <Container>
        <SettingContext.Provider value={setting}>
          <ContentsContext.Provider value={contents}>
            <Routes>
              <Route path="/torahportions" element={<TorahPortion />} />
              <Route path='/torahportions/:year' element={<TorahPortion />} />
              <Route path='/:book' element={<Bible />} />
              <Route path='/:book/:chapter' element={<Bible />} />
              <Route path='/:book/:chapter/:verse' element={<Bible />} />
              <Route path="*" element={<Navigate to="/gn" />} />
            </Routes>
          </ContentsContext.Provider>
        </SettingContext.Provider>
      </Container>
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
    </RootWrapper>
  );
};

export default App;
