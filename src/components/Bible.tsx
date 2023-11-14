import {
  Close as CloseIcon,
  Forward as ForwardIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Card,
  CardContent,
  Fab,
  Grid,
  IconButton,
  Snackbar,
  SnackbarOrigin,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { keyframes, styled, useTheme } from "@mui/material/styles";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { books, Language } from "../config";
import ContentsContext from "../contexts/ContentsContext";
import SettingContext from "../contexts/SettingContext";
import copyText from "../modules/copy-to-clipboard";

const blinkAnimationLight = keyframes`
50% {
  background-color: rgba(0, 0, 0, 0.3);
}
`;

const blinkAnimationDark = keyframes`
50% {
  background-color: rgba(255, 255, 255, 0.3);
}
`;

const ContainerGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  marginLeft: 0,
  marginRight: 0,
  width: "100%",
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  margin: theme.spacing(1),
  position: "fixed",
  bottom: 6,
  right: 6,
}));

const StyledForwardIcon = styled(ForwardIcon)(() => ({
  fontSize: 30,
}));

const CopyButtonWrapper = styled(`span`)(() => ({
  cursor: "pointer",
}));

const StyledCard = styled(Card)(() => ({
  marginBottom: 10,
}));

const StyledBlinkingCard = styled(Card)(({ theme }) => ({
  marginBottom: 10,
  animation: `${
    theme.palette.mode === "dark" ? blinkAnimationDark : blinkAnimationLight
  } 1s linear infinite`,
}));

const valueToObj = books.reduce(
  (acc: { [key: string]: (typeof books)[0] }, cur) => {
    acc[cur.key] = cur;
    return acc;
  },
  {}
);

interface AutoCompleteOption {
  label: string;
  value: string;
}

const getLabel = (option: AutoCompleteOption) => option.label;
const isOptionEqualToValue = (
  option: AutoCompleteOption,
  value: AutoCompleteOption
) => option.label === value.label && option.value === value.value;
const renderInput = (params: AutocompleteRenderInputParams) => (
  <TextField {...params} margin="dense" size="small" />
);

const snackbarAnchorOrigin: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "right",
};
const snackbarContentProps = {
  "aria-describedby": "message-id",
};

const cardTypoStyle = { cursor: "pointer" };

