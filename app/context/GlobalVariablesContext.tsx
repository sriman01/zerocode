import React, {createContext, useContext, useState, ReactNode} from "react";

type GlobalVariables = {
    colors: {[key: string]: string};
    setColors: (colors: {[key: string]: string}) => void;
};

const defaultSettings: GlobalVariables = {
    colors: {black: "#000"},
    setColors: () => {},
};

const GlobalVariablesContext = createContext<GlobalVariables>(defaultSettings);

export const useGlobalVariables = () => useContext(GlobalVariablesContext);

export function GlobalVariablesProvider({children}: {children: ReactNode}) {
    const [colors, setColors] = useState<{[key: string]: string}>({});

    return (
        <GlobalVariablesContext.Provider value={{colors, setColors}}>
            {children}
        </GlobalVariablesContext.Provider>
    );
}
