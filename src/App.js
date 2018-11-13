import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import BookIcon from '@material-ui/icons/Book';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Loading from './components/Loading';
import Bible from './components/Bible';
import ContentsContext from './components/ContentsContext';

import { languages, books } from './config';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  bookIcon: {
    marginRight: theme.spacing.unit * 1,
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
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
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
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  container: {
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
    },
  }
});


class App extends Component {
  state ={
    loading: true,
    snackbarOpen: false,
  };

  onKeyDown = evt => {
    if (evt.key !== 'Enter') return;
    const query = evt.target.value;
    const res = /^\s*([\uAC00-\uD7AF])\s*(\d+)[\s:](\d+)\s*$/.exec(query);
    if (res === null) return this.setState({ snackbarOpen: true });
    for (const book of books){
      if (book.ko_abbr === res[1]){
        for (const b of Object.values(this.state.contents)[0]){
          if (b.abbrev === book.value){
            const chapterCount = b.chapters.length;
            const chapter = Number(res[2]);
            if (chapter < 1 || chapter > chapterCount)
              return this.setState({ snackbarOpen: true });
            const verses = b.chapters[chapter-1];
            const verse = Number(res[3]);
            if (verse < 1 || verse > verses.length)
              return this.setState({ snackbarOpen: true });
          }
        }
        this.searchInput.value = '';
        this.searchInput.blur();
        this.props.history.push(`/${book.value}/${res[2]}/${res[3]}`);
        break;
      }
    }
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    this.setState({ snackbarOpen: false });
  };

  componentDidMount() {
    const contents = {};
    const promises = languages.map(e => axios.get(`/json/${e.code}.json`).then(res => {
      contents[e.code] = res.data;
    }));
    Promise.all(promises).then(() => this.setState({ contents, loading: false }));
  }

  render() {
    const { classes } = this.props;

    if (this.state.loading) return <Loading />;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <div className={classes.bookIcon}>
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
                inputRef={ref => this.searchInput = ref}
                placeholder="말씀 바로가기"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onKeyDown={this.onKeyDown}
              />
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          <ContentsContext.Provider value={this.state.contents}>
            <Switch>
              <Route exact path='/:book' component={props => <Bible book={props.match.params.book} chapter={1} {...props} />} />
              <Route exact path='/:book/:chapter' component={props => <Bible book={props.match.params.book} chapter={Number(props.match.params.chapter)} {...props} />} />
              <Route exact path='/:book/:chapter/:verse' component={props => <Bible book={props.match.params.book} chapter={Number(props.match.params.chapter)} verse={Number(props.match.params.verse)} {...props} />} />
              <Route path='/' render={() => <Redirect to="/gn" />} />
            </Switch>
          </ContentsContext.Provider>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={1500}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">검색결과가 없습니다.</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
