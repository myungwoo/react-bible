import { createContext } from 'react';

import { Setting } from '../SettingManager';

const SettingContext = createContext<Setting | undefined>(undefined);

export default SettingContext;
