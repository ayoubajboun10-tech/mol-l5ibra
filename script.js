/* =====================================================
   MOL L5IBRA - MAIN SCRIPT
===================================================== */

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


/* =====================================================
   CARDS
===================================================== */

function cards(items, type) {

  return items.map(x => `
    <article class="card">

      <span class="tag">
        ${x.tag || type}
      </span>

      <h3>
        ${escapeHTML(x.title || "")}
      </h3>

      <p>
        ${escapeHTML(x.text || "")}
      </p>

      ${
        x.price
          ? `<div class="price">${escapeHTML(x.price)}</div>`
          : ""
      }

    </article>
  `).join("");
}


/* =====================================================
   SECURITY - HTML ESCAPE
===================================================== */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =====================================================
   DEMO CONTENT
===================================================== */

function render() {

  const newsGrid = document.querySelector("#news-grid");
  const legendsGrid = document.querySelector("#legends-grid");
  const storeGrid = document.querySelector("#store-grid");

  if (newsGrid) {
    newsGrid.innerHTML = cards(demoNews, "NEWS");
  }

  if (legendsGrid) {
    legendsGrid.innerHTML = cards(demoLegends, "LEGEND");
  }

  if (storeGrid) {
    storeGrid.innerHTML = cards(demoStore, "STORE");
  }
}

render();


/* =====================================================
   SUPABASE
===================================================== */

let supabaseClient = null;

async function initSupabase() {

  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY
  ) {
    console.log("Supabase configuration missing.");
    return null;
  }

  try {

    const { createClient } =
      await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
      );

    supabaseClient = createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    return supabaseClient;

  } catch (error) {

    console.error(
      "Supabase initialization error:",
      error
    );

    return null;
  }
}


/* =====================================================
   LOAD WEBSITE CONTENT
===================================================== */

async function loadSupabaseContent() {

  const supabase = await initSupabase();

  if (!supabase) return;

  try {

    const { data, error } = await supabase
      .from("content")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    if (error) {

      console.log(
        "Content table error:",
        error.message
      );

      return;
    }

    if (!data || !data.length) return;

    const news = data.filter(
      x => x.type === "news"
    );

    const legends = data.filter(
      x => x.type === "legend"
    );

    const store = data.filter(
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
      "Supabase content error:",
      error
    );
  }
}


/* =====================================================
   PROFILE ELEMENTS
===================================================== */

const profileBtn =
  document.querySelector("#profileBtn");

const profileSidebar =
  document.querySelector("#profileSidebar");

const profileOverlay =
  document.querySelector("#profileOverlay");

const closeProfile =
  document.querySelector("#closeProfile");


/* =====================================================
   PROFILE SIDEBAR
===================================================== */

function openProfile() {

  if (!profileSidebar) return;

  profileSidebar.classList.add("active");

  if (profileOverlay) {
    profileOverlay.classList.add("active");
  }

  document.body.style.overflow = "hidden";
}


function closeProfileSidebar() {

  if (!profileSidebar) return;

  profileSidebar.classList.remove("active");

  if (profileOverlay) {
    profileOverlay.classList.remove("active");
  }

  document.body.style.overflow = "";
}


if (profileBtn) {

  profileBtn.addEventListener(
    "click",
    openProfile
  );
}


if (closeProfile) {

  closeProfile.addEventListener(
    "click",
    closeProfileSidebar
  );
}


if (profileOverlay) {

  profileOverlay.addEventListener(
    "click",
    closeProfileSidebar
  );
}


/* =====================================================
   LOGIN ELEMENTS
===================================================== */

const loginOverlay =
  document.querySelector("#loginOverlay");

const loginStep1 =
  document.querySelector("#loginStep1");

const loginStep2 =
  document.querySelector("#loginStep2");

const loginName =
  document.querySelector("#loginName");

const loginEmail =
  document.querySelector("#loginEmail");

const loginCode =
  document.querySelector("#loginCode");

const sendCodeBtn =
  document.querySelector("#sendCodeBtn");

const verifyCodeBtn =
  document.querySelector("#verifyCodeBtn");

