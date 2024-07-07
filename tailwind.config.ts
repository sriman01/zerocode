/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // transparent: "#00000000",
                primary: "#00a2ed",
                "primary-1": "#1f40cb",
                "primary-2": "#051c2a",
                bg: "#111111",
                "bg+1": "#2a2a2a",
                fg: "#ffffff",
                "fg-1": "#b9b9b9",
                "contrast-bg": "#ffffff",
                "contrast-bg-1": "#f2f2f2",
                "contrast-fg": "#000000",
                // Asset-link afeb6666-2b9d-4945-a009-f30f3b305412
                "primary-100": {
                    light: "#051c2a",
                    dark: "#051c2a",
                },
                "primary-300": {
                    light: "#1f40cb",
                    dark: "#1f40cb",
                },
                "primary-500": {
                    light: "#00a2ed",
                    dark: "#00a2ed",
                },
                // /Asset-link
                "background-500": {
                    light: "#ecf0ff",
                    dark: "#17171a",
                },
                "foreground-100": {
                    light: "#fcfcfc",
                    dark: "#202329",
                },
                "foreground-300": {
                    light: "#b2b4b9",
                    dark: "#484a50",
                },
                "foreground-500": {
                    light: "#7c7e83",
                    dark: "#7c7e83",
                },
                "foreground-700": {
                    light: "#484a50",
                    dark: "#b2b4b9",
                },
                "foreground-900": {
                    light: "#202329",
                    dark: "#fcfcfc",
                },
                "ap-background": "#111936",
                "ap-background+1": "#1a223f",
                "ap-background+2": "#212946",
                "ap-foreground": "#ffffff",
                "ui-subtle-border": "rgba(194,224,255,0.25)",
            },
            screens: {
                // "headerHideLinks": "1100px",
                // "headerChange": "640px",
                // "footerChange": "640px",
            },
            gridColumnStart: {
                8: "8",
                9: "9",
                10: "10",
                11: "11",
                12: "12",
                13: "13",
                14: "14",
                15: "15",
                16: "16",
                17: "17",
                18: "18",
                19: "19",
            },
            gridColumnEnd: {
                "-1": "-1",
            },
            gridRowStart: {
                8: "8",
                9: "9",
                10: "10",
                11: "11",
                12: "12",
                13: "13",
                14: "14",
                15: "15",
                16: "16",
                17: "17",
                18: "18",
                19: "19",
            },
            gridRowEnd: {
                "-1": "-1",
            },
        },
    },
    plugins: [],
    prefix: "tw-",
};
