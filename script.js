/* =====================================================
   MOL L5IBRA - script.js
   Email OTP + Profile + Supabase Content
===================================================== */


/* =====================================================
   DEMO CONTENT
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
   HTML SECURITY
===================================================== */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =====================================================
   CARDS
===================================================== */

function cards(items, type) {
  return items.map(item => `
    <article class="card">
      <span class="tag">
        ${escapeHTML(item.tag || type)}
      </span>

      <h3>
        ${escapeHTML(item.title || "")}
      </h3>

      <p>
        ${escapeHTML(item.text || "")}
      </p>

      ${
        item.price
          ? `<div class="price">${escapeHTML(item.price)}</div>`
          : ""
      }
    </article>
  `).join("");
}


/* =====================================================
   DEMO RENDER
===================================================== */

function renderDemo() {

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

renderDemo();


/* =====================================================
   SUPABASE
===================================================== */

let supabaseClient = null;


async function initSupabase() {

  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY
  ) {
    console.error("Supabase configuration is missing.");
    return null;
  }

  if (supabaseClient) {
    return supabaseClient;
  }

  try {

    const { createClient } = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    supabaseClient = createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    return supabaseClient;

  } catch (error) {

    console.error(
      "Could not initialize Supabase:",
      error
    );

    return null;
  }
}


/* =====================================================
   LOAD CONTENT FROM SUPABASE
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
      console.error(
        "Content loading error:",
        error
      );
      return;
    }

    if (!data || data.length === 0) {
      return;
    }

    const news = data.filter(
      item => item.type === "news"
    );

    const legends = data.filter(
      item => item.type === "legend"
    );

    const products = data.filter(
      item => item.type === "product"
    );


    const newsGrid =
      document.querySelector("#news-grid");

    const legendsGrid =
      document.querySelector("#legends-grid");

    const storeGrid =
      document.querySelector("#store-grid");


    if (news.length && newsGrid) {
      newsGrid.innerHTML =
        cards(news, "NEWS");
    }

    if (legends.length && legendsGrid) {
      legendsGrid.innerHTML =
        cards(legends, "LEGEND");
    }

    if (products.length && storeGrid) {
      storeGrid.innerHTML =
        cards(products, "STORE");
    }

  } catch (error) {

    console.error(
      "Supabase content error:",
      error
    );
  }
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

const profileBtn =
  document.querySelector("#profileBtn");

const profileSidebar =
  document.querySelector("#profileSidebar");

const profileOverlay =
  document.querySelector("#profileOverlay");

const closeProfile =
  document.querySelector("#closeProfile");

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
   LOGIN VARIABLES
===================================================== */

let pendingEmail = "";
let pendingName = "";


/* =====================================================
   LOGIN MESSAGE
===================================================== */

function showLoginMessage(message) {

  if (loginMessage) {
    loginMessage.textContent = message || "";
  }
}


function showVerifyMessage(message) {

  if (verifyMessage) {
    verifyMessage.textContent = message || "";
  }
}


function showProfileMessage(message) {

  if (profileMessage) {
    profileMessage.textContent = message || "";
  }
}


/* =====================================================
   LOGIN SHOW / HIDE
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
   SEND OTP
===================================================== */

async function sendLoginCode() {

  const supabase =
    await initSupabase();

  if (!supabase) {

    showLoginMessage(
      "Supabase is not connected."
    );

    return;
  }


  const name =
    loginName?.value.trim() || "";

  const email =
    loginEmail?.value.trim().toLowerCase() || "";


  if (!name) {

    showLoginMessage(
      "Enter your name first."
    );

    loginName?.focus();

    return;
  }


  if (!email) {

    showLoginMessage(
      "Enter your Gmail address."
    );

    loginEmail?.focus();

    return;
  }


  if (!email.endsWith("@gmail.com")) {

    showLoginMessage(
      "Please enter a Gmail address."
    );

    loginEmail?.focus();

    return;
  }


  if (sendCodeBtn) {

    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = "Sending...";
  }

  showLoginMessage("");


  try {

    /*
      IMPORTANT:
      This sends an email OTP.
      The user enters the 6-digit code from Gmail.
    */

    const { error } =
      await supabase.auth.signInWithOtp({

        email: email,

        options: {
          shouldCreateUser: true
        }

      });


    if (error) {

      console.error(
        "OTP send error:",
        error
      );

      showLoginMessage(
        error.message
      );

      return;
    }


    pendingEmail = email;
    pendingName = name;


    if (loginStep1) {
      loginStep1.classList.add("hidden");
    }

    if (loginStep2) {
      loginStep2.classList.remove("hidden");
    }


    if (loginCode) {

      loginCode.value = "";

      loginCode.focus();
    }


    showVerifyMessage(
      "We sent a 6-digit code to your Gmail."
    );


  } catch (error) {

    console.error(error);

    showLoginMessage(
      "Could not send the code."
    );

  } finally {

    if (sendCodeBtn) {

      sendCodeBtn.disabled = false;
      sendCodeBtn.textContent = "Send code";
    }
  }
}


/* =====================================================
   VERIFY OTP
===================================================== */

