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

        /* IMAGE */
        if (item.type === "image") {
          div.innerHTML = `<img src="${item.src}" loading="lazy">`;
        }

        /* YOUTUBE */
        if (item.type === "youtube") {
          div.innerHTML = `
            <img src="${item.thumb}" loading="lazy">
            <span class="play-badge">▶</span>
          `;
        }

        div.addEventListener("click", () => openModal(item));
        gallery.appendChild(div);
      });

      /* INIT FILTER AFTER ITEMS EXIST */
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

        /* ACTIVE STATE */
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        const items = document.querySelectorAll(".gallery .item");

        items.forEach(item => {
          if (filter === "all" || item.classList.contains(filter)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });

      });
    });
  }

  /* OPEN MODAL */
  function openModal(item) {
    modal.classList.add("active");

    /* IMAGE */
    if (item.type === "image") {
      modalContent.innerHTML = `<img src="${item.src}">`;
    }

    /* YOUTUBE */
    if (item.type === "youtube") {
      const isShort = item.isShort === true;

      modalContent.innerHTML = `
        <div class="video-wrapper ${isShort ? "portrait" : "landscape"}">
          <iframe
            src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
        </div>
      `;
    }
  }

  /* CLOSE MODAL */
  function closeModal() {
    modal.classList.remove("active");
    modalContent.innerHTML = ""; // stop video
  }

  /* CLICK EVENTS */
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  /* ESC KEY */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

});
