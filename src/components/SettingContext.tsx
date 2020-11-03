import React from 'react';

import { Setting } from '../SettingManager';

const SettingContext = React.createContext<Setting | undefined>(undefined);

export default SettingContext;