// Pink window chrome from the reference board: a title bar with an icon,
// the title, and three decorative window lights (or a real close button).
export default function Win({ title, icon = '✦', onClose, className = '', children, bodyClass = 'win__body', labelledBy, ...rest }) {
  return (
    <section className={`win ${className}`} aria-labelledby={labelledBy} {...rest}>
      <div className="win__bar">
        <span className="win__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="win__title">{title}</span>
        {onClose ? (
          <button type="button" className="win__close" onClick={onClose} aria-label={`Close ${title}`}>
            ×
          </button>
        ) : (
          <span className="win__lights" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        )}
      </div>
      <div className={bodyClass}>{children}</div>
    </section>
  );
}
