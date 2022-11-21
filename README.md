# 11ty-Shortcodes
My private collection of nunjucks shortcodes. Well so far it is just one. But let's see if there will be more.
If you want to get started with Contentful and Eleventy, I highly recommend this [post](https://henry.codes/writing/how-to-use-contentful-with-eleventy/) by Henry Desroches. 

## Contentful Picture Shortcode

This shortcode can be used for images loaded from Contentful.
It generates a `<picture>` with all the formats and widths defined in the shortcode.

**Required properties:**
  - `imgObj` The whole image object from contentful (not just the URL!)

**Not required, but recommended:**
  - `alt` alt for the image (works with ""). Defaults to the image's title defined in Contentful
  - `imgWidth` The width of the image requested from contentful. Defaults to 800
  - `imgHeight` The height of the image requested from contentful. Defaults to 600

_if you define either `imgWidth` or `imgHeight` , the other one will be calculated based on the image's
  dimensions taken from contentful. If you specify both, the image will be resized._

**Optional properties:**
  - `formats` The image formats generated for the picture. Defaults to ["avif", "webp", "jpg"]
  - `widths` all the widths for the picture elements. Works with [none]. Defaults to [300, 600]
  - `sizes` defines the sizes for the picture. Defaults to "(min-width: 22em) 30vw, 100vw"
  - `classes` add some classes
  - `fit` if you resize the image this defines how it should be resized. Defaults to "fill"
  
### Use this in your templates:
Place the js file in your src-folder. You may put it in a subfolger (eg. src/shortcodes). Then include it in your `.eleventy.js`
```
module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode(
    "ctflPicture",
    require("./src/shortcodes/ctflPicture.js")
  );
};
```

**Basic usage:**
```
{% ctflPicture imgObj = myImage, alt="ctfl image", imgWidth="800", imgHeight="600" %}
```

**Thumbnail example:**
```
{% ctflPicture
  imgObj = myImage,
  alt="Avatar",
  imgWidth="32",
  imgHeight="32",
  fit="thumb",
  widths=[32],
  sizes="2rem"
%}
```


## Contentful Download Shortcode

Use this shortcode, if you have files stored @contentful. 
* uses 11ty fetch to cache the files
* writes a local copy to `dist/downloads`
* uses the file's title as filename
* returns a link to the local file

**Required properties:**
  - `DownloadObj` The whole file object from contentful (not just the URL!)
  
**Basic usage:**
```
{% ctflDownload downloadObj = item %}
```
