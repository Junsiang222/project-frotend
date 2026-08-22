import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4ade80", // 亮绿色,呼应运动感,可以换颜色
    },
    secondary: {
      main: "#38bdf8",
    },
    background: {
      default: "#0f0f13",
      paper: "#1a1a22",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#a1a1aa",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    h3: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;