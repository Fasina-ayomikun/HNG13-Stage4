export const palette = {
  bg: "#0b0218",
  card: "#18062e",
  purple: "#7c3aed",
  purple2: "#a78bfa",
  text: "#f7f5ff",
  sub: "#c7bdf2",
  accent: "#d946ef",
  glass: "rgba(124,58,237,0.15)",
};

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const angled = {
  card: {
    transform: [{ rotate: "-1.5deg" }],
    borderTopLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: { transform: [{ rotate: "12deg" }] },
};
