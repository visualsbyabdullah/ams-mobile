export const installWebFocusReset = () => {
  if (typeof document === "undefined") {
    return;
  }

  if (document.getElementById("ams-web-focus-reset")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "ams-web-focus-reset";
  style.innerHTML = `
    input,
    textarea,
    [contenteditable="true"] {
      outline: none !important;
      box-shadow: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }

    input:focus,
    textarea:focus,
    [contenteditable="true"]:focus {
      outline: none !important;
      box-shadow: none !important;
      border-color: transparent !important;
    }
  `;

  document.head.appendChild(style);
};
