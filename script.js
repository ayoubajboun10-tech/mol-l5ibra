/* =========================================================
   MOL L5IBRA
   SCRIPT
   ========================================================= */


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

    menuBtn.textContent =
      mobileMenu.classList.contains("active")
        ? "✕"
        : "☰";

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


profileBtn.addEventListener(
  "click",
  openProfile
);


profileClose.addEventListener(
  "click",
  closeProfile
);


profileOverlay.addEventListener(
  "click",
  closeProfile
);


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeProfile();

    }

  }
);


/* =========================================================
   AUTH ELEMENTS
   ========================================================= */

const authView =
  document.querySelector("#authView");

const accountView =
  document.querySelector("#accountView");

const loginForm =
  document.querySelector("#loginForm");

const signupForm =
  document.querySelector("#signupForm");

const authMessage =
  document.querySelector("#authMessage");


/* =========================================================
   SWITCH LOGIN / SIGNUP
   ========================================================= */

document
  .querySelector("#showSignup")
  .addEventListener("click", () => {

    loginForm.classList.add("hidden");

    signupForm.classList.remove("hidden");

    authMessage.textContent = "";

  });


document
  .querySelector("#showLogin")
  .addEventListener("click", () => {

    signupForm.classList.add("hidden");

    loginForm.classList.remove("hidden");

    authMessage.textContent = "";

  });


/* =========================================================
   SUPABASE
   ========================================================= */

let supabaseClient = null;


async function initSupabase() {

  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY
  ) {

    showAuthMessage(
      "Supabase configuration is missing."
    );

    return false;
  }


  try {

    const { createClient } =
      await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
      );


    supabaseClient =
      createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      );


    return true;

  } catch (error) {

    console.error(error);

    showAuthMessage(
      "Could not connect to Supabase."
    );

    return false;
  }

}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message) {

  authMessage.textContent = message;
}


/* =========================================================
   SIGN UP
   ========================================================= */

document
  .querySelector("#signupBtn")
  .addEventListener("click", async () => {

    if (!supabaseClient) return;


    const name =
      document
        .querySelector("#signupName")
        .value
        .trim();


    const email =
      document
        .querySelector("#signupEmail")
        .value
        .trim();


    const password =
      document
        .querySelector("#signupPassword")
        .value;


    if (!name || !email || !password) {

      showAuthMessage(
        "Please fill in all fields."
      );

      return;
    }


    if (password.length < 6) {

      showAuthMessage(
        "Password must be at least 6 characters."
      );

      return;
    }


    showAuthMessage(
      "Creating your account..."
    );


    try {

      const { data, error } =
        await supabaseClient.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {
              full_name: name
            }

          }

        });


      if (error) {

        showAuthMessage(
          error.message
        );

        return;
      }


      if (data.session) {

        showAuthMessage(
          "Account created successfully!"
        );

        await loadCurrentUser();

      } else {

        showAuthMessage(
          "Account created. Check your email to confirm your account."
        );

      }

    } catch (error) {

      console.error(error);

      showAuthMessage(
        "Something went wrong."
      );

    }

  });


/* =========================================================
   LOGIN
   ========================================================= */

document
  .querySelector("#loginBtn")
  .addEventListener("click", async () => {

    if (!supabaseClient) return;


    const email =
      document
        .querySelector("#loginEmail")
        .value
        .trim();


    const password =
      document
        .querySelector("#loginPassword")
        .value;


    if (!email || !password) {

      showAuthMessage(
        "Enter your email and password."
      );

      return;
    }


    showAuthMessage(
      "Logging in..."
    );


    try {

      const { error } =
        await supabaseClient.auth.signInWithPassword({

          email: email,

          password: password

        });


      if (error) {

        showAuthMessage(
          error.message
        );

        return;
      }


      showAuthMessage(
        "Login successful!"
      );


      await loadCurrentUser();

    } catch (error) {

      console.error(error);

      showAuthMessage(
        "Something went wrong."
      );

    }

  });


/* =========================================================
   LOAD CURRENT USER
   ========================================================= */

