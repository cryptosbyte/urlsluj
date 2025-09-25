/**
 * @type {string}
 * normal would be started with "msg="
*/
const URLParams = decodeURIComponent(window.location.search).substring(1).split('&'),
  message = URLParams[0],
  slug = URLParams[1].slice(5)
  msg = message.startsWith("msg=") ? message.slice(4) : "You're not supposed to be here.",
  msgElement = document.getElementById('msg').firstElementChild;

msgElement.textContent =  `${msg}\n Your slug is "${slug}".`;
msgElement.href = `/${slug}`