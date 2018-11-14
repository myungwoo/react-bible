import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import SettingManager from '../SettingManager';

import { languageGroups } from '../config';

const styles = theme => ({
  gutterBottom: {
    marginBottom: theme.spacing.unit,
  },
  modalContent: {
    paddingBottom: theme.spacing.unit,
  },
  switchOption: {
    marginTop: -theme.spacing.unit/2,
    marginBottom: -theme.spacing.unit/2,
  },
});

class SettingModal extends Component {
  constructor(props) {
    super(props);
    const { visibleLanguages } = SettingManager.getSetting();

    const visibleCodes = visibleLanguages.reduce((acc, cur) => { acc.add(cur.code); return acc }, new Set());
    const language = Array(languageGroups.length).fill(true);
    languageGroups.forEach((lg, i) => {
      if (lg.codes.filter(code => !visibleCodes.has(code)).length !== 0)
        language[i] = false;
    });
    this.state = { language };
  }

  handleChange = i => (evt, v) => {
    const { language } = this.state;
    language[i] = v;
    this.setState({ language });

    const unvisibleLanguages = {};
    languageGroups.forEach((lg, i) => {
      if (language[i] === false){
        for (const code of lg.codes)
          unvisibleLanguages[code] = true;
      }
    });

    SettingManager.saveSetting(unvisibleLanguages);
    this.props.onSettingChange();
  };

  render() {
    const { classes, fullScreen } = this.props;
    return (
      <Dialog
        // 모바일 환경에서 fullScreen으로 하려면 아래 주석을 해제
        // fullScreen={fullScreen}
        fullScreen={false && fullScreen}
        open={this.props.open}
        onClose={this.props.onClose}
        maxWidth="xs"
        fullWidth={true}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">설정</DialogTitle>
        <DialogContent className={classes.modalContent}>
          <FormControl component="fieldset">
            <FormLabel component="legend" className={classes.gutterBottom}>표시 언어</FormLabel>
            <FormGroup>
              {languageGroups.map((obj, i) => (
                <FormControlLabel
                  key={i}
                  classes={{ root: classes.switchOption }}
                  control={
                    <Switch
                      checked={this.state.language[i]}
                      onChange={this.handleChange(i)}
                      color="primary"
                    />
                  }
                  label={obj.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SettingModal.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,

  onSettingChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default withMobileDialog()(withStyles(styles)(SettingModal));
