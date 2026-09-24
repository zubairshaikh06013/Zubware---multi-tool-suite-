import React, { useEffect } from 'react';
import { ToolMeta, FAQItem, BreadcrumbItem } from '../types';

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToSchema {
  name: string;
  description?: string;
  steps: HowToStep[];
}

export interface ArticleSchemaData {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName: string;
  authorUrl?: string;
  section?: string;
  tags?: string[];
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  lang?: string;
  toolMeta?: ToolMeta;
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  howTo?: HowToSchema;
  article?: ArticleSchemaData;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogType,
  ogImage,
  lang = 'en',
  toolMeta,
  faqs = [],
  breadcrumbs = [],
  howTo,
  article
}) => {
  const domain = 'https://zubware.com';
  const cleanPath = canonicalPath === '/' ? '' : (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`);
  const fullUrl = `${domain}${cleanPath}`;
  const defaultOgImage = `${domain}/icon.png`;
  const imageToUse = ogImage || defaultOgImage;
  const effectiveOgType = ogType || (article ? 'article' : 'website');

  useEffect(() => {
    // 1. Language attribute
    document.documentElement.lang = lang;

    // 2. Title
    document.title = title;

    // Helper to set meta tag
    const setMeta = (nameAttr: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper for link rel
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute(rel, rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Meta directives
    setMeta('name', 'description', description);
    if (toolMeta?.tags && toolMeta.tags.length > 0) {
      setMeta('name', 'keywords', toolMeta.tags.join(', '));
    }
    setMeta('name', 'robots', robots);
    setMeta('name', 'googlebot', robots);
    // Google Search Console verification token for Zubware
    // To set your Google Search Console token, define VITE_GOOGLE_SITE_VERIFICATION in .env or provide it directly
    const googleSiteVerification = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_SITE_VERIFICATION) || '';
    if (googleSiteVerification) {
      setMeta('name', 'google-site-verification', googleSiteVerification);
    }

    // Canonical URL
    setLink('canonical', fullUrl);

    // OpenGraph
    setMeta('property', 'og:site_name', 'Zubware');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullUrl);
    setMeta('property', 'og:type', effectiveOgType);
    setMeta('property', 'og:image', imageToUse);

    if (article) {
      if (article.publishedTime) {
        setMeta('property', 'article:published_time', article.publishedTime);
      }
      if (article.modifiedTime) {
        setMeta('property', 'article:modified_time', article.modifiedTime);
      }
      if (article.authorName) {
        setMeta('property', 'article:author', article.authorName);
      }
      if (article.section) {
        setMeta('property', 'article:section', article.section);
      }
    }

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageToUse);

    // JSON-LD Schemas
    const schemas: object[] = [
      // WebSite (Clean site entity)
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Zubware',
        'url': domain
      },
      // Organization Entity
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Zubware',
        'url': domain,
        'logo': `${domain}/icon.png`,
        'description': 'Zubware is a multi-tool suite offering 300+ free online browser-based tools for PDF, images, developers, and productivity.'
      }
    ];

    // Tool SoftwareApplication / WebApplication Schema
    if (toolMeta) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': toolMeta.title,
        'url': fullUrl,
        'operatingSystem': 'All',
        'applicationCategory': toolMeta.category === '🖼️ Image Tools' ? 'MultimediaApplication' : (toolMeta.category === '📄 PDF Tools' ? 'PDFApplication' : 'UtilitiesApplication'),
        'browserRequirements': 'Requires HTML5 and JavaScript support',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'featureList': toolMeta.features?.join(', ') || 'Browser-Based Processing, Free',
        'keywords': toolMeta.tags?.join(', ') || '',
        'description': toolMeta.description
      });
    }

    // FAQ Schema
    if (faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      });
    }

    // HowTo Schema
    if (howTo && howTo.steps.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': howTo.name,
        'description': howTo.description,
        'step': howTo.steps.map((st, idx) => ({
          '@type': 'HowToStep',
          'position': idx + 1,
          'name': st.name,
          'itemListElement': [
            {
              '@type': 'HowToDirection',
              'text': st.text
            }
          ]
        }))
      });
    }

    // Breadcrumb Schema
    if (breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': crumb.label,
          'item': crumb.path ? `${domain}${crumb.path.startsWith('/') ? crumb.path : '/' + crumb.path}` : fullUrl
        }))
      });
    }

    // Article Schema
    if (article) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.title,
        'description': article.description,
        'datePublished': article.publishedTime,
        'dateModified': article.modifiedTime || article.publishedTime,
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': fullUrl
        },
        'author': {
          '@type': 'Organization',
          'name': article.authorName,
          'url': article.authorUrl || domain
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Zubware',
          'url': domain,
          'logo': {
            '@type': 'ImageObject',
            'url': `${domain}/icon.png`
          }
        },
        'image': imageToUse,
        'keywords': article.tags && article.tags.length > 0 ? article.tags.join(', ') : undefined
      });
    }

    // Inject Script JSON-LD with standard @graph container
    let scriptEl = document.getElementById('json-ld-schema');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'json-ld-schema';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    const graphSchema = {
      '@context': 'https://schema.org',
      '@graph': schemas.map((s: any) => {
        const { '@context': _ctx, ...rest } = s;
        return rest;
      })
    };
    scriptEl.textContent = JSON.stringify(graphSchema);

  }, [title, description, robots, effectiveOgType, imageToUse, lang, fullUrl, toolMeta, faqs, breadcrumbs, howTo, article]);

  return null;
};