async function verifyLoginCode() {

  const supabase =
    await initSupabase();

  if (!supabase) {

    showVerifyMessage(
      "Supabase is not connected."
    );

    return;
  }


  const code =
    loginCode?.value.trim() || "";


  if (!pendingEmail) {

    showVerifyMessage(
      "Please request a new code first."
    );

    return;
  }


  if (!/^\d{6}$/.test(code)) {

    showVerifyMessage(
      "Enter the 6-digit code."
    );

    loginCode?.focus();

    return;
  }


  if (verifyCodeBtn) {

    verifyCodeBtn.disabled = true;
    verifyCodeBtn.textContent = "Checking...";
  }


  showVerifyMessage("");


  try {

    const { data, error } =
      await supabase.auth.verifyOtp({

        email: pendingEmail,

        token: code,

        type: "email"

      });


    if (error) {

      console.error(
        "OTP verification error:",
        error
      );

      showVerifyMessage(
        "The code is incorrect or expired."
      );

      return;
    }


    if (!data?.user) {

      showVerifyMessage(
        "Login failed. Please try again."
      );

      return;
    }


    /*
      Create profile after successful login.
    */

    await createOrUpdateProfile(
      data.user,
      pendingName
    );


    hideLogin();

    await loadUserProfile();


  } catch (error) {

    console.error(error);

    showVerifyMessage(
      "Something went wrong."
    );

  } finally {

    if (verifyCodeBtn) {

      verifyCodeBtn.disabled = false;
      verifyCodeBtn.textContent =
        "Verify & Enter";
    }
  }
}


/* =====================================================
   BACK BUTTON
===================================================== */

if (backLoginBtn) {

  backLoginBtn.addEventListener(
    "click",
    () => {

      if (loginStep2) {
        loginStep2.classList.add("hidden");
      }

      if (loginStep1) {
        loginStep1.classList.remove("hidden");
      }

      showVerifyMessage("");

      if (loginCode) {
        loginCode.value = "";
      }
    }
  );
}


/* =====================================================
   LOGIN BUTTON EVENTS
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
    "input",
    () => {

      /*
        Only allow numbers.
      */

      loginCode.value =
        loginCode.value
          .replace(/\D/g, "")
          .slice(0, 6);
    }
  );


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
   CREATE / UPDATE PROFILE
===================================================== */

async function createOrUpdateProfile(
  user,
  name
) {

  if (!supabaseClient || !user) {
    return;
  }


  const cleanName =
    name ||
    user.user_metadata?.full_name ||
    "User";


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
      "Profile creation error:",
      error
    );
  }
}


/* =====================================================
   LOAD USER PROFILE
===================================================== */

async function loadUserProfile() {

  const supabase =
    await initSupabase();

  if (!supabase) return;


  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser();


  if (!user) {

    showLogin();

    return;
  }


  const {
    data: profile,
    error
  } =
    await supabase
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
    user.email || "";


  const avatar =
    profile?.avatar_url || "";


  updateProfileUI(
    name,
    email,
    avatar
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


  if (
    avatar &&
    profileAvatar
  ) {

    profileAvatar.src = avatar;

    profileAvatar.style.display =
      "block";

    if (defaultAvatar) {
      defaultAvatar.style.display =
        "none";
    }

  } else {

    if (profileAvatar) {

      profileAvatar.removeAttribute(
        "src"
      );

      profileAvatar.style.display =
        "none";
    }

    if (defaultAvatar) {

      defaultAvatar.style.display =
        "grid";
    }
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

        newName?.focus();
      }
    }
  );
}


/* =====================================================
   SAVE PROFILE
===================================================== */

async function saveProfile() {

  const supabase =
    await initSupabase();

  if (!supabase) return;


  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser();


  if (!user) {

    showProfileMessage(
      "Please login first."
    );

    return;
  }


  const name =
    newName?.value.trim() || "";


  if (!name) {

    showProfileMessage(
      "Enter your name."
    );

    return;
  }


  if (saveProfileBtn) {

    saveProfileBtn.disabled = true;
    saveProfileBtn.textContent =
      "Saving...";
  }


  try {

    let avatarUrl = "";


    /* =============================================
       AVATAR
    ============================================= */

    if (
      avatarInput?.files &&
      avatarInput.files.length > 0
    ) {

      const file =
        avatarInput.files[0];


      if (
        !file.type.startsWith("image/")
      ) {

        showProfileMessage(
          "Please select an image."
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


      const extension =
        file.name
          .split(".")
          .pop()
          .toLowerCase();


      const filePath =
        `${user.id}/avatar.${extension}`;


      const {
        error: uploadError
      } =
        await supabase
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
          "Avatar upload error:",
          uploadError
        );

        showProfileMessage(
          "Could not upload the image."
        );

        return;
      }


      const {
        data: publicData
      } =
        supabase
          .storage
          .from("avatars")
          .getPublicUrl(
            filePath
          );


      avatarUrl =
        publicData.publicUrl;
    }


    /* =============================================
       UPDATE DATABASE
    ============================================= */

    const updateData = {
      full_name: name,
      updated_at:
        new Date().toISOString()
    };


    if (avatarUrl) {

      updateData.avatar_url =
        avatarUrl;
    }


    const {
      error
    } =
      await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);


    if (error) {

      console.error(
        "Profile update error:",
        error
      );

      showProfileMessage(
        "Could not save your profile."
      );

      return;
    }


    await loadUserProfile();


    showProfileMessage(
      "Profile updated successfully."
    );


    if (avatarInput) {
      avatarInput.value = "";
    }


  } catch (error) {

    console.error(error);

    showProfileMessage(
      "Something went wrong."
    );

  } finally {

    if (saveProfileBtn) {

      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent =
        "Save changes";
    }
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

      const supabase =
        await initSupabase();

      if (!supabase) return;


      logoutBtn.disabled = true;
      logoutBtn.textContent =
        "Logging out...";


      const {
        error
      } =
        await supabase.auth.signOut();


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
   CHECK LOGIN
===================================================== */

async function checkLogin() {

  const supabase =
    await initSupabase();

  if (!supabase) return;


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


  supabase.auth.onAuthStateChange(
    async (event, session) => {

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
