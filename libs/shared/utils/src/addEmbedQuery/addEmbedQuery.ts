export const addEmbedQuery = (isEmbed: boolean, queryChar: string) =>
  isEmbed && queryChar ? `${queryChar}isEmbedded=true` : '';
