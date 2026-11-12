(() => {
  "use strict";
  const gods = Array.isArray(window.GODS) ? window.GODS : [];
  const byName = new Map(gods.map(g => [g.name, g]));
  const el = id => document.getElementById(id);
  const grid = el("god-grid");
  const profile = el("god-profile");
  const lineage = el("lineage-explorer");
  const search = el("god-search");  const generationFilter = el("filter-generation");
  const groupFilter = el("filter-group");
  const houseFilter = el("filter-house");
  let selected = null;

  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value == null ? "" : String(value);
    return node;
  };
  const addText = (parent, tag, value, className) => {
    const node = text(tag, value, className);
    parent.appendChild(node);
    return node;
  };
  const listNames = names => Array.isArray(names) ? names.filter(Boolean) : [];
  const generationLabel = n => Number(n) < 0 ? "Before Generation 0" : "Generation " + n;
  const parentLine = g => listNames(g.parents).length ? listNames(g.parents).join(" · ") : "No parent recorded";
  const childLine = g => listNames(g.children).length ? listNames(g.children).join(" · ") : "No children recorded";

  if (!gods.length) {
    el("result-count").textContent = "The pantheon data could not be loaded.";
    grid.appendChild(text("p", "Please check that gods-data.js is available."));
    return;
  }

  el("stat-total").textContent = String(gods.length);
  [...new Set(gods.map(g => g.group).filter(Boolean))].sort((a,b) => a.localeCompare(b)).forEach(value => { const option = document.createElement("option"); option.value = value; option.textContent = value; groupFilter.appendChild(option); });  el("stat-generations").textContent = String(new Set(gods.map(g => g.generation)).size);  [...new Set(gods.map(g => g.generation).filter(v => v !== undefined && v !== null))].sort((a,b) => a-b).forEach(value => {
    const option = document.createElement("option"); option.value = String(value); option.textContent = generationLabel(value); generationFilter.appendChild(option);
  });

  function makeLink(name, className = "relationship-link") {
    const button = text("button", name, className);
    button.type = "button";
    button.disabled = !byName.has(name);
    if (byName.has(name)) button.addEventListener("click", () => selectGod(byName.get(name), true));
    return button;
  }

  function addRelationshipGroup(parent, label, names) {
    const section = document.createElement("section");
    section.className = "relationship-group";
    addText(section, "h4", label);
    const wrap = document.createElement("div"); wrap.className = "relationship-links";
    if (!names.length) wrap.appendChild(text("span", "None recorded", "muted"));
    names.forEach(name => wrap.appendChild(makeLink(name)));
    section.appendChild(wrap); parent.appendChild(section);
  }

  function renderProfile(g) {
    profile.replaceChildren();
    const top = document.createElement("div"); top.className = "profile-top";
    addText(top, "p", "DIVINE DOSSIER", "eyebrow");
    addText(top, "h2", g.name, "profile-name");
    addText(top, "p", "Pantheon number " + g.number, "profile-number");
    if (g.trueName && g.trueName !== g.name) addText(top, "p", "True name: " + g.trueName, "profile-true-name");
    if (g.listedUnderGeneration) addText(top, "p", "Cross-listed at #" + g.number + " in the Generation " + g.listedUnderGeneration + " sequence; this God belongs to Generation " + g.generation + ".", "profile-true-name");
    if (g.relatedGroups && g.relatedGroups.length) addText(top, "p", "Related domains: " + g.relatedGroups.join(" · "), "profile-true-name");
    else if (g.aliases && g.aliases.length) addText(top, "p", "Also known as " + g.aliases.join(" / "), "profile-true-name");
    const tags = document.createElement("div"); tags.className = "profile-tags";
    [generationLabel(g.generation), g.house].filter(Boolean).forEach(v => tags.appendChild(text("span", v, "tag")));
    top.appendChild(tags);
    profile.appendChild(top);

    const identity = document.createElement("div"); identity.className = "profile-facts";
    [["Domain category", g.group || "Not recorded"], ["Parents", parentLine(g)], ["Children", childLine(g)]].forEach(([label,value]) => {
      const item = document.createElement("div"); item.className = "profile-fact";
      addText(item, "span", label, "fact-label"); addText(item, "p", value);
      identity.appendChild(item);
    });
    profile.appendChild(identity);

    const sections = [
      ["Divine role", "role", "role"],
      ["Divine job", "job", "job"],
      ["Function in the world", "function", "function"],
      ["Origin", "origin", "origin"],
      ["Domain powers & authority", "power", "power"],
      ["For Earth", "tale", "tale"],
      ["Recorded wisdom · simulation", "wisdom", "wisdom"],
      ["Founder’s record", "record", "record"]
    ];
    if (g.domainMastery) {
      const mastery = g.domainMastery;
      const section = document.createElement("section"); section.className = "dossier-section domain-mastery";
      addText(section, "h3", "Domain mastery");
      addText(section, "p", mastery.title + " · " + mastery.level, "mastery-level");
      addText(section, "p", "Mastery scope: " + mastery.scope);
      addText(section, "p", mastery.categoryContext, "profile-note");
      addText(section, "h4", "Master capabilities");
      const capabilities = document.createElement("ul"); capabilities.className = "ability-list";
      (mastery.abilities || []).forEach(item => addText(capabilities, "li", item));
      section.appendChild(capabilities);
      addText(section, "h4", "Applications");
      const applications = document.createElement("ul"); applications.className = "ability-list";
      (mastery.applications || []).forEach(item => addText(applications, "li", item));
      section.appendChild(applications);
      addText(section, "h4", "Boundaries of authority");
      addText(section, "p", mastery.boundary);
      profile.appendChild(section);
    }
    if (g.abilities && g.abilities.length) {
      const section = document.createElement("section"); section.className = "dossier-section";
      addText(section, "h3", "Abilities");
      const list = document.createElement("ul"); list.className = "ability-list";
      g.abilities.forEach(ability => addText(list, "li", ability));
      section.appendChild(list); profile.appendChild(section);
    }
    if (g.service) { const section = document.createElement("section"); section.className = "dossier-section"; addText(section, "h3", "Divine service"); addText(section, "p", g.service); profile.appendChild(section); }
    sections.forEach(([heading,key]) => {
      if (!g[key]) return;
      const section = document.createElement("section"); section.className = "dossier-section";
      addText(section, "h3", heading); addText(section, "p", g[key]);
      profile.appendChild(section);
    });
    const relationships = document.createElement("section"); relationships.className = "dossier-section";
    addText(relationships, "h3", "Recorded relationships");
    addRelationshipGroup(relationships, "Parents", listNames(g.parents));
    addRelationshipGroup(relationships, "Children", listNames(g.children));
    profile.appendChild(relationships);
    addText(profile, "p", "Allegiance is not assigned by this interface. Friendship, rivalry, partnership, and allegiance are separate concepts.", "profile-note");
  }

  function renderLineage(g) {
    lineage.replaceChildren();
    const layout = document.createElement("div"); layout.className = "lineage-columns";
    const ancestors = document.createElement("section"); ancestors.className = "lineage-column";
    addText(ancestors, "p", "UPSTREAM", "eyebrow");
    addText(ancestors, "h3", "Recorded parents");
    const parentWrap = document.createElement("div"); parentWrap.className = "lineage-nodes";
    const parents = listNames(g.parents);
    if (!parents.length) parentWrap.appendChild(text("p", "No parent is recorded for this God.", "muted"));
    parents.forEach(name => parentWrap.appendChild(makeLink(name, "lineage-node")));
    ancestors.appendChild(parentWrap);

    const center = document.createElement("section"); center.className = "lineage-column lineage-current";
    addText(center, "p", "SELECTED", "eyebrow");
    addText(center, "h3", g.name);
    addText(center, "p", generationLabel(g.generation), "muted");
    const current = text("span", "✧", "lineage-star"); center.appendChild(current);

    const descendants = document.createElement("section"); descendants.className = "lineage-column";
    addText(descendants, "p", "DOWNSTREAM", "eyebrow");
    addText(descendants, "h3", "Recorded children");
    const childWrap = document.createElement("div"); childWrap.className = "lineage-nodes";
    const children = listNames(g.children);
    if (!children.length) childWrap.appendChild(text("p", "No children are recorded for this God.", "muted"));
    children.forEach(name => childWrap.appendChild(makeLink(name, "lineage-node")));
    descendants.appendChild(childWrap);
    layout.append(ancestors, center, descendants);
    lineage.appendChild(layout);
    const note = text("p", "Relationship links follow the exact parent and child names in gods-data.js. A missing link is shown as unrecorded rather than guessed.", "lineage-footnote");
    lineage.appendChild(note);
  }

  function selectGod(g, scrollProfile) {
    if (!g) return;
    selected = g;
    renderProfile(g);
    renderLineage(g);
    document.querySelectorAll(".god-card-button").forEach(button => {
      const active = button.dataset.god === g.name;
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (scrollProfile && window.matchMedia("(max-width: 900px)").matches) {
      profile.scrollIntoView({behavior:"smooth", block:"start"});
    }
  }

  function cardFor(g) {
    const button = document.createElement("button");
    button.type = "button"; button.className = "god-card-button";
    button.dataset.god = g.name; button.setAttribute("aria-pressed", "false");
    const top = document.createElement("div"); top.className = "god-card-top";
    addText(top, "span", "#" + g.number + " · " + generationLabel(g.generation), "god-generation");
    addText(top, "span", g.house || "House unrecorded", "god-house");
    button.appendChild(top);
    addText(button, "p", g.group || "Category unassigned", "god-card-group");
    addText(button, "h3", g.name, "god-card-name");    addText(button, "p", g.job || g.role || "No role description recorded.", "god-card-role");
    const footer = document.createElement("span"); footer.className = "god-card-footer";
    footer.textContent = "Open divine profile ↗"; button.appendChild(footer);
    button.addEventListener("click", () => selectGod(g, false));
    return button;
  }

  function renderGrid() {
    const q = search.value.trim().toLocaleLowerCase();    const fg = generationFilter.value, fh = houseFilter.value, fc = groupFilter.value;
    const filtered = gods.filter(g => {      if (fg !== "" && String(g.generation) !== fg) return false;
      if (fh && g.house !== fh) return false;
      if (fc && g.group !== fc) return false;
      if (q) {
        const haystack = [g.name,g.trueName,g.role,g.job,g.function,g.group,g.house,g.origin,g.power,g.tale,g.wisdom,...listNames(g.parents),...listNames(g.children)].filter(Boolean).join(" ").toLocaleLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    grid.replaceChildren();
    filtered.forEach(g => grid.appendChild(cardFor(g)));
    el("result-count").textContent = filtered.length + " of " + gods.length + " Gods shown";
    el("no-results").hidden = filtered.length !== 0;
    if (selected && filtered.some(g => g.name === selected.name)) {
      const active = grid.querySelector('[data-god="' + CSS.escape(selected.name) + '"]');
      if (active) { active.classList.add("is-selected"); active.setAttribute("aria-pressed","true"); }
    }
  }

  [search,generationFilter,houseFilter,groupFilter].forEach(control => control.addEventListener(control === search ? "input" : "change", renderGrid));
  el("clear-filters").addEventListener("click", () => {
    search.value = ""; generationFilter.value = ""; houseFilter.value = ""; groupFilter.value = "";
    renderGrid(); search.focus();
  });
  renderGrid();
  selectGod(gods[0], false);
})();