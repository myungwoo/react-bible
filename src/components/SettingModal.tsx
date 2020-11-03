import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  useMediaQuery,
} from '@material-ui/core';

import SettingManager from '../SettingManager';

import { languageGroups } from '../config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gutterBottom: {
      marginBottom: theme.spacing(1),
    },
    modalContent: {
      paddingBottom: theme.spacing(1),
    },
    switchOption: {
      marginTop: -theme.spacing(0.5),
      marginBottom: -theme.spacing(0.5),
    },
  })
);

interface Prop{
  open: boolean;
  onSettingChange: () => any;
  onClose: () => any;
}

export default function SettingModal({
  open,
  onSettingChange,
  onClose,
}: Prop){
  const [language, setLanguage] = React.useState<boolean[]>([]);
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  useEffect(() => {
    const { visibleLanguages } = SettingManager.getSetting();
    const visibleCodes = visibleLanguages.reduce((acc, cur) => { acc.add(cur.code); return acc }, new Set());
    const language = Array(languageGroups.length).fill(true);
    languageGroups.forEach((lg, i) => {
      if (lg.codes.filter(code => !visibleCodes.has(code)).length !== 0)
        language[i] = false;
    });
    setLanguage(language);
  }, []);

  
  const handleChange = (i: number) => (evt: any, v: boolean) => {
    language[i] = v;
    setLanguage(language);

    const unvisibleLanguages: {[key: string]: boolean} = {};
    languageGroups.forEach((lg, i) => {
      if (language[i] === false){
        for (const code of lg.codes)
          unvisibleLanguages[code] = true;
      }
    });

    SettingManager.saveSetting(unvisibleLanguages);
    onSettingChange();
  };
  
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
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
                    checked={language[i]}
                    onChange={handleChange(i)}
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
        <Button onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
