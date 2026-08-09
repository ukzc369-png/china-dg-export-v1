export function getProductSlug(pathname: string): string | null {
  const match = pathname.match(/^\/products\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function productPath(slug: string): string {
  return `/products/${encodeURIComponent(slug)}`;
}
