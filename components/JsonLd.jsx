// Server-rendered schema.org structured data. `data` is a plain object (see app/lib/seo.js).
// "<" is escaped so the JSON can never close the script tag.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