const Bible = () => {
  const params = useParams();

  const book = params.book || "gn";
  const chapter = Number(params.chapter) || 1;
  const verse = Number(params.verse) || 1;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const initVerse = useRef<HTMLDivElement>(null);
  const contents = useContext(ContentsContext);
  const setting = useContext(SettingContext);
  const topBlank = useMediaQuery(theme.breakpoints.down("sm")) ? 62 : 70;

  useEffect(() => {
    if (initVerse.current === null || params.verse === undefined) return;
    // sm(width>=600)보다 작은 상황이면 AppBar의 크기가 줄어드므로 그에 알맞춰 위쪽 공백을 잡는다
    setTimeout(() => {
      if (initVerse.current) initVerse.current.style.animation = "none";
    }, 1000);
    window?.scrollTo({
      top: initVerse.current.offsetTop - topBlank,
      // behavior: "smooth"
    });
    // topBlank가 바뀌었을 때 스크롤이 움직이지 않도록 의도적으로 topBlank를 배제했다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, chapter, params.verse]);

  const onBookChange = useCallback(
    (evt: React.SyntheticEvent, val: { label: string; value: string }) => {
      navigate(`/${val.value}`);
    },
    [navigate]
  );

  const onChapterChange = useCallback(
    (evt: React.SyntheticEvent, val: { label: string; value: string }) => {
      navigate(`/${book}/${val.value}`);
    },
    [book, navigate]
  );

  const handleCopyText = (txt: string) => () => {
    copyText(txt);
    setSnackbarOpen(true);
  };
  const handleClose = useCallback(
    (evt: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setSnackbarOpen(false);
    },
    []
  );

  const handleClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      // behavior: "smooth"
    });
  }, []);

  const bookValue = useMemo(
    () => ({
      label: Object.prototype.hasOwnProperty.call(valueToObj, book)
        ? `${valueToObj[book]?.ko} (${valueToObj[book]?.en})`
        : "",
      value: book,
    }),
    [book]
  );
  const chapterValue = useMemo(
    () => ({ value: chapter.toString(), label: `${chapter}장` }),
    [chapter]
  );

  const snackbarAction = useMemo(
    () => [
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>,
    ],
    [handleClose]
  );

  const moveToVerse = useCallback(
    (verse: number) => () => navigate(`/${book}/${chapter}/${verse}`),
    [book, chapter, navigate]
  );

  if (!Object.prototype.hasOwnProperty.call(valueToObj, book))
    return <Navigate to="/" replace />;

  const chapters: { [key: string]: string[][] } = {};
  const { ko_abbr } = valueToObj[book];
  for (const [lang, books] of Object.entries(contents)) {
    for (const _book of books) {
      if (_book.abbrev === book) chapters[lang] = _book.chapters;
    }
  }

  const chapterCount = Math.max.apply(
    null,
    Object.values(chapters).map((e) => e.length)
  );
  if (!(1 <= chapter && chapter <= chapterCount))
    return <Navigate to="/" replace />;

  const getLength = (arr: string[]) => (arr && arr.length) || 0;
  const verseCount = Math.max.apply(
    null,
    Object.values(chapters).map((e) => getLength(e[chapter - 1]))
  );
  if (!(1 <= verse && verse <= verseCount)) return <Navigate to="/" replace />;

  const verses: { [key: string]: string }[] = [];
  for (let i = 0; i < verseCount; i++) {
    const v: { [key: string]: string } = {};
    for (const [lang, _chapter] of Object.entries(chapters)) {
      if (chapter <= _chapter.length) v[lang] = _chapter[chapter - 1][i];
    }
    verses.push(v);
  }

  return (
    <ContainerGrid container spacing={2}>
      {chapter < chapterCount && (
        <Link to={`/${book}/${chapter + 1}`} onClick={handleClick}>
          <StyledFab color="primary" aria-label="Add">
            <StyledForwardIcon />
          </StyledFab>
        </Link>
      )}
      <Grid item xs={12} md={4} lg={3}>
        <Autocomplete
          disableClearable
          getOptionLabel={getLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          options={books.map((e) => ({
            label: `${e.ko} (${e.en})`,
            value: e.key,
          }))}
          value={bookValue}
          onChange={onBookChange}
          renderInput={renderInput}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Autocomplete
          disableClearable
          getOptionLabel={getLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          options={Array(chapterCount)
            .fill(0)
            .map((e, i) => ({ value: `${i + 1}`, label: `${i + 1}장` }))}
          value={chapterValue}
          onChange={onChapterChange}
          renderInput={renderInput}
        />
      </Grid>
      <Snackbar
        anchorOrigin={snackbarAnchorOrigin}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        ContentProps={snackbarContentProps}
        message={<span id="message-id">Copied</span>}
        action={snackbarAction}
      />
      <Grid item xs={12}>
        {verses.map((e, i) => {
          const CardT =
            i + 1 === verse && params.verse !== undefined
              ? StyledBlinkingCard
              : StyledCard;
          return (
            <CardT key={i} ref={i + 1 === verse ? initVerse : null}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h5">
                  <span onClick={moveToVerse(i + 1)} style={cardTypoStyle}>
                    {ko_abbr}
                    {chapter}:{i + 1}
                  </span>
                </Typography>
                {setting?.visibleLanguages.map(
                  (lang: Language) =>
                    e[lang.code] && (
                      <Typography
                        key={lang.code}
                        component="p"
                        variant="subtitle1"
                      >
                        <strong>({lang.label})</strong>&nbsp;
                        <span>{e[lang.code]}</span>&nbsp;
                        <CopyButtonWrapper
                          onClick={handleCopyText(
                            `(${ko_abbr}${chapter}:${i + 1}) ${e[lang.code]}`
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                          </svg>
                        </CopyButtonWrapper>
                      </Typography>
                    )
                )}
              </CardContent>
            </CardT>
          );
        })}
      </Grid>
    </ContainerGrid>
  );
};

export default Bible;
