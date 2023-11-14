import { createContext } from "react";

export interface Contents {
  [key: string]: {
    abbrev: string;
    chapters: string[][];
  }[];
}

const ContentsContext = createContext<Contents>({});

export default ContentsContext;