const backLoginBtn =
  document.querySelector("#backLoginBtn");

const loginMessage =
  document.querySelector("#loginMessage");

const verifyMessage =
  document.querySelector("#verifyMessage");


/* =====================================================
   PROFILE ELEMENTS
===================================================== */

const profileAvatar =
  document.querySelector("#profileAvatar");

const defaultAvatar =
  document.querySelector("#defaultAvatar");

const profileName =
  document.querySelector("#profileName");

const profileEmail =
  document.querySelector("#profileEmail");

const infoName =
  document.querySelector("#infoName");

const infoEmail =
  document.querySelector("#infoEmail");

const editProfileBtn =
  document.querySelector("#editProfileBtn");

const editProfileBox =
  document.querySelector("#editProfileBox");

const newName =
  document.querySelector("#newName");

const avatarInput =
  document.querySelector("#avatarInput");

const saveProfileBtn =
  document.querySelector("#saveProfileBtn");

const profileMessage =
  document.querySelector("#profileMessage");

const logoutBtn =
  document.querySelector("#logoutBtn");


/* =====================================================
   LOGIN STATE
===================================================== */

let pendingEmail = "";
let pendingName = "";


/* =====================================================
   MESSAGE HELPERS
===================================================== */

function showLoginMessage(message) {

  if (loginMessage) {
    loginMessage.textContent = message;
  }
}


function showVerifyMessage(message) {

  if (verifyMessage) {
    verifyMessage.textContent = message;
  }
}


function showProfileMessage(message) {

  if (profileMessage) {
    profileMessage.textContent = message;
  }
}


/* =====================================================
   SHOW / HIDE LOGIN
===================================================== */

function showLogin() {

  if (!loginOverlay) return;

  loginOverlay.classList.remove("hidden");

  document.body.style.overflow = "hidden";
}


function hideLogin() {

  if (!loginOverlay) return;

  loginOverlay.classList.add("hidden");

  document.body.style.overflow = "";
}


/* =====================================================
   SEND EMAIL CODE
===================================================== */

async function sendLoginCode() {

  if (!supabaseClient) {

    await initSupabase();
  }

  if (!supabaseClient) {

    showLoginMessage(
      "Supabase is not connected."
    );

    return;
  }


  const name =
    loginName.value.trim();

  const email =
    loginEmail.value.trim().toLowerCase();


  if (!name) {

    showLoginMessage(
      "Please enter your name."
    );

    loginName.focus();

    return;
  }


  if (!email) {

    showLoginMessage(
      "Please enter your Gmail."
    );

    loginEmail.focus();

    return;
  }


  if (!email.endsWith("@gmail.com")) {

    showLoginMessage(
      "Please use a Gmail address."
    );

    loginEmail.focus();

    return;
  }


  sendCodeBtn.disabled = true;

  sendCodeBtn.textContent =
    "Sending...";

  showLoginMessage("");


  try {

    const { error } =
      await supabaseClient.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true
        }
      });


    if (error) {

      console.error(error);

      showLoginMessage(
        error.message
      );

      sendCodeBtn.disabled = false;

      sendCodeBtn.textContent =
        "Send code";

      return;
    }


    pendingEmail = email;
    pendingName = name;


    loginStep1.classList.add("hidden");

    loginStep2.classList.remove("hidden");


    loginCode.value = "";

    loginCode.focus();


    showVerifyMessage(
      "Check your Gmail for the verification code."
    );

  } catch (error) {

    console.error(error);

    showLoginMessage(
      "Something went wrong. Please try again."
    );

  } finally {

    sendCodeBtn.disabled = false;

    sendCodeBtn.textContent =
      "Send code";
  }
}


/* =====================================================
   VERIFY CODE
===================================================== */

