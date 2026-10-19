import { defineQuery } from "next-sanity";

const imageProjection = `{
  _type,
  "id": coalesce(_key, asset._ref),
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  alt,
  caption,
  credit,
  context,
  photographedAt
}`;

const postProjection = `{
  "id": _id,
  title,
  "slug": slug.current,
  summary,
  "content": content[]{
    ...,
    _type == "imagemEditorial" => ${imageProjection}
  },
  publishedAt,
  "updatedAt": _updatedAt,
  "author": author->name,
  "category": category->title,
  "tags": coalesce(tags, []),
  "status": editorialStatus,
  "featured": coalesce(featured, false),
  "coverImage": coverImage.asset->url,
  "coverImageWidth": coverImage.asset->metadata.dimensions.width,
  "coverImageHeight": coverImage.asset->metadata.dimensions.height,
  "coverImageAlt": coverImage.alt,
  "coverImageCaption": coverImage.caption,
  "coverImageCredit": coverImage.credit,
  "coverImageContext": coverImage.context,
  "gallery": gallery[]${imageProjection},
  "socialImage": socialImage${imageProjection},
  "seo": {
    "title": seoTitle,
    "description": seoDescription
  }
}`;

export const publishedPostsQuery = defineQuery(`
  {
    "items": *[
      _type == "postagem" &&
      defined(slug.current) &&
      editorialStatus == "published" &&
      defined(publishedAt) &&
      dateTime(publishedAt) <= dateTime(now()) &&
      ($category == null || category->title == $category)
    ] | order(publishedAt desc) [$start...$end] ${postProjection},
    "total": count(*[
      _type == "postagem" &&
      defined(slug.current) &&
      editorialStatus == "published" &&
      defined(publishedAt) &&
      dateTime(publishedAt) <= dateTime(now()) &&
      ($category == null || category->title == $category)
    ])
  }
`);

export const previewPostsQuery = defineQuery(`
  {
    "items": *[
      _type == "postagem" &&
      defined(slug.current) &&
      ($category == null || category->title == $category)
    ] | order(coalesce(publishedAt, _updatedAt) desc) [$start...$end] ${postProjection},
    "total": count(*[
      _type == "postagem" &&
      defined(slug.current) &&
      ($category == null || category->title == $category)
    ])
  }
`);

export const publishedPostBySlugQuery = defineQuery(`
  *[
    _type == "postagem" &&
    slug.current == $slug &&
    editorialStatus == "published" &&
    defined(publishedAt) &&
    dateTime(publishedAt) <= dateTime(now())
  ][0] ${postProjection}
`);

export const previewPostBySlugQuery = defineQuery(`
  *[_type == "postagem" && slug.current == $slug][0] ${postProjection}
`);

export const publishedCategoriesQuery = defineQuery(`
  array::unique(*[
    _type == "postagem" &&
    editorialStatus == "published" &&
    defined(publishedAt) &&
    dateTime(publishedAt) <= dateTime(now()) &&
    defined(category->title)
  ].category->title)
`);
