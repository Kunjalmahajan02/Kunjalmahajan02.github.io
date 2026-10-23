const base = import.meta.env.BASE_URL;

// Mini Kunjal, cut from the reference illustration (see tools/make_mascot.py).
export default function Mascot({ line, className = '' }) {
  return (
    <figure className={`mascot ${className}`}>
      <div className="mascot__window">
        <picture>
          <source
            type="image/webp"
            srcSet={`${base}mascot/mini-kunjal.webp 351w, ${base}mascot/mini-kunjal@2x.webp 702w`}
            sizes="(max-width: 760px) 62vw, 320px"
          />
          <img
            src={`${base}mascot/mini-kunjal.png`}
            alt="Mini Kunjal — an illustrated girl with long dark wavy hair and oversized black sunglasses, resting her chin on her hands beside a laptop covered in planet stickers."
            width="351"
            height="462"
            fetchpriority="high"
          />
        </picture>
      </div>
      {line && (
        <figcaption className="mascot__bubble">
          <span className="mono mascot__tag">GUIDE · MINI KUNJAL</span>
          {line}
        </figcaption>
      )}
    </figure>
  );
}
