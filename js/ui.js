export function escapeHTML(value) {
  return String(value)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

export function renderCategories(container, list, active, onClick) {
  container.innerHTML = "";
  for (const category of list) {
    const button = document.createElement("button");
    button.className = `category ${category.id === active ? "active" : ""}`;
    button.dataset.category = category.id;
    button.innerHTML = `<span class="category-icon">${escapeHTML(category.icon)}</span><span>${escapeHTML(category.label)}</span>`;
    button.addEventListener("click", () => onClick(category.id));
    container.appendChild(button);
  }
}

export function renderChannels(container, channels, onClick) {
  container.innerHTML = "";
  if (!channels.length) {
    container.innerHTML = `<div class="empty"><strong>No channels found</strong><span>Try a different search or category.</span></div>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  channels.slice(0, 500).forEach(channel => {
    const el = document.createElement("article");
    el.className = "channel";
    el.tabIndex = 0;
    el.innerHTML = `
      <div class="channel-logo">
        ${channel.logo
          ? `<img src="${escapeHTML(channel.logo)}" loading="lazy" referrerpolicy="no-referrer" alt="">`
          : `<span class="channel-placeholder">TV</span>`}
      </div>
      <div class="channel-info">
        <div class="channel-name" title="${escapeHTML(channel.name)}">${escapeHTML(channel.name)}</div>
        <div class="channel-meta">${escapeHTML(channel.group)}${channel.country ? ` · ${escapeHTML(channel.country)}` : ""}</div>
      </div>`;
    el.addEventListener("click", () => onClick(channel, el));
    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") onClick(channel, el);
    });
    fragment.appendChild(el);
  });
  container.appendChild(fragment);

  if (channels.length > 500) {
    const more = document.createElement("div");
    more.className = "empty";
    more.innerHTML = `<strong>Showing 500 of ${channels.length.toLocaleString()}</strong><span>Use search to narrow the list.</span>`;
    container.appendChild(more);
  }
}
