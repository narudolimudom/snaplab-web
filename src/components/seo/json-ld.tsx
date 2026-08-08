export function JsonLd({ data }: { data: object }) {
  // JSON.stringify does not escape "<", so admin-supplied content (product
  // name/description) containing "</script>" could break out of this tag
  // and inject a live <script> into the page. Escaping "<" as its unicode
  // sequence keeps the JSON valid while preventing that.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
