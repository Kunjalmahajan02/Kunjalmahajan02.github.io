const base = import.meta.env.BASE_URL;

// An illustration from public/art (built by tools/make_art.py). `widths` are
// the exported sizes, e.g. art/hero-1100.webp, art/hero-1800.webp …
export default function Art({ name, widths, alt = '', sizes = '100vw', className = '', eager = false, width, height }) {
  const srcSet = widths.map((w) => `${base}art/${name}-${w}.webp ${w}w`).join(', ');
  return (
    <img
      className={className}
      src={`${base}art/${name}-${widths[widths.length - 1]}.webp`}
      srcSet={widths.length > 1 ? srcSet : undefined}
      sizes={widths.length > 1 ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      draggable="false"
    />
  );
}
