/* =====================================================
MOL L5IBRA - script.js
GOOGLE LOGIN + PROFILE + SUPABASE CONTENT
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
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");
}

/* =====================================================
CARDS
===================================================== */

function cards(items, type) {

return items.map(item => ` <article class="card">

```
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
```

`).join("");
}

/* =====================================================
DEMO RENDER
===================================================== */

function renderDemo() {

const newsGrid =
document.querySelector("#news-grid");

const legendsGrid =
document.querySelector("#legends-grid");

const storeGrid =
document.querySelector("#store-grid");

if (newsGrid) {
newsGrid.innerHTML =
cards(demoNews, "NEWS");
}

if (legendsGrid) {
legendsGrid.innerHTML =
cards(demoLegends, "LEGEND");
}

if (storeGrid) {
storeGrid.innerHTML =
cards(demoStore, "STORE");
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

```
console.error(
  "Supabase configuration is missing."
);

return null;
```

}

if (supabaseClient) {
return supabaseClient;
}

try {

```
const { createClient } =
  await import(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
  );


supabaseClient =
  createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );


return supabaseClient;
```

} catch (error) {

```
console.error(
  "Could not initialize Supabase:",
  error
);

return null;
```

}
}

/* =====================================================
LOAD CONTENT
===================================================== */

async function loadSupabaseContent() {

const supabase =
await initSupabase();

if (!supabase) return;

try {

```
const {
  data,
  error
} =
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

  console.error(
    "Content loading error:",
    error
  );

  return;
}


if (!data || data.length === 0) {
  return;
}


const news =
  data.filter(
    item => item.type === "news"
  );


const legends =
  data.filter(
    item => item.type === "legend"
  );


const products =
  data.filter(
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
```

} catch (error) {

```
console.error(
  "Supabase content error:",
  error
);
```

}
}

/* =====================================================
LOGIN ELEMENTS
===================================================== */

const loginOverlay =
document.querySelector("#loginOverlay");

const googleLoginBtn =
document.querySelector("#googleLoginBtn");

const loginMessage =
document.querySelector("#loginMessage");

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
MESSAGES
===================================================== */

function showLoginMessage(message) {

if (loginMessage) {
loginMessage.textContent =
message || "";
}
}

function showProfileMessage(message) {

if (profileMessage) {
profileMessage.textContent =
message || "";
}
}

/* =====================================================
LOGIN SHOW / HIDE
===================================================== */

function showLogin() {

if (!loginOverlay) return;

loginOverlay.classList.remove("hidden");

document.body.style.overflow =
"hidden";
}

function hideLogin() {

if (!loginOverlay) return;

loginOverlay.classList.add("hidden");

document.body.style.overflow =
"";
}

/* =====================================================
GOOGLE LOGIN
===================================================== */

async function loginWithGoogle() {

const supabase =
await initSupabase();

if (!supabase) {

```
showLoginMessage(
  "Supabase is not connected."
);

return;
```

}

if (googleLoginBtn) {

```
googleLoginBtn.disabled = true;

googleLoginBtn.textContent =
  "Connecting...";
```

}

showLoginMessage("");

try {

```
const {
  error
} =
  await supabase.auth.signInWithOAuth({

    provider: "google",

    options: {

      redirectTo:
        window.location.origin +
        window.location.pathname

    }

  });


if (error) {

  console.error(
    "Google login error:",
    error
  );

  showLoginMessage(
    error.message
  );

}
```

} catch (error) {

```
console.error(error);

showLoginMessage(
  "Could not connect to Google."
);
```

} finally {

```
if (googleLoginBtn) {

  googleLoginBtn.disabled = false;

  googleLoginBtn.textContent =
    "Continue with Google";
}
```

}
}

if (googleLoginBtn) {

googleLoginBtn.addEventListener(
"click",
loginWithGoogle
);
}

/* =====================================================
PROFILE SIDEBAR
===================================================== */

function openProfile() {

if (!profileSidebar) return;

profileSidebar.classList.add("active");

if (profileOverlay) {

```
profileOverlay.classList.add(
  "active"
);
```

}

document.body.style.overflow =
"hidden";
}

