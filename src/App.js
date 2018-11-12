import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import BookIcon from '@material-ui/icons/Book';
// import SearchIcon from '@material-ui/icons/Search';

import Loading from './components/Loading';
import Bible from './components/Bible';
import ContentsContext from './components/ContentsContext';

import { languages } from './config';

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
    // display: 'none',
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
});


class App extends Component {
  state ={
    loading: true,
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
        <AppBar position="static">
          <Toolbar>
            <div className={classes.bookIcon}>
              <BookIcon />
            </div>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Bible
            </Typography>
            {/*<div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>*/}
          </Toolbar>
        </AppBar>
        <ContentsContext.Provider value={this.state.contents}>
          <Switch>
            <Route exact path='/:book' component={props => <Bible book={props.match.params.book} chapter={1} {...props} />} />
            <Route exact path='/:book/:chapter' component={props => <Bible book={props.match.params.book} chapter={Number(props.match.params.chapter)} {...props} />} />
            <Route path='/' render={() => <Redirect to="/gn" />} />
          </Switch>
        </ContentsContext.Provider>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
