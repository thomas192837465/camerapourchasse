import TrustRating from "./TrustRating";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";

export default function ReviewsList({ reviews, rating }) {
  const valid = (reviews || []).filter((r) => r.name && r.text);

  return (
    <div>
      <TrustRating average={rating?.average || 0} count={rating?.count || 0} size="lg" />

      {valid.length ? (
        <div className="review-list" style={{ marginTop: 20 }}>
          {valid.map((r, i) => (
            <div className="review" key={r.id || i}>
              {r.avatar?.url ? (
                <img className="review-avatar-img" src={cloudinaryTransform(r.avatar.url, "w_100,q_auto,f_auto")} alt="" />
              ) : (
                <span className="avatar">{r.name.slice(0, 2).toUpperCase()}</span>
              )}
              <div>
                <div className="review-head">
                  <strong>{r.name}</strong>
                </div>
                <TrustRating average={r.rating || 0} showLabel={false} size="sm" />
                <p style={{ marginTop: 6 }}>{r.text}</p>
                {r.photos?.filter((p) => p.url).length ? (
                  <div className="review-photos">
                    {r.photos
                      .filter((p) => p.url)
                      .map((p, pi) => (
                        <img
                          className="review-photo"
                          src={cloudinaryTransform(p.url, "w_150,q_auto,f_auto")}
                          alt={p.alt || ""}
                          key={pi}
                        />
                      ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: 14, color: "var(--ink-soft)" }}>Aucun avis pour le moment.</p>
      )}
    </div>
  );
}
