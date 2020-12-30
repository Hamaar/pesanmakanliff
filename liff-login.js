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

  // check if the user is logged in/out, and disable inappropriate button
  //   if (liff.isLoggedIn()) {
  //     document.getElementById("liffLoginButton").disabled = true;
  //   } else {
  //     document.getElementById("liffLogoutButton").disabled = true;
  //   }
}

function registerButtonHandlers() {
  document
    .getElementById("liffLoginButton")
    .addEventListener("click", function () {
      if (!liff.isLoggedIn()) {
        liff.login();
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
