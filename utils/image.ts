interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
  fit?: 'crop' | 'max';
}

const isAbsoluteHttpUrl = (value: string) => /^https?:\/\//i.test(value);

export const optimizeImageUrl = (source: string, options: OptimizeImageOptions = {}): string => {
  if (!source || !isAbsoluteHttpUrl(source)) {
    return source;
  }

  const {
    width,
    height,
    quality = 70,
    format = 'webp',
    fit = 'crop',
  } = options;

  try {
    const url = new URL(source);

    if (url.hostname.includes('images.unsplash.com')) {
      if (width) url.searchParams.set('w', String(width));
      if (height) url.searchParams.set('h', String(height));
      url.searchParams.set('fit', fit);
      url.searchParams.set('q', String(quality));
      url.searchParams.set('auto', 'format');

      if (format !== 'auto') {
        url.searchParams.set('fm', format);
      }

      return url.toString();
    }

    if (url.hostname.includes('picsum.photos')) {
      const segments = url.pathname.split('/').filter(Boolean);
      const segmentCount = segments.length;
      const hasSizeTail =
        segmentCount >= 2 &&
        /^\d+$/.test(segments[segmentCount - 1]) &&
        /^\d+$/.test(segments[segmentCount - 2]);

      if (hasSizeTail) {
        if (width) segments[segmentCount - 2] = String(width);
        if (height) segments[segmentCount - 1] = String(height);
        url.pathname = `/${segments.join('/')}`;
      }

      if (quality) url.searchParams.set('q', String(quality));
      if (format !== 'auto') {
        url.searchParams.set('fm', format);
      }

      return url.toString();
    }

    return source;
  } catch {
    return source;
  }
};