async function verifyLoginCode() {

  if (!supabaseClient) {

    await initSupabase();
  }

  if (!supabaseClient) {

    showVerifyMessage(
      "Supabase is not connected."
    );

    return;
  }


  const code =
    loginCode.value.trim();


  if (!code) {

    showVerifyMessage(
      "Enter the code from your Gmail."
    );

    loginCode.focus();

    return;
  }


  verifyCodeBtn.disabled = true;

  verifyCodeBtn.textContent =
    "Checking...";


  try {

    const { data, error } =
      await supabaseClient.auth.verifyOtp({
        email: pendingEmail,
        token: code,
        type: "email"
      });


    if (error) {

      console.error(error);

      showVerifyMessage(
        "Invalid or expired code."
      );

      return;
    }


    if (!data || !data.user) {

      showVerifyMessage(
        "Login could not be completed."
      );

      return;
    }


    /* SAVE NAME */

    await createOrUpdateProfile(
      data.user,
      pendingName
    );


    hideLogin();

    await loadUserProfile();

  } catch (error) {

    console.error(error);

    showVerifyMessage(
      "Something went wrong. Please try again."
    );

  } finally {

    verifyCodeBtn.disabled = false;

    verifyCodeBtn.textContent =
      "Verify & Enter";
  }
}


/* =====================================================
   BACK TO STEP 1
===================================================== */

if (backLoginBtn) {

  backLoginBtn.addEventListener(
    "click",
    () => {

      loginStep2.classList.add("hidden");

      loginStep1.classList.remove("hidden");

      showVerifyMessage("");

      loginCode.value = "";

      loginEmail.focus();
    }
  );
}


/* =====================================================
   BUTTON EVENTS
===================================================== */

if (sendCodeBtn) {

  sendCodeBtn.addEventListener(
    "click",
    sendLoginCode
  );
}


if (verifyCodeBtn) {

  verifyCodeBtn.addEventListener(
    "click",
    verifyLoginCode
  );
}


if (loginEmail) {

  loginEmail.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        sendLoginCode();
      }

    }
  );
}


if (loginCode) {

  loginCode.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        verifyLoginCode();
      }

    }
  );
}


/* =====================================================
   CREATE / UPDATE PROFILE
===================================================== */

async function createOrUpdateProfile(
  user,
  name
) {

  if (!supabaseClient || !user) return;


  const cleanName =
    name ||
    user.user_metadata?.full_name ||
    "";


  const { error } =
    await supabaseClient
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: cleanName
        },
        {
          onConflict: "id"
        }
      );


  if (error) {

    console.error(
      "Profile save error:",
      error
    );
  }
}


/* =====================================================
   LOAD USER PROFILE
===================================================== */

async function loadUserProfile() {

  if (!supabaseClient) return;


  const {
    data: {
      user
    }
  } =
    await supabaseClient.auth.getUser();


  if (!user) {

    showLogin();

    return;
  }


  const {
    data: profile,
    error
  } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();


  if (error) {

    console.error(
      "Profile loading error:",
      error
    );
  }


  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "User";


  const email =
    user.email ||
    "";


  updateProfileUI(
    name,
    email,
    profile?.avatar_url || ""
  );
}


/* =====================================================
   UPDATE PROFILE UI
===================================================== */

function updateProfileUI(
  name,
  email,
  avatar
) {

  if (profileName) {
    profileName.textContent = name;
  }

  if (profileEmail) {
    profileEmail.textContent = email;
  }

  if (infoName) {
    infoName.textContent = name;
  }

  if (infoEmail) {
    infoEmail.textContent = email;
  }


  if (newName) {
    newName.value = name;
  }


  if (avatar) {

    profileAvatar.src = avatar;

    profileAvatar.style.display =
      "block";

    defaultAvatar.style.display =
      "none";

  } else {

    profileAvatar.removeAttribute(
      "src"
    );

    profileAvatar.style.display =
      "none";

    defaultAvatar.style.display =
      "grid";
  }
}


/* =====================================================
   EDIT PROFILE
===================================================== */

if (editProfileBtn) {

  editProfileBtn.addEventListener(
    "click",
    () => {

      if (!editProfileBox) return;

      editProfileBox.classList.toggle(
        "active"
      );

      if (
        editProfileBox.classList.contains(
          "active"
        )
      ) {

        newName.focus();
      }
    }
  );
}


/* =====================================================
   SAVE PROFILE
===================================================== */

