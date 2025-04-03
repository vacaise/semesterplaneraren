
export const getModeDisplayText = (mode: string): string => {
  switch (mode) {
    case "balanced": return "Balanserad mix";
    case "longweekends": return "Långhelger";
    case "minibreaks": return "Miniledigheter";
    case "weeks": return "Veckor";
    case "extended": return "Långa semestrar";
    default: return "Anpassad";
  }
};