async function loadCurrentUser() {

  if (!supabaseClient) return;


  const {
    data: {
      user
    }
  } =
    await supabaseClient.auth.getUser();


  if (user) {

    showAccount(user);

  } else {

    showAuth();

  }

}


/* =========================================================
   SHOW AUTH
   ========================================================= */

function showAuth() {

  authView.classList.remove("hidden");

  accountView.classList.add("hidden");

}


/* =========================================================
   SHOW ACCOUNT
   ========================================================= */

function showAccount(user) {

  authView.classList.add("hidden");

  accountView.classList.remove("hidden");


  const name =
    user.user_metadata?.full_name ||
    "MOL L5IBRA Client";


  document.querySelector(
    "#profileName"
  ).textContent = name;


  document.querySelector(
    "#profileEmail"
  ).textContent =
    user.email || "—";


  document.querySelector(
    "#nameInput"
  ).value = name;


  loadProfilePhoto();

}


/* =========================================================
   CHANGE INFORMATION
   ========================================================= */

document
  .querySelector("#changeInfo")
  .addEventListener("click", () => {

    document
      .querySelector("#editForm")
      .classList.toggle("active");

  });


/* =========================================================
   SAVE PROFILE
   ========================================================= */

document
  .querySelector("#saveProfile")
  .addEventListener("click", async () => {

    if (!supabaseClient) return;


    const newName =
      document
        .querySelector("#nameInput")
        .value
        .trim();


    if (!newName) {

      return;
    }


    const {
      error
    } =
      await supabaseClient.auth.updateUser({

        data: {
          full_name: newName
        }

      });


    if (error) {

      alert(error.message);

      return;
    }


    document.querySelector(
      "#profileName"
    ).textContent = newName;


    document
      .querySelector("#editForm")
      .classList.remove("active");

  });


/* =========================================================
   LOGOUT
   ========================================================= */

document
  .querySelector("#logoutBtn")
  .addEventListener("click", async () => {

    if (!supabaseClient) return;


    const {
      error
    } =
      await supabaseClient.auth.signOut();


    if (error) {

      alert(error.message);

      return;
    }


    showAuth();

    closeProfile();

  });


/* =========================================================
   PROFILE PHOTO
   ========================================================= */

const changePhoto =
  document.querySelector("#changePhoto");

const photoInput =
  document.querySelector("#photoInput");

const profileAvatar =
  document.querySelector("#profileAvatar");


changePhoto.addEventListener(
  "click",
  () => {

    photoInput.click();

  }
);


photoInput.addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];


    if (!file) return;


    if (!file.type.startsWith("image/")) {

      alert("Please choose an image.");

      return;
    }


    const reader =
      new FileReader();


    reader.onload = function(e) {

      profileAvatar.innerHTML = `

        <img
          src="${e.target.result}"
          alt="Profile picture">

      `;


      localStorage.setItem(
        "molProfilePhoto",
        e.target.result
      );

    };


    reader.readAsDataURL(file);

  }
);


/* =========================================================
   LOAD PHOTO
   ========================================================= */

function loadProfilePhoto() {

  const photo =
    localStorage.getItem(
      "molProfilePhoto"
    );


  if (photo) {

    profileAvatar.innerHTML = `

      <img
        src="${photo}"
        alt="Profile picture">

    `;

  }

}


/* =========================================================
   CONTENT FROM SUPABASE
   ========================================================= */

async function loadContent() {

  if (!supabaseClient) return;


  try {

    const {
      data,
      error
    } =
      await supabaseClient
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
        "Content error:",
        error
      );

      return;
    }


    if (!data || !data.length) return;


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

  } catch (error) {

    console.log(
      "Could not load content.",
      error
    );

  }

}


/* =========================================================
   START
   ========================================================= */

async function startApp() {

  const ready =
    await initSupabase();


  if (!ready) return;


  await loadCurrentUser();

  await loadContent();


  /* Listen for login/logout changes */

  supabaseClient.auth.onAuthStateChange(
    (_event, session) => {

      if (session?.user) {

        showAccount(session.user);

      } else {

        showAuth();

      }

    }
  );

}


startApp();
