import {
  ArrowForwardIos as ArrowForwardIosIcon,
  Book as BookIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  SnackbarOrigin,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Bible from "./components/Bible";
import Loading from "./components/Loading";
import SettingModal from "./components/SettingModal";
import TorahPortion from "./components/TorahPortion";
import { books, languages } from "./config";
import ContentsContext, { Contents } from "./contexts/ContentsContext";
import SettingContext from "./contexts/SettingContext";
import { getSetting, Setting } from "./SettingManager";

const RootWrapper = styled("div")(() => ({
  width: "100%",
}));

const BookIconWrapper = styled("div")(({ theme }) => ({
  marginRight: theme.spacing(1),
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SettingsIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const SideMenu = styled("div")(() => ({
  width: 250,
}));

const Container = styled("div")(({ theme }) => ({
  marginTop: 56,
  [theme.breakpoints.up("sm")]: {
    marginTop: 64,
  },
}));

const menuIconButtonSx = { mr: 2 };
const menuTypoSx = { flexGrow: 1, display: { xs: "none", sm: "block" } };
const searchInputProps = { "aria-label": "search" };
const snackbarAnchorOrigin: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "right",
};
const snackbarContentProps = { "aria-describedby": "message-id" };

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
    const promises = languages.map((e) =>
      fetch(`/json/${e.code}.json`)
        .then((res) => res.json())
        .then((data) => {
          contents[e.code] = data;
        })
    );
    Promise.all(promises).then(() => setContents(contents));
  }, []);

  const onKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        evt.key !== "Enter" ||
        contents === null ||
        searchInput.current === null
      )
        return;
      const query = searchInput.current.value;
      const res = /^\s*([\uAC00-\uD7AF]+)\s*(\d+)\s*[\s:]\s*(\d+)\s*$/.exec(
        query
      );
      if (res === null) return setSnackbarOpen(true);
      for (const book of books) {
        if (book.ko_abbr === res[1]) {
          for (const b of Object.values(contents)[0]) {
            if (b.abbrev === book.key) {
              const chapterCount = b.chapters.length;
              const chapter = Number(res[2]);
              if (chapter < 1 || chapter > chapterCount)
                return setSnackbarOpen(true);
              const verses = b.chapters[chapter - 1];
              const verse = Number(res[3]);
              if (verse < 1 || verse > verses.length)
                return setSnackbarOpen(true);
            }
          }
          searchInput.current.value = "";
          searchInput.current?.blur();
          navigate(`/${book.key}/${res[2]}/${res[3]}`);
          break;
        }
      }
    },
    [searchInput, navigate, contents]
  );

  const handleSnackbarClose = useCallback(
    (evt: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setSnackbarOpen(false);
    },
    []
  );

  const reloadSetting = useCallback(() => {
    setSetting(getSetting());
  }, []);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openSettingModal = useCallback(() => setSettingModalOpen(true), []);
  const closeSettingModal = useCallback(() => setSettingModalOpen(false), []);

  const snackbarAction = useMemo(
    () => [
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon />
      </IconButton>,
    ],
    [handleSnackbarClose]
  );

  if (contents === null || setting === null) return <Loading />;

  return (
    <RootWrapper>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={menuIconButtonSx}
            onClick={openMenu}
          >
            <MenuIcon />
          </IconButton>
          <BookIconWrapper>
            <BookIcon />
          </BookIconWrapper>
          <Typography variant="h6" noWrap component="div" sx={menuTypoSx}>
            성경 - Holy Bible
          </Typography>
          <Search>
            <SearchIconWrapper>
              <ArrowForwardIosIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="말씀 바로가기"
              inputProps={searchInputProps}
              onKeyDown={onKeyDown}
              inputRef={searchInput}
            />
          </Search>
          <SettingsIconButton color="inherit" onClick={openSettingModal}>
            <SettingsIcon />
          </SettingsIconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={menuOpen} onClose={closeMenu}>
        <div
          tabIndex={0}
          role="button"
          onClick={closeMenu}
          onKeyDown={closeMenu}
        >
          <SideMenu>
            <List component="nav">
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <BookIcon />
                </ListItemIcon>
                <ListItemText primary="성경보기" />
              </ListItemButton>
              <ListItemButton component={Link} to="/torahportions">
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary="토라포션" />
              </ListItemButton>
            </List>
          </SideMenu>
        </div>
      </Drawer>
      <SettingModal
        open={settingModalOpen}
        onSettingChange={reloadSetting}
        onClose={closeSettingModal}
      />
      <Container>
        <SettingContext.Provider value={setting}>
          <ContentsContext.Provider value={contents}>
            <Routes>
              <Route path="/torahportions" element={<TorahPortion />} />
              <Route path="/torahportions/:year" element={<TorahPortion />} />
              <Route path="/:book" element={<Bible />} />
              <Route path="/:book/:chapter" element={<Bible />} />
              <Route path="/:book/:chapter/:verse" element={<Bible />} />
              <Route path="*" element={<Navigate to="/gn" replace />} />
            </Routes>
          </ContentsContext.Provider>
        </SettingContext.Provider>
      </Container>
      <Snackbar
        anchorOrigin={snackbarAnchorOrigin}
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        ContentProps={snackbarContentProps}
        message={<span id="message-id">검색결과가 없습니다.</span>}
        action={snackbarAction}
      />
    </RootWrapper>
  );
};

export default App;
