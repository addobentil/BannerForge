const capture = document.getElementById("capture");
const bg = document.getElementById("bg");
const fg = document.getElementById("fg");
const bbg = document.getElementById("bbg");
const heading = document.getElementById("heading");
const borderw = document.getElementById("borderw");
const root = document.querySelector(":root");
const tsc = document.getElementById("tsc");
let picker1 = new Picker({
  parent: bg,
  color: getComputedStyle(document.documentElement).getPropertyValue(
    "--bg-color"
  ),
  popup: "left",
  onChange({ rgbaString }) {
    root.style.setProperty("--bg-color", rgbaString);
  },
});
let picker2 = new Picker({
  parent: fg,
  color: getComputedStyle(document.documentElement).getPropertyValue(
    "--fg-color"
  ),
  popup: "left",
  onChange({ rgbaString }) {
    root.style.setProperty("--fg-color", rgbaString);
  },
});
let picker3 = new Picker({
  parent: bbg,
  color: getComputedStyle(document.documentElement).getPropertyValue(
    "--bbg-color"
  ),
  popup: "left",
  onChange({ rgbaString }) {
    root.style.setProperty("--bbg-color", rgbaString);
  },
});
let picker4 = new Picker({
  parent: tsc,
  color: getComputedStyle(document.documentElement).getPropertyValue(
    "--ts-color"
  ),
  popup: "left",
  onChange({ rgbaString }) {
    root.style.setProperty("--ts-color", rgbaString);
  },
});
const generateRandomHexColor = () =>
  `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`;
const randomize = () => {
  root.style.setProperty("--bg-color", generateRandomHexColor());
  root.style.setProperty("--fg-color", generateRandomHexColor());
  root.style.setProperty("--bbg-color", generateRandomHexColor());
  picker1.setColor(
    getComputedStyle(document.documentElement).getPropertyValue("--bg-color")
  );
  picker2.setColor(
    getComputedStyle(document.documentElement).getPropertyValue("--fg-color")
  );
  picker3.setColor(
    getComputedStyle(document.documentElement).getPropertyValue("--bbg-color")
  );
};
randomize();
const download = () => {
  html2canvas(capture, {
    scale: 1.5,
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--bg-color")
  }).then((canvas) => {
    saveAs(canvas.toDataURL(), "banner.png");
  });
};
const saveAs = (uri, filename) => {
  const link = document.createElement("a");
  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
};
const borderwidth = ({ value }) =>
  root.style.setProperty("--bw-size", `${value}px`);
const fontsize = ({ value }) => (heading.style.fontSize = value + `px`);
const cheight = ({ value }) => (capture.style.height = value + `vw`);
const tsx = ({ value }) => root.style.setProperty("--tsx-size", `${value}px`);
const tsy = ({ value }) => root.style.setProperty("--tsy-size", `${value}px`);
const tsb = ({ value }) => root.style.setProperty("--tsb-size", `${value}px`);
const readURL = () => {
  const file = document.getElementById("getbg").files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    capture.style.backgroundImage = `url(${reader.result})`;
  };
  if (file) {
    reader.readAsDataURL(file);
    document.getElementById("resetbg").style.display = "inline-flex";
  }
};
document.getElementById("getbg").addEventListener("change", readURL, true);
const resetbg = () => {
  capture.style.backgroundImage = ``;
  document.getElementById("resetbg").style.display = "none";
};
const textalign = ({ classList }, h, v) => {
  document.querySelector(".current").classList.toggle("current");
  capture.style.textAlign = h;
  capture.style.justifyContent = v;
  classList.add("current");
};

// pwa
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
buttonInstall.addEventListener('click', async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});
