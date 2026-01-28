document.addEventListener("DOMContentLoaded", () => {

  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.querySelector(".close");
  const filterButtons = document.querySelectorAll(".filters button");

  /* LOAD DATA */
  fetch("data.json")
    .then(res => {
      if (!res.ok) throw new Error("Gagal load data.json");
      return res.json();
    })
    .then(data => {
      data.forEach(item => {
        const div = document.createElement("div");
        div.className = `item ${item.category}`;

        /* THUMBNAIL (IMAGE / PDF / LINK) */
        if (item.type === "image" || item.type === "pdf" || item.type === "link") {
          div.innerHTML = `
            <img 
              src="${item.src}" 
              loading="lazy"
              onerror="this.onerror=null"
            >
          `;
        }

        /* YOUTUBE */
        if (item.type === "youtube") {
          div.innerHTML = `
            <img src="${item.thumb}" loading="lazy">
            <span class="play-badge">▶</span>
          `;
        }

        div.addEventListener("click", () => openItem(item));
        gallery.appendChild(div);
      });

      initFilter();
    })
    .catch(err => {
      console.error(err);
      gallery.innerHTML = `
        <p style="color:#ff7a7a;text-align:center;padding:40px">
          Gagal memuat data gallery
        </p>
      `;
    });

  /* FILTER LOGIC */
  function initFilter() {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        document.querySelectorAll(".gallery .item").forEach(item => {
          item.style.display =
            filter === "all" || item.classList.contains(filter)
              ? "block"
              : "none";
        });
      });
    });
  }

  /* ITEM ACTION HANDLER */
  function openItem(item) {

    /* IMAGE */
    if (item.type === "image") {
      modal.classList.add("active");
      modalContent.innerHTML = `<img src="${item.src}">`;
      return;
    }

    /* YOUTUBE */
    if (item.type === "youtube") {
      modal.classList.add("active");
      modalContent.innerHTML = `
        <div class="video-wrapper ${item.isShort ? "portrait" : "landscape"}">
          <iframe
            src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
        </div>
      `;
      return;
    }

    /* PDF */
    if (item.type === "pdf" && item.file) {
      window.open(item.file, "_blank");
      return;
    }

    /* EXTERNAL LINK (SOSMED) */
    if (item.type === "link" && item.url) {
      window.open(item.url, "_blank");
      return;
    }
  }

  /* CLOSE MODAL */
  function closeModal() {
    modal.classList.remove("active");
    modalContent.innerHTML = "";
  }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

});
