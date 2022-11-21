// This takes a file from a contentful media-input field and caches it locally.
// The file is then written to dist/downloads using the file's title as filename.
// A link to the file is returned.

const EleventyFetch = require("@11ty/eleventy-fetch");
const fs = require("fs");

async function ctflDownloadShortcode(ctflDownload) {
  let url = "https:" + ctflDownload.downloadObj.fields.file.url;
  let filetype = url.split(".").pop();
  let filename = ctflDownload.downloadObj.fields.title;
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

  return `<a href="/downloads/${filename}.${filetype}" download>${filename}</a>`;
}

module.exports = ctflDownloadShortcode;
