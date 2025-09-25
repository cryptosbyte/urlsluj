const ifURL = (url) => {
  const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(url)) return true;
  return false;
};

const showError = (msg) => {
  const error = document.getElementById('error');
  error.style.display = 'block';
  error.children[1].textContent = msg;
};

const newSlugTime = (url, slug) => {
  fetch("../api/new", {
    method: "POST",
    headers: new Headers({
      'slug': slug,
      'url': url
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.returned == "404") alert("Internal Server Error ¯\\_(ツ)_/¯")
    })
}

document.getElementById('create').addEventListener('click', () => {
  const url = document.querySelector("body .container input#url").value;
  const slug = document.querySelector("body .container input#customCode").value;

  if (!url || !slug) return;
  if (!ifURL(url)) return showError("Incorrect URL provided!");
  if (!/^[A-Za-z0-9]+$/.test(slug)) return showError("Slug is not alphanumeric!")

  fetch('../api/validate', {
    headers: new Headers({
      'slug': slug
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (!data.valid) return showError("Slug already taken!")
      else {
        console.log("%c Slug Availabled!", "font-size:3rem; font-family:'Helvetica';");
        newSlugTime(url, slug);
        window.location.href = `/landing?msg=Your%20slug%20has%20been%20added!%20Try%20it%20out.&slug=${slug}`;
      }
    });
});