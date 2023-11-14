import React, { useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';

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
} from '@mui/material';

import { getSetting, saveSetting } from '../SettingManager';

import { languageGroups } from '../config';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginTop: -theme.spacing(0.5),
  marginBottom: -theme.spacing(0.5),
}));

interface Prop{
  open: boolean;
  onSettingChange: () => any;
  onClose: () => any;
}

const SettingModal = ({ open, onSettingChange, onClose }: Prop) => {
  const [language, setLanguage] = React.useState<boolean[]>([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const { visibleLanguages } = getSetting();
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

    saveSetting(unvisibleLanguages);
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
      <StyledDialogContent>
        <FormControl component="fieldset">
          <StyledFormLabel>표시 언어</StyledFormLabel>
          <FormGroup>
            {languageGroups.map((obj, i) => (
              <StyledFormControlLabel
                key={i}
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
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingModal;