async function saveProfile() {

  if (!supabaseClient) return;


  const {
    data: {
      user
    }
  } =
    await supabaseClient.auth.getUser();


  if (!user) {

    showProfileMessage(
      "You are not logged in."
    );

    return;
  }


  const name =
    newName.value.trim();


  if (!name) {

    showProfileMessage(
      "Please enter your name."
    );

    return;
  }


  saveProfileBtn.disabled = true;

  saveProfileBtn.textContent =
    "Saving...";


  try {

    let avatarUrl = "";


    /* =============================================
       PROFILE PICTURE
    ============================================= */

    if (
      avatarInput.files &&
      avatarInput.files.length
    ) {

      const file =
        avatarInput.files[0];


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        showProfileMessage(
          "Please choose an image."
        );

        return;
      }


      if (
        file.size >
        2 * 1024 * 1024
      ) {

        showProfileMessage(
          "Image must be smaller than 2MB."
        );

        return;
      }


      /*
       NOTE:
       Avatar upload needs a Supabase Storage bucket
       named "avatars".

       We try to upload the image.
      */

      const fileExt =
        file.name
          .split(".")
          .pop()
          .toLowerCase();


      const filePath =
        `${user.id}/avatar.${fileExt}`;


      const {
        error: uploadError
      } =
        await supabaseClient
          .storage
          .from("avatars")
          .upload(
            filePath,
            file,
            {
              upsert: true,
              contentType: file.type
            }
          );


      if (uploadError) {

        console.error(
          uploadError
        );

        showProfileMessage(
          "Image upload failed. Create the avatars bucket first."
        );

        return;
      }


      const {
        data: publicData
      } =
        supabaseClient
          .storage
          .from("avatars")
          .getPublicUrl(
            filePath
          );


      avatarUrl =
        publicData.publicUrl;
    }


    /* =============================================
       SAVE DATABASE
    ============================================= */

    const updateData = {
      full_name: name,
      updated_at: new Date().toISOString()
    };


    if (avatarUrl) {

      updateData.avatar_url =
        avatarUrl;
    }


    const {
      error
    } =
      await supabaseClient
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);


    if (error) {

      console.error(error);

      showProfileMessage(
        "Could not save profile."
      );

      return;
    }


    updateProfileUI(
      name,
      user.email || "",
      avatarUrl ||
      profileAvatar.src ||
      ""
    );


    showProfileMessage(
      "Profile updated successfully."
    );


    avatarInput.value = "";


  } catch (error) {

    console.error(error);

    showProfileMessage(
      "Something went wrong."
    );

  } finally {

    saveProfileBtn.disabled = false;

    saveProfileBtn.textContent =
      "Save changes";
  }
}


if (saveProfileBtn) {

  saveProfileBtn.addEventListener(
    "click",
    saveProfile
  );
}


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    async () => {

      if (!supabaseClient) return;


      logoutBtn.disabled = true;

      logoutBtn.textContent =
        "Logging out...";


      const {
        error
      } =
        await supabaseClient.auth.signOut();


      if (error) {

        console.error(error);

        logoutBtn.disabled = false;

        logoutBtn.textContent =
          "Logout";

        return;
      }


      closeProfileSidebar();


      location.reload();
    }
  );
}


/* =====================================================
   CHECK LOGIN WHEN PAGE OPENS
===================================================== */

async function checkLogin() {

  const supabase =
    await initSupabase();


  if (!supabase) {

    return;
  }


  const {
    data: {
      session
    }
  } =
    await supabase.auth.getSession();


  if (session?.user) {

    hideLogin();

    await loadUserProfile();

  } else {

    showLogin();
  }


  /*
    Keep UI synchronized if auth changes.
  */

  supabase.auth.onAuthStateChange(
    async (
      event,
      session
    ) => {

      if (
        event === "SIGNED_IN" &&
        session?.user
      ) {

        hideLogin();

        await loadUserProfile();
      }


      if (
        event === "SIGNED_OUT"
      ) {

        showLogin();
      }

    }
  );
}


/* =====================================================
   START
===================================================== */

loadSupabaseContent();

checkLogin();
