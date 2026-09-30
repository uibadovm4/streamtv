import { categories } from "./categories.js";
import { PLAYLIST_URL, parseM3U } from "./playlist.js";
import { Player } from "./player.js";
import { renderCategories, renderChannels } from "./ui.js";

const $ = id => document.getElementById(id);
const video = $("video");
const playerEmpty = $("playerEmpty");
const player = new Player(video, playerEmpty, (channel, error) => {
  if (error) {
    $("nowPlaying").textContent = "Playback error";
    $("nowGroup").textContent = error;
    return;
  }
  if (channel) setNowPlaying(channel);
});

let channels = [];
let activeCategory = "all";
let selected = null;

const categoryContainers = [$("categories"), $("mobileCategories")];

function setNowPlaying(channel) {
  selected = channel;
  $("nowPlaying").textContent = channel.name;
  $("nowGroup").textContent = channel.group || "Live channel";
  const logo = $("nowLogo");
  logo.innerHTML = channel.logo
    ? `<img src="${channel.logo.replaceAll('"',"&quot;")}" alt="">`
    : "TV";
}

function filteredChannels() {
  const query = $("search").value.trim().toLowerCase();
  const category = categories.find(c => c.id === activeCategory) || categories[0];

  return channels.filter(c => {
    const matchesCategory = category.match(c);
    const haystack = `${c.name} ${c.group} ${c.country} ${c.language}`.toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function refresh() {
  const filtered = filteredChannels();
  const category = categories.find(c => c.id === activeCategory);
  $("sectionTitle").textContent = category?.label || "All channels";
  $("resultCount").textContent = `${filtered.length.toLocaleString()} results`;

  renderChannels($("channels"), filtered, (channel, el) => {
    document.querySelectorAll(".channel.active").forEach(x => x.classList.remove("active"));
    el.classList.add("active");
    player.play(channel);
  });
}

function setCategory(id) {
  activeCategory = id;
  categoryContainers.forEach(container => {
    renderCategories(container, categories, activeCategory, setCategory);
  });
  refresh();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function load() {
  $("channelCount").textContent = "Loading…";
  try {
    const response = await fetch(PLAYLIST_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    channels = parseM3U(await response.text());

    $("channelCount").textContent = `${channels.length.toLocaleString()} channels`;
    $("heroCount").textContent = channels.length.toLocaleString();
    $("heroCategoryCount").textContent = categories.length - 1;

    setCategory("all");
  } catch (error) {
    console.error(error);
    $("channelCount").textContent = "Offline";
    $("channels").innerHTML = `<div class="empty"><strong>Playlist unavailable</strong><span>Could not load the public IPTV playlist. Check your connection and try again.</span></div>`;
  }
}

$("search").addEventListener("input", refresh);
$("stopBtn").addEventListener("click", () => player.stop());
$("fullscreenBtn").addEventListener("click", () => {
  $("player").requestFullscreen?.();
});

document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== $("search")) {
    e.preventDefault();
    $("search").focus();
  }
  if (e.key === "Escape") $("search").blur();
});

const savedTheme = localStorage.getItem("streamtv-theme");
if (savedTheme === "light") document.documentElement.classList.add("light");

$("themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  localStorage.setItem(
    "streamtv-theme",
    document.documentElement.classList.contains("light") ? "light" : "dark"
  );
});

load();
