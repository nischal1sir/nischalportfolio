import { useEffect } from 'react';

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

interface PageMeta {
  title: string;
  description: string;
  path?: string;
}

const SITE_NAME = 'Nischal Rai | Developer';
const DEFAULT_OG_IMAGE = '/favicon.svg';

export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | Nischal Rai`;
    document.title = fullTitle;
    const url = path ? `${window.location.origin}${import.meta.env.BASE_URL}#${path}` : window.location.href;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', DEFAULT_OG_IMAGE);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
  }, [title, description, path]);
}
