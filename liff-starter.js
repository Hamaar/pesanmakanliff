let nama = "";
let daftar = "";

window.onload = function () {
  const useNodeJS = false; // if you are not using a node server, set this value to false
  const defaultLiffId = "1655535054-QVj1k2ok"; // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch("/send-id")
      .then(function (reqResponse) {
        return reqResponse.json();
      })
      .then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function (error) {
        document.getElementById("liffAppContent").classList.add("hidden");
        document
          .getElementById("nodeLiffIdErrorMessage")
          .classList.remove("hidden");
      });
  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    document.getElementById("liffAppContent").classList.add("hidden");
    document.getElementById("liffIdErrorMessage").classList.remove("hidden");
  } else {
    initializeLiff(myLiffId);
  }
}

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
  liff
    .init({
      liffId: myLiffId,
    })
    .then(() => {
      // start to use LIFF's api
      initializeApp();
    })
    .catch((err) => {
      document.getElementById("liffAppContent").classList.add("hidden");
      document
        .getElementById("liffInitErrorMessage")
        .classList.remove("hidden");
    });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  registerButtonHandlers();
  displayLiffData();

  // check if the user is logged in/out, and disable inappropriate button
  if (liff.isLoggedIn()) {
    document.getElementById("liffLoginButton").disabled = true;
  } else {
    document.getElementById("liffLogoutButton").disabled = true;
    window.open("https://pesanmakanan.netlify.app/login.html", "_self");
  }

  if (liff.isInClient()) {
    document.getElementById("closeWindowButton").classList.add("hidden");
  } else {
    document.getElementById("closeWindowButton").classList.add("hidden");
    document.getElementById("openWindowButton").classList.add("hidden");
  }
}

function registerButtonHandlers() {
  document
    .getElementById("openWindowButton")
    .addEventListener("click", function () {
      liff.openWindow({
        url: "https://pesanmakanan.netlify.app", // Isi dengan Endpoint URL aplikasi web Anda
        external: true,
      });
    });

  document
    .getElementById("closeWindowButton")
    .addEventListener("click", function () {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        liff.closeWindow();
      }
    });

  document
    .getElementById("liffLoginButton")
    .addEventListener("click", function () {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });

  document
    .getElementById("liffLogoutButton")
    .addEventListener("click", function () {
      if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
      }
    });

  document
    .getElementById("sendMessageButton")
    .addEventListener("click", function () {
      let totalHarga = hitungTotal();
      getPesanan();
      if (!liff.isInClient()) {
        alert(`
                  Hai ${nama} !\nPesanan Kamu :\n${daftar}\nTotal Rp. ${totalHarga}\n\n\nSilakan pesan melalui aplikasi LINE`);
      } else {
        liff
          .sendMessages([
            {
              type: "text",
              text: `Halo ${nama} !\n\nPesanan Anda :\n${daftar}\nTotal : Rp. ${totalHarga}\nTerima kasih sudah memesan. Pesanan akan segera disiapkan`,
            },
          ])
          .then(function () {
            liff.closeWindow();
          })
          .catch(function (error) {
            window.alert("Error sending message: " + error);
          });
      }
    });
}

function sendAlertIfNotInClient() {
  alert(
    "This button is unavailable as LIFF is currently being opened in an external browser."
  );
}

/**
 * Toggle specified element
 * @param {string} elementId The ID of the selected element
 */
function toggleElement(elementId) {
  const elem = document.getElementById(elementId);
  if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
    elem.style.display = "none";
  } else {
    elem.style.display = "block";
  }
}

function displayLiffData() {
  if (liff.isLoggedIn()) {
    liff
      .getProfile()
      .then((profile) => {
        nama = profile.displayName;
        document.getElementById("userName").textContent = nama;
        document.getElementById("userProfile").src = profile.pictureUrl;
      })
      .catch((err) => {
        console.log("error", err);
      });
  }
}

function getPesanan() {
  for (let i = 0; i < arrayPesanan.length; i++) {
    daftar =
      daftar + `${i + 1}) ${arrayPesanan[i].jumlah} ${arrayPesanan[i].nama} \n`;
  }
}
