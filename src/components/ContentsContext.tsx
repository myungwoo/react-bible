import React from 'react';

export interface Contents{
  [key: string]: {
    abbrev: string,
    chapters: string[][],
  }[],
}

const ContentsContext = React.createContext<Contents>({});

export default ContentsContext;
