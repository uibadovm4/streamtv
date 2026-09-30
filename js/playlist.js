export const PLAYLIST_URL = "https://iptv-org.github.io/iptv/index.m3u";

export function parseM3U(text) {
  const lines = text.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const result = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("#EXTINF:")) {
      const comma = line.indexOf(",");
      const name = comma >= 0 ? line.slice(comma + 1).trim() : "Unknown Channel";
      const attrs = {};
      const regex = /([A-Za-z0-9-]+)="([^"]*)"/g;
      let match;
      while ((match = regex.exec(line))) attrs[match[1]] = match[2];

      current = {
        name,
        logo: attrs["tvg-logo"] || attrs.logo || "",
        group: attrs["group-title"] || "Other",
        country: attrs["tvg-country"] || "",
        language: attrs["tvg-language"] || "",
        url: ""
      };
    } else if (current && !line.startsWith("#")) {
      current.url = line;
      if (current.url) result.push(current);
      current = null;
    }
  }
  return result;
}
