import sanitizeHtml from "sanitize-html";

const allowedIframeHosts = [
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.tiktok.com",
  "www.facebook.com",
  "facebook.com"
];

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "iframe",
      "video",
      "source",
      "h1",
      "h2",
      "h3",
      "h4",
      "span"
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "title", "referrerpolicy"],
      video: ["src", "controls", "width", "height", "poster"],
      source: ["src", "type"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedIframeHostnames: allowedIframeHosts,
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }, true)
    }
  });
}

export function plainTextFromHtml(html: string, maxLength = 160) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
