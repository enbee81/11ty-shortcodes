/* ==========================================================
This shortcode can be used for images loaded from Contentful.
It generates a <picture> with all the formats and widths defined in the shortcode.

Required properties:
  - imgObj -> The whole image object from contentful (not just the URL!)

Not required, but recommended:
  - alt -> alt for the image (works with ""). Defaults to the image's title defined in Contentful
  - imgWidth -> The width of the image requested from contentful. Defaults to 800
  - imgHeight -> The height of the image requested from contentful. Defaults to 600
  !! if you define either imgWidth or imgHeight, the other one will be calculated based on the image's
  dimensions taken from contentful. If you specify both, the image will be resized. !!

Optional properties:
  - formats -> The image formats generated for the picture. Defaults to ["avif", "webp", "jpg"]
  - widths -> all the widths for the picture elements. Works with [none]. Defaults to [300, 600]
  - sizes -> defines the sizes for the picture. Defaults to "(min-width: 22em) 30vw, 100vw"
  - classes -> add some classes
  - fit -> if you resize the image this defines how it should be resized. Defaults to "fill"

Basic usage:
{% ctflPicture imgObj = myImage, alt="ctfl image", imgWidth="800", imgHeight="600" %}

Thumbnail example:
{% ctflPicture
  imgObj = myImage,
  alt="Avatar",
  imgWidth="32",
  imgHeight="32",
  fit="thumb",
  widths=[32],
  sizes="2rem"
%}
========================================================== */

const eleventyImage = require("@11ty/eleventy-img");

async function ctflPictureShortcode(ctflImage) {
  if (!ctflImage.imgObj) {
    return "Contentful image-object must be provided";
  }

  if (
    ctflImage.imgObj.fields == undefined ||
    ctflImage.imgObj.fields.file == undefined ||
    ctflImage.imgObj.fields.file.contentType == undefined ||
    ctflImage.imgObj.fields.file.contentType.startsWith("image") == false
  ) {
    return "imgObj must be a valid contentful image object";
  }

  const { imgObj } = ctflImage;
  let imgUrl = imgObj.fields.file.url;
  const imgId = imgObj.sys.id;
  const originSizes = imgObj.fields.file.details.image;
  const ratio = originSizes.width / originSizes.height;

  const alt = ctflImage.alt || imgObj.fields.title;
  const formats = ctflImage.formats || ["avif", "webp", "jpg"];
  const widths = ctflImage.widths || [300, 600];
  const sizes = ctflImage.sizes || "(min-width: 22em) 30vw, 100vw";
  const classes = ctflImage.classes || "";
  const fit = ctflImage.fit ? ctflImage.fit : "fill";

  let imgWidth = 800;
  let imgHeight = 600;

  if (ctflImage.imgWidth && ctflImage.imgHeight) {
    imgWidth = ctflImage.imgWidth;
    imgHeight = ctflImage.imgHeight;
  }

  if (ctflImage.imgWidth && !ctflImage.imgHeight) {
    let calculatedHeight = Math.floor(ctflImage.imgWidth / ratio);
    imgWidth = ctflImage.imgWidth;
    imgHeight = calculatedHeight;
  }

  if (!ctflImage.imgWidth && ctflImage.imgHeight) {
    let calculatedWidth = Math.floor(ctflImage.imgHeight * ratio);
    imgHeight = ctflImage.imgHeight;
    imgWidth = calculatedWidth;
  }

  if (imgUrl.startsWith("//")) {
    imgUrl = "https:" + imgUrl;
  }

  imgUrl = imgUrl + "?fit=" + fit + "&w=" + imgWidth + "&h=" + imgHeight;

  let options;

  options = {
    formats: formats,
    widths: widths,
    urlPath: "/images/ctfl",
    outputDir: "dist/images/ctfl",
    filenameFormat: function (id, src, width, format, options) {
      return `${imgId}-${imgWidth}x${imgHeight}-${width}w-${fit}.${format}`;
    },
  };

  let stats;
  if (process.env.ELEVENTY_SERVERLESS) {
    stats = eleventyImage.statsByDimensionsSync(
      imgUrl,
      imgWidth,
      imgHeight,
      options
    );
  } else {
    stats = await eleventyImage(imgUrl, options);
  }

  return eleventyImage.generateHTML(stats, {
    alt,
    loading: "lazy",
    decoding: "async",
    sizes: sizes,
    class: classes,
  });
}

module.exports = ctflPictureShortcode;
