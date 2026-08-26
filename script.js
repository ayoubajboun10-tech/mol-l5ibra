/* =========================================================
   DEMO CONTENT
   ========================================================= */

const demoNews = [
  {
    tag: "FOOTBALL",
    title: "Welcome to MOL L5IBRA",
    text: "Your new home for football stories, wisdom and legends."
  },

  {
    tag: "STORIES",
    title: "The game is more than 90 minutes",
    text: "Discover stories that made football unforgettable."
  },

  {
    tag: "NEWS",
    title: "Your content goes here",
    text: "Use the Admin Panel to publish your own articles."
  }
];


const demoLegends = [
  {
    tag: "LEGEND",
    title: "The Legends",
    text: "Build your own collection of unforgettable players."
  },

  {
    tag: "LEGACY",
    title: "Greatness lasts",
    text: "Add legendary players from the Admin Panel."
  }
];


const demoStore = [
  {
    tag: "STORE",
    title: "MOL L5IBRA T-Shirt",
    text: "Store demo product",
    price: "—"
  },

  {
    tag: "STORE",
    title: "Football Collection",
    text: "Add your products from the Admin Panel.",
    price: "—"
  }
];


/* =========================================================
   CARDS
   ========================================================= */

function cards(items, type) {

  return items.map(x => `

    <article class="card">

      <span class="tag">
        ${x.tag || type}
      </span>

      <h3>
        ${x.title}
      </h3>

      <p>
        ${x.text || ""}
      </p>

      ${
        x.price
          ? `<div class="price">${x.price}</div>`
          : ""
      }

    </article>

  `).join("");
}


/* =========================================================
   RENDER
   ========================================================= */

function render() {

  document.querySelector("#news-grid").innerHTML =
    cards(demoNews, "NEWS");

  document.querySelector("#legends-grid").innerHTML =
    cards(demoLegends, "LEGEND");

  document.querySelector("#store-grid").innerHTML =
    cards(demoStore, "STORE");
}

render();


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn =
  document.querySelector("#menuBtn");

const mobileMenu =
  document.querySelector("#mobileMenu");

if (menuBtn && mobileMenu) {

  menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

    if (mobileMenu.classList.contains("active")) {

      menuBtn.textContent = "✕";

    } else {

      menuBtn.textContent = "☰";

    }

  });


  mobileMenu
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        menuBtn.textContent = "☰";

      });

    });

}


/* =========================================================
   PROFILE DRAWER
   ========================================================= */

const profileBtn =
  document.querySelector("#profileBtn");

const profileDrawer =
  document.querySelector("#profileDrawer");

const profileOverlay =
  document.querySelector("#profileOverlay");

const profileClose =
  document.querySelector("#profileClose");


function openProfile() {

  profileDrawer.classList.add("active");

  profileOverlay.classList.add("active");

  profileDrawer.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";
}


function closeProfile() {

  profileDrawer.classList.remove("active");

  profileOverlay.classList.remove("active");

  profileDrawer.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";
}


if (profileBtn) {

  profileBtn.addEventListener(
    "click",
    openProfile
  );

}


if (profileClose) {

  profileClose.addEventListener(
    "click",
    closeProfile
  );

}


if (profileOverlay) {

  profileOverlay.addEventListener(
    "click",
    closeProfile
  );

}


/* ESC TO CLOSE */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeProfile();

    }

  }
);


/* =========================================================
   CHANGE INFORMATION
   ========================================================= */

const changeInfo =
  document.querySelector("#changeInfo");

const editForm =
  document.querySelector("#editForm");

if (changeInfo && editForm) {

  changeInfo.addEventListener(
    "click",
    () => {

      editForm.classList.toggle("active");

    }
  );

}


/* =========================================================
   PROFILE DATA
   ========================================================= */

const nameInput =
  document.querySelector("#nameInput");

const emailInput =
  document.querySelector("#emailInput");

const profileName =
  document.querySelector("#profileName");

const saveProfile =
  document.querySelector("#saveProfile");


/* Load saved name */

const savedName =
  localStorage.getItem("molClientName");

const savedEmail =
  localStorage.getItem("molClientEmail");


if (savedName) {

  profileName.textContent =
    savedName;

  nameInput.value =
    savedName;
}


if (savedEmail) {

  emailInput.value =
    savedEmail;
}


/* Save information */

if (saveProfile) {

  saveProfile.addEventListener(
    "click",
    () => {

      const newName =
        nameInput.value.trim();

      const newEmail =
        emailInput.value.trim();


      if (newName) {

        localStorage.setItem(
          "molClientName",
          newName
        );

        profileName.textContent =
          newName;

      }


      if (newEmail) {

        localStorage.setItem(
          "molClientEmail",
          newEmail
        );

      }


      editForm.classList.remove(
        "active"
      );

    }
  );

}


/* =========================================================
   PROFILE PHOTO
   ========================================================= */

const changePhoto =
  document.querySelector("#changePhoto");

const photoInput =
  document.querySelector("#photoInput");

const profileAvatar =
  document.querySelector("#profileAvatar");


if (changePhoto && photoInput) {

  changePhoto.addEventListener(
    "click",
    () => {

      photoInput.click();

    }
  );

}


if (photoInput) {

  photoInput.addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      if (!file) return;


      const reader =
        new FileReader();


      reader.onload = function(e) {

        profileAvatar.innerHTML = `
          <img
            src="${e.target.result}"
            alt="Profile picture">
        `;

        localStorage.setItem(
          "molClientPhoto",
          e.target.result
        );

      };


      reader.readAsDataURL(file);

    }
  );

}


/* Load saved photo */

const savedPhoto =
  localStorage.getItem("molClientPhoto");


if (savedPhoto) {

  profileAvatar.innerHTML = `
    <img
      src="${savedPhoto}"
      alt="Profile picture">
  `;

}


/* =========================================================
   SUPABASE
   ========================================================= */

async function loadSupabase() {

  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY
  ) {
    return;
  }

  try {

    const { createClient } =
      await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
      );


    const supabase =
      createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      );


    const { data, error } =
      await supabase
        .from("content")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.log(
        "Supabase error:",
        error
      );

      return;
    }


    if (data?.length) {

      const news =
        data.filter(
          x => x.type === "news"
        );

      const legends =
        data.filter(
          x => x.type === "legend"
        );

      const store =
        data.filter(
          x => x.type === "product"
        );


      if (news.length) {

        document.querySelector(
          "#news-grid"
        ).innerHTML =
          cards(news, "NEWS");

      }


      if (legends.length) {

        document.querySelector(
          "#legends-grid"
        ).innerHTML =
          cards(legends, "LEGEND");

      }


      if (store.length) {

        document.querySelector(
          "#store-grid"
        ).innerHTML =
          cards(store, "STORE");

      }

    }

  } catch (e) {

    console.log(
      "Supabase not configured yet.",
      e
    );

  }

}

loadSupabase();
