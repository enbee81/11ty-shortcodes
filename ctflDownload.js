/* ==========================================================
This shortcode takes a file from a contentful media-input field and caches it locally.
The file is then written to dist/downloads using the file's id as filename.
It returns a link to the downloaded file.

Required properties:
  - downloadObj -> The whole file object from contentful (not just the URL!)

Optional properties:
  - title -> will be used as filename for the download HTML-attribute
  - classes -> list of classes that is applied to the link
========================================================== */

const EleventyFetch = require("@11ty/eleventy-fetch");
const fs = require("fs");

async function ctflDownloadShortcode(content, ctflDownload) {
  const url = "https:" + ctflDownload.downloadObj.fields.file.url;
  const filetype = url.split(".").pop();
  const filename = ctflDownload.downloadObj.sys.id;
  const title = ctflDownload.title ? ctflDownload.title : filename;
  const classes = ctflDownload.classes ? ctflDownload.classes : "";

  let data = await EleventyFetch(url, {
    duration: "1d",
    directory: ".cache",
  });

  const dir = "dist/downloads";
  // create new directory
  try {
    // first check if directory already exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (err) {
    console.log(err);
  }

  fs.writeFile(`dist/downloads/${filename}.${filetype}`, data, (err) => {
    // Checking for errors
    if (err) throw err;
    console.log("Done writing " + filename); // Success
  });

  return `<a class="${classes}" href="/downloads/${filename}.${filetype}" download="${title}">${content}</a>`;
}

module.exports = ctflDownloadShortcode;
