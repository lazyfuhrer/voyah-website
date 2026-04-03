window.addEventListener("load", function () {
  document.querySelectorAll("footer *").forEach(el => {
    const text = el.innerText?.trim().toLowerCase();

    // Match English + Arabic
    if (text === "policies" || text === "سياسات") {
      const section = el.closest("div"); // only remove immediate parent
      if (section) section.remove();
    }
  });
});