function closeProfileSidebar() {

if (!profileSidebar) return;

profileSidebar.classList.remove(
"active"
);

if (profileOverlay) {

```
profileOverlay.classList.remove(
  "active"
);
```

}

document.body.style.overflow =
"";
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
user
) {

if (!supabaseClient || !user) {
return;
}

const googleName =
user.user_metadata?.full_name ||
user.user_metadata?.name ||
"User";

const googleAvatar =
user.user_metadata?.avatar_url ||
user.user_metadata?.picture ||
null;

const profileData = {

```
id: user.id,

full_name: googleName
```

};

if (googleAvatar) {

```
profileData.avatar_url =
  googleAvatar;
```

}

const {
error
} =
await supabaseClient
.from("profiles")
.upsert(
profileData,
{
onConflict: "id"
}
);

if (error) {

```
console.error(
  "Profile creation error:",
  error
);
```

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

```
showLogin();

return;
```

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

```
console.error(
  "Profile loading error:",
  error
);
```

}

const name =
profile?.full_name ||
user.user_metadata?.full_name ||
user.user_metadata?.name ||
"User";

const email =
user.email || "";

const avatar =
profile?.avatar_url ||
user.user_metadata?.avatar_url ||
user.user_metadata?.picture ||
"";

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
profileName.textContent =
name;
}

if (profileEmail) {
profileEmail.textContent =
email;
}

if (infoName) {
infoName.textContent =
name;
}

if (infoEmail) {
infoEmail.textContent =
email;
}

if (newName) {
newName.value =
name;
}

if (
avatar &&
profileAvatar
) {

```
profileAvatar.src =
  avatar;

profileAvatar.style.display =
  "block";


if (defaultAvatar) {

  defaultAvatar.style.display =
    "none";
}
```

} else {

```
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
```

}
}

/* =====================================================
EDIT PROFILE
===================================================== */

if (editProfileBtn) {

editProfileBtn.addEventListener(
"click",
() => {

```
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
```

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

```
showProfileMessage(
  "Please login first."
);

return;
```

}

const name =
newName?.value.trim() || "";

if (!name) {

```
showProfileMessage(
  "Enter your name."
);

return;
```

}

if (saveProfileBtn) {

```
saveProfileBtn.disabled =
  true;

saveProfileBtn.textContent =
  "Saving...";
```

}

try {

```
let avatarUrl = "";


if (
  avatarInput?.files &&
  avatarInput.files.length > 0
) {

  const file =
    avatarInput.files[0];


  if (
    !file.type.startsWith(
      "image/"
    )
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
          contentType:
            file.type
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
    .update(
      updateData
    )
    .eq(
      "id",
      user.id
    );


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
```

} catch (error) {

```
console.error(error);

showProfileMessage(
  "Something went wrong."
);
```

} finally {

```
if (saveProfileBtn) {

  saveProfileBtn.disabled =
    false;

  saveProfileBtn.textContent =
    "Save changes";
}
```

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

```
  const supabase =
    await initSupabase();


  if (!supabase) return;


  logoutBtn.disabled =
    true;

  logoutBtn.textContent =
    "Logging out...";


  const {
    error
  } =
    await supabase.auth.signOut();


  if (error) {

    console.error(error);

    logoutBtn.disabled =
      false;

    logoutBtn.textContent =
      "Logout";

    return;
  }


  closeProfileSidebar();

  showLogin();

}
```

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

```
hideLogin();

await createOrUpdateProfile(
  session.user
);

await loadUserProfile();
```

} else {

```
showLogin();
```

}

supabase.auth.onAuthStateChange(
async (
event,
session
) => {

```
  if (
    event === "SIGNED_IN" &&
    session?.user
  ) {

    hideLogin();

    await createOrUpdateProfile(
      session.user
    );

    await loadUserProfile();
  }


  if (
    event === "SIGNED_OUT"
  ) {

    showLogin();
  }

}
```

);
}

/* =====================================================
START
===================================================== */

loadSupabaseContent();

checkLogin();
