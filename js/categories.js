export const categories = [
  { id: "all", label: "All channels", icon: "◉", match: () => true },
  { id: "news", label: "News", icon: "N", match: c => text(c).includes("news") },
  { id: "sports", label: "Sports", icon: "S", match: c => text(c).includes("sport") },
  { id: "movies", label: "Movies", icon: "M", match: c => /movie|film|cinema/.test(text(c)) },
  { id: "music", label: "Music", icon: "♪", match: c => /music|radio/.test(text(c)) },
  { id: "kids", label: "Kids", icon: "K", match: c => /kids|child|junior|cartoon|animation/.test(text(c)) },
  { id: "entertainment", label: "Entertainment", icon: "✦", match: c => /entertainment|show|comedy|series/.test(text(c)) },
  { id: "azerbaijan", label: "Azerbaijan", icon: "AZ", match: c => country(c, "azerbaijan") },
  { id: "turkey", label: "Turkey", icon: "TR", match: c => country(c, "turkey") },
  { id: "usa", label: "United States", icon: "US", match: c => country(c, "united states") }
];
const text = c => `${c.name} ${c.group} ${c.language}`.toLowerCase();
const country = (c, value) => `${c.country} ${c.group} ${c.name}`.toLowerCase().includes(value);
