import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import pxToRem from "assets/theme/functions/pxToRem";

const textMain = (colors.text && colors.text.main) || "#7b809a";
const infoMain = (colors.info && colors.info.main) || "#1A73E8";
const infoFocus = (colors.info && colors.info.focus) || "#1662C4";
const secondaryMain = (colors.secondary && colors.secondary.main) || "#7b809a";
const secondaryFocus = (colors.secondary && colors.secondary.focus) || "#8f93a9";
const transparentMain = (colors.transparent && colors.transparent.main) || "transparent";

const { size } = typography;

const buttonText = {
  base: {
    backgroundColor: transparentMain,
    minHeight: pxToRem(40),
    color: textMain,
    boxShadow: "none",
    padding: `${pxToRem(10)} ${pxToRem(24)}`,

    "&:hover": {
      backgroundColor: transparentMain,
      boxShadow: "none",
    },

    "&:focus": {
      boxShadow: "none",
    },

    "&:active, &:active:focus, &:active:hover": {
      opacity: 0.85,
      boxShadow: "none",
    },

    "&:disabled": {
      boxShadow: "none",
    },

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(16)} !important`,
    },
  },

  small: {
    minHeight: pxToRem(32),
    padding: `${pxToRem(6)} ${pxToRem(16)}`,
    fontSize: size.xs,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(12)} !important`,
    },
  },

  large: {
    minHeight: pxToRem(47),
    padding: `${pxToRem(12)} ${pxToRem(28)}`,
    fontSize: size.sm,

    "& .material-icon, .material-icons-round, svg": {
      fontSize: `${pxToRem(22)} !important`,
    },
  },

  primary: {
    color: infoMain,

    "&:hover": {
      color: infoMain,
    },

    "&:focus:not(:hover)": {
      color: infoFocus,
      boxShadow: "none",
    },
  },

  secondary: {
    color: secondaryMain,

    "&:hover": {
      color: secondaryMain,
    },

    "&:focus:not(:hover)": {
      color: secondaryFocus,
      boxShadow: "none",
    },
  },
};

export default buttonText;
