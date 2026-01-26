document.addEventListener("DOMContentLoaded", () => {

  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.querySelector(".close");

  // AUTO LOAD JSON
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        const div = document.createElement("div");
        div.className = `item ${item.category}`;

        if(item.type === "image" || item.type === "pdf" || item.type === "link"){
          div.innerHTML = `<img src="${item.src}" loading="lazy">`;
        } 
        else if(item.type === "video"){
          div.innerHTML = `<video src="${item.src}" controls></video>`;
        }

        div.addEventListener("click", ()=>{
          if(item.type === "pdf"){
            window.open(item.file, "_blank");
          }
          else if(item.type === "link"){
            window.open(item.url, "_blank");
          }
          else {
            openModal(item);
          }
        });

        gallery.appendChild(div);
      });
    })
    .catch(err=>{
      gallery.innerHTML = "<p style='color:red'>Gagal load data.json</p>";
      console.error(err);
    });

  // FILTER
  document.querySelectorAll(".filters button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".filters button")
        .forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      const f = btn.dataset.filter;
      document.querySelectorAll(".item").forEach(item=>{
        item.style.display =
          f === "all" || item.classList.contains(f)
          ? "block" : "none";
      });
    });
  });

  // MODAL
  function openModal(item){
    modal.classList.add("active");
    if(item.type === "image"){
      modalContent.innerHTML = `<img src="${item.src}">`;
    } 
    else if(item.type === "video"){
      modalContent.innerHTML =
        `<video src="${item.src}" controls autoplay></video>`;
    }
  }

  closeBtn.addEventListener("click", ()=>{
    modal.classList.remove("active");
    modalContent.innerHTML = "";
  });

  modal.addEventListener("click", e=>{
    if(e.target === modal){
      modal.classList.remove("active");
      modalContent.innerHTML = "";
    }
  });

});
