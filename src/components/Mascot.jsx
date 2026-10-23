const base = import.meta.env.BASE_URL;

// Mini Kunjal, cut out of the reference illustration (tools/make_mascot.py)
// with a transparent background and a rose rim light from the sun's side.
export default function Mascot({ line }) {
  return (
    <figure className="mascot">
      <picture>
        <source
          type="image/webp"
          srcSet={`${base}mascot/mini-kunjal.webp 495w, ${base}mascot/mini-kunjal@2x.webp 991w`}
          sizes="(max-width: 700px) 70vw, 32vw"
        />
        <img
          src={`${base}mascot/mini-kunjal.png`}
          alt="Mini Kunjal — an illustrated girl with long dark wavy hair and oversized black sunglasses, chin in her hands, at a laptop covered in planet stickers that reads Kunjal.exe."
          width="495"
          height="413"
          fetchpriority="high"
          draggable="false"
        />
      </picture>
      {line && (
        <figcaption className="mascot__bubble">
          <span className="mono mascot__tag">GUIDE · MINI KUNJAL</span>
          {line}
        </figcaption>
      )}
    </figure>
  );
}
