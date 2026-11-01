(function () {
  const main = document.getElementById("main");
  let catalog = null;
  const ui = { productId: "", imageIndex: 0, size: "", color: "" };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function parseRoute() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const parts = raw.split("/").filter(Boolean);
    if (parts[0] === "product" && parts[1]) {
      return { name: "product", id: decodeURIComponent(parts[1]) };
    }
    if (parts[0] === "category" && parts[1]) {
      return { name: "category", id: decodeURIComponent(parts[1]) };
    }
    if (parts[0] === "shop") return { name: "shop" };
    return { name: "home" };
  }

  function brand() {
    return (catalog && catalog.brand) || {};
  }

  function waNumber() {
    const digits = String(brand().whatsapp || "917012884854").replace(/\D/g, "");
    return digits || "917012884854";
  }

  function waLink(message) {
    return "https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(message);
  }

  function generalMessage() {
    return "Hello Luxe Nour,\n\nI would like to enquire about your designer pieces.";
  }

  function productUrl(id) {
    const url = new URL(window.location.href);
    url.search = "";
    if (url.pathname.endsWith("/index.html")) {
      url.pathname = url.pathname.slice(0, -"index.html".length);
    }
    url.hash = "/product/" + encodeURIComponent(id);
    return url.toString();
  }

  function formatPrice(amount, currency) {
    const code = currency || "INR";
    const value = Number(amount);
    if (!Number.isFinite(value)) return "";
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: code,
        maximumFractionDigits: 0
      }).format(value);
    } catch (err) {
      return code + " " + value;
    }
  }

  function categoryById(id) {
    return (catalog.categories || []).find(function (category) {
      return category.id === id;
    });
  }

  function categoryName(id) {
    const category = categoryById(id);
    return category ? category.name : id;
  }

  function enquiryMessage(product, size, color) {
    return [
      "Hello Luxe Nour,",
      "",
      "I would like to enquire about this piece:",
      "",
      "Name: " + product.name,
      "Code: " + product.id,
      "Category: " + categoryName(product.category),
      "Price: " + formatPrice(product.price, product.currency),
      "Size: " + (size || "not selected"),
      "Colour: " + (color || "not selected"),
      "Availability: " + (product.available ? "available" : "currently unavailable"),
      "Link: " + productUrl(product.id)
    ].join("\n");
  }

  function wireGeneralWhatsApp() {
    const href = waLink(generalMessage());
    document.querySelectorAll("[data-wa='general']").forEach(function (link) {
      link.href = href;
    });
  }

  function setTitle(page) {
    document.title = page ? page + " · Luxe Nour by Nihla" : "Luxe Nour by Nihla";
  }

  function markNav(route) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      const onShop = route.name === "shop" || route.name === "category";
      if (link.dataset.nav === "shop" && onShop) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function productCard(product) {
    const image = (product.images && product.images[0]) || "";
    const href = "#/product/" + encodeURIComponent(product.id);
    const enquire = waLink(enquiryMessage(product, "", ""));
    const badge = product.available ? "" : '<p class="badge">Currently reserved</p>';
    return (
      '<article class="card">' +
        '<a class="card-media" href="' + href + '">' +
          '<img src="' + esc(image) + '" alt="' + esc(product.name) + '" loading="lazy">' +
        "</a>" +
        '<h3><a href="' + href + '">' + esc(product.name) + "</a></h3>" +
        '<p class="meta">' + esc(categoryName(product.category)) + " · " + esc(product.id) + "</p>" +
        '<p class="price">' + esc(formatPrice(product.price, product.currency)) + "</p>" +
        badge +
        '<div class="card-actions">' +
          '<a class="text-link" href="' + href + '">View</a>' +
          '<a class="text-link" href="' + esc(enquire) + '" target="_blank" rel="noopener noreferrer">Enquire</a>' +
        "</div>" +
      "</article>"
    );
  }

  function categoryTiles() {
    return (catalog.categories || []).map(function (category) {
      return (
        '<a class="cat-card" href="#/category/' + encodeURIComponent(category.id) + '">' +
          '<img src="' + esc(category.image) + '" alt="">' +
          "<span>" + esc(category.name) + "</span>" +
        "</a>"
      );
    }).join("");
  }

  function filters(activeId) {
    const allCurrent = activeId ? "" : ' aria-current="page"';
    const chips = (catalog.categories || []).map(function (category) {
      const current = category.id === activeId ? ' aria-current="page"' : "";
      return '<a href="#/category/' + encodeURIComponent(category.id) + '"' + current + ">" + esc(category.name) + "</a>";
    }).join("");
    return '<div class="filters" role="navigation" aria-label="Categories"><a href="#/shop"' + allCurrent + ">All</a>" + chips + "</div>";
  }

  function listing(title, eyebrow, intro, products, activeId) {
    const grid = products.length
      ? '<div class="product-grid">' + products.map(productCard).join("") + "</div>"
      : '<p class="empty">Nothing is listed in this collection yet. Add a product to data/catalog.json, or enquire and the studio can suggest a piece.</p>';
    return (
      '<div class="wrap page-title">' +
        '<p class="eyebrow">' + esc(eyebrow) + "</p>" +
        "<h1>" + esc(title) + "</h1>" +
        (intro ? '<p class="intro">' + esc(intro) + "</p>" : "") +
        filters(activeId) +
        grid +
      "</div>" +
      studioBand()
    );
  }

  function studioBand() {
    return (
      '<section class="band">' +
        '<div class="band-inner">' +
          "<h2>Made for you</h2>" +
          "<p>Sleeve, length, and neckline can be adjusted. Send your measurements on WhatsApp after you enquire, and the studio will confirm the making time.</p>" +
          '<a class="btn btn-ghost" data-wa="general" href="' + esc(waLink(generalMessage())) + '" target="_blank" rel="noopener noreferrer">WhatsApp the studio</a>' +
        "</div>" +
      "</section>"
    );
  }

  function renderHome() {
    setTitle("");
    const featured = (catalog.products || []).filter(function (product) { return product.featured; });
    const picks = featured.length ? featured : (catalog.products || []).slice(0, 4);
    main.innerHTML =
      '<section class="hero">' +
        '<p class="eyebrow">Designer modest wear</p>' +
        '<img class="hero-logo" src="images/logo.png" alt="House of Luxenour. Elegance redefined — where beauty meets tradition.">' +
        "<h1>Luxe Nour <span>by Nihla</span></h1>" +
        '<p class="lede">' + esc(brand().tagline || "Elegance redefined — where beauty meets tradition") + "</p>" +
        '<p class="sub">Custom outfits and hand bead embroidery, made to order.</p>' +
        '<div class="hero-actions">' +
          '<a class="btn btn-gold" href="#/shop">Shop the edit</a>' +
          '<a class="btn btn-ghost" data-wa="general" href="' + esc(waLink(generalMessage())) + '" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a>' +
        "</div>" +
      "</section>" +
      '<section class="section wrap">' +
        '<div class="section-head">' +
          '<p class="eyebrow">Collections</p>' +
          "<h2>Choose a silhouette</h2>" +
        "</div>" +
        '<div class="cat-grid">' + categoryTiles() + "</div>" +
      "</section>" +
      '<section class="section wrap">' +
        '<div class="section-head">' +
          '<p class="eyebrow">Featured</p>' +
          "<h2>The edit</h2>" +
          '<p><a class="text-link" href="#/shop">View the full edit</a></p>' +
        "</div>" +
        '<div class="product-grid">' + picks.map(productCard).join("") + "</div>" +
      "</section>" +
      studioBand();
  }

  function renderShop() {
    setTitle("Shop");
    main.innerHTML = listing(
      "The edit",
      "Shop",
      "Kaftans, modal silk, lawn suits, and bead embroidery. Every piece can be made in your measurements.",
      catalog.products || [],
      ""
    );
  }

  function renderCategory(id) {
    const category = categoryById(id);
    if (!category) {
      setTitle("Collection");
      main.innerHTML = listing("This collection is not listed", "Collections", "", [], id);
      return;
    }
    setTitle(category.name);
    const products = (catalog.products || []).filter(function (product) {
      return product.category === id;
    });
    main.innerHTML = listing(category.name, "Collection", "", products, id);
  }

  function choiceRow(items, selected, attr) {
    return (items || []).map(function (item) {
      const on = item === selected;
      return '<button type="button" class="chip' + (on ? " is-selected" : "") + '" ' + attr + '="' + esc(item) + '" aria-pressed="' + on + '">' + esc(item) + "</button>";
    }).join("");
  }

  function renderProduct(id) {
    const product = (catalog.products || []).find(function (item) { return item.id === id; });
    if (!product) {
      setTitle("Piece");
      main.innerHTML =
        '<div class="wrap page-title">' +
          '<p class="eyebrow">Piece</p>' +
          "<h1>This piece is not listed</h1>" +
          '<p class="intro">It may have been removed from the catalogue. Browse the edit, or send a note on WhatsApp.</p>' +
          '<p><a class="text-link" href="#/shop">Back to the edit</a></p>' +
        "</div>";
      return;
    }

    if (ui.productId !== product.id) {
      ui.productId = product.id;
      ui.imageIndex = 0;
      ui.size = "";
      ui.color = "";
    }

    const images = product.images && product.images.length ? product.images : [];
    const index = images.length ? ((ui.imageIndex % images.length) + images.length) % images.length : 0;
    ui.imageIndex = index;
    const enquire = waLink(enquiryMessage(product, ui.size, ui.color));
    const nav = images.length > 1
      ? '<button type="button" class="gal-nav prev" data-dir="-1" aria-label="Previous image">‹</button>' +
        '<button type="button" class="gal-nav next" data-dir="1" aria-label="Next image">›</button>'
      : "";
    const thumbs = images.map(function (src, i) {
      return '<button type="button" class="thumb' + (i === index ? " is-selected" : "") + '" data-image="' + i + '" aria-label="Image ' + (i + 1) + ' of ' + images.length + '">' +
        '<img src="' + esc(src) + '" alt="">' +
      "</button>";
    }).join("");
    const stage = images.length
      ? '<img src="' + esc(images[index]) + '" alt="' + esc(product.name) + ', view ' + (index + 1) + ' of ' + images.length + '">'
      : "";
    const status = product.available
      ? ""
      : '<p class="badge">Currently reserved — enquire to commission the next one</p>';

    setTitle(product.name);
    main.innerHTML =
      '<div class="wrap page-title product-layout">' +
        "<div>" +
          '<p class="crumbs"><a href="#/">Home</a> <span aria-hidden="true">/</span> <a href="#/category/' + encodeURIComponent(product.category) + '">' + esc(categoryName(product.category)) + '</a> <span aria-hidden="true">/</span> <span>' + esc(product.name) + '</span></p>' +
          '<div class="gallery">' +
            '<div class="gallery-stage">' + stage + nav + "</div>" +
            '<div class="thumbs">' + thumbs + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="product-buy product-copy">' +
          '<p class="code">' + esc(product.id) + "</p>" +
          "<h1>" + esc(product.name) + "</h1>" +
          '<p class="meta">' + esc(categoryName(product.category)) + "</p>" +
          '<p class="price">' + esc(formatPrice(product.price, product.currency)) + "</p>" +
          status +
          '<p class="description">' + esc(product.description) + "</p>" +
          '<div class="choice"><p>Size</p><div class="choice-row">' + choiceRow(product.sizes, ui.size, "data-size") + "</div></div>" +
          '<div class="choice"><p>Colour</p><div class="choice-row">' + choiceRow(product.colors, ui.color, "data-color") + "</div></div>" +
          '<a class="btn btn-gold btn-block" data-enquire="product" href="' + esc(enquire) + '" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a>' +
          '<p class="note">The message includes the name, code, category, price, any size or colour you select, and a link back to this piece.</p>' +
        "</div>" +
      "</div>";
  }

  function render() {
    const route = parseRoute();
    markNav(route);
    if (route.name === "product") renderProduct(route.id);
    else if (route.name === "category") renderCategory(route.id);
    else if (route.name === "shop") renderShop();
    else renderHome();
  }

  main.addEventListener("click", function (event) {
    const sizeBtn = event.target.closest("[data-size]");
    const colorBtn = event.target.closest("[data-color]");
    const thumb = event.target.closest("[data-image]");
    const dir = event.target.closest("[data-dir]");
    if (!sizeBtn && !colorBtn && !thumb && !dir) return;
    if (sizeBtn) ui.size = ui.size === sizeBtn.dataset.size ? "" : sizeBtn.dataset.size;
    if (colorBtn) ui.color = ui.color === colorBtn.dataset.color ? "" : colorBtn.dataset.color;
    if (thumb) ui.imageIndex = Number(thumb.dataset.image) || 0;
    if (dir) ui.imageIndex += Number(dir.dataset.dir) || 0;
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  });

  function showError() {
    main.innerHTML = '<p class="empty">The catalogue could not be loaded. Serve this folder with a local web server so data/catalog.json can be read, then refresh.</p>';
  }

  async function init() {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
    try {
      const response = await fetch("data/catalog.json");
      if (!response.ok) throw new Error("Catalogue request failed");
      catalog = await response.json();
    } catch (err) {
      showError();
      return;
    }
    wireGeneralWhatsApp();
    window.addEventListener("hashchange", function () {
      render();
      window.scrollTo(0, 0);
    });
    render();
  }

  init();
})();
