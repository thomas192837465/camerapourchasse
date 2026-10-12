"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultContent } from "@/lib/defaults";
import SingleImageField from "@/components/admin/SingleImageField";
import IconPicker from "@/components/admin/IconPicker";
import FooterColumnsEditor from "@/components/admin/FooterColumnsEditor";
import ContentBlocksEditor from "@/components/admin/ContentBlocksEditor";
import TestimonialsEditor from "@/components/admin/TestimonialsEditor";
import { TrashIcon } from "@/components/Icons";

const PDP_TEXT_GROUPS = [
  {
    title: "Bloc d'achat",
    fields: [
      ["tiersTitle", "Titre des packs de quantité"],
      ["unitSingular", "Unité au singulier (ex : caméra)"],
      ["unitPlural", "Unité au pluriel (ex : caméras)"],
      ["perUnitText", "Prix unitaire sous un pack (avec {prix})"],
      ["addonPerUnitText", "Mention sous le prix de l'option en plus (ex : par caméra)"],
      ["formulaTitle", "Titre des formules (sous les packs)"],
      ["formulaChooseTitle", "Titre des formules (sans packs)"],
      ["formulaHint", "Petite aide sous les formules", true],
      ["stockLabel", "Mention de stock (vide = masquée)"],
      ["atcLabel", "Bouton d'achat"],
      ["atcAddedLabel", "Bouton après ajout"],
    ],
  },
  {
    title: "Encart garantie",
    fields: [
      ["guaranteeSealValue", "Chiffre du macaron (vide = pas de macaron)"],
      ["guaranteeSealUnit", "Unité du macaron"],
      ["guaranteeTitle", "Titre (vide = encart masqué)"],
      ["guaranteeText", "Texte", true],
    ],
  },
  {
    title: "Accordéons sous les photos",
    fields: [
      ["accDescriptionTitle", "Titre « Description »"],
      ["accSpecsTitle", "Titre « Caractéristiques »"],
      ["accInBoxTitle", "Titre « Dans la boîte »"],
      ["accShippingTitle", "Titre livraison (vide = masqué)"],
      ["accShippingText", "Texte livraison", true],
      ["accWarrantyTitle", "Titre garantie (vide = masqué)"],
      ["accWarrantyText", "Texte garantie", true],
    ],
  },
  {
    title: "Sections sous l'achat",
    fields: [
      ["statsEyebrow", "Chiffres clés — surtitre"],
      ["statsTitle", "Chiffres clés — titre (avec {produit})"],
      ["reviewsEyebrow", "Avis — surtitre"],
      ["reviewsTitle", "Avis — titre"],
      ["reviewsNote", "Avis — note sous la répartition", true],
      ["promiseEyebrow", "Engagements — surtitre"],
      ["promiseTitle", "Engagements — titre"],
      ["promiseLinkText", "Engagements — texte du lien"],
      ["faqEyebrow", "FAQ — surtitre"],
      ["faqTitle", "FAQ — titre"],
      ["faqContact", "FAQ — phrase de contact (avec {email})", true],
      ["finalEyebrow", "Rappel d'achat — surtitre"],
      ["finalSubline", "Rappel d'achat — ligne sous le nom"],
      ["finalCta", "Rappel d'achat — bouton"],
      ["relatedTitle", "Produits similaires — titre"],
    ],
  },
];

export default function ContentSettingsPage() {
  const [content, setContent] = useState(defaultContent);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("content").then((c) => {
      setContent(c);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("content", content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <p>Chargement…</p>;

  function set(field, value) {
    setContent((c) => ({ ...c, [field]: value }));
  }

  const pdpTexts = { ...defaultContent.pdpTexts, ...(content.pdpTexts || {}) };
  function setPdp(key, value) {
    setContent((c) => ({ ...c, pdpTexts: { ...defaultContent.pdpTexts, ...(c.pdpTexts || {}), [key]: value } }));
  }

  function updateListItem(field, index, value) {
    setContent((c) => ({ ...c, [field]: c[field].map((item, i) => (i === index ? value : item)) }));
  }

  function addListItem(field, item) {
    setContent((c) => ({ ...c, [field]: [...c[field], item] }));
  }

  function removeListItem(field, index) {
    setContent((c) => ({ ...c, [field]: c[field].filter((_, i) => i !== index) }));
  }

  function IconTextList({ field, itemPlaceholder }) {
    return (
      <>
        {content[field].map((item, i) => (
          <div className="repeatable-row" key={i}>
            <IconPicker value={item.icon} onChange={(icon) => updateListItem(field, i, { ...item, icon })} />
            <div className="form-field">
              <input
                placeholder="Titre"
                value={item.title}
                onChange={(e) => updateListItem(field, i, { ...item, title: e.target.value })}
              />
              <input
                placeholder={itemPlaceholder || "Description"}
                value={item.description}
                onChange={(e) => updateListItem(field, i, { ...item, description: e.target.value })}
                style={{ marginTop: 6 }}
              />
            </div>
            <button type="button" className="icon-btn" onClick={() => removeListItem(field, i)}>
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={() => addListItem(field, { icon: "star", title: "", description: "" })}>
          + Ajouter
        </button>
      </>
    );
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Contenu de la page d'accueil</h1>
          <p>Logo, hero, sections et pied de page.</p>
        </div>
      </div>

      <div className="admin-card">
        <h2>Logo (en-tête & pied de page)</h2>
        <div className="form-field">
          <label>Image du logo (facultative — sans image, un pictogramme caméra générique est utilisé)</label>
          <SingleImageField
            value={content.logoImage}
            onChange={(img) => set("logoImage", img)}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
        <div className="form-field">
          <label>Logo pour fond sombre (pied de page) — idéalement un PNG/SVG blanc sur fond transparent. Laisser vide : le logo principal est recoloré en blanc automatiquement.</label>
          <SingleImageField
            value={content.logoImageLight}
            onChange={(img) => set("logoImageLight", img)}
            altPlaceholder="Texte alternatif"
          />
        </div>
        <div className="form-field">
          <label>Bandeau d'annonce au-dessus du menu (séparez les messages par « · » — vide pour masquer)</label>
          <input
            value={content.announcementText}
            onChange={(e) => set("announcementText", e.target.value)}
            placeholder="ex : Garantie 2 ans · SAV basé en France · Paiement sécurisé"
          />
        </div>
        <div className="form-grid" style={{ marginTop: 10 }}>
          <div className="form-field">
            <label>Ligne 1</label>
            <input value={content.logoLine1} onChange={(e) => set("logoLine1", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Ligne 2</label>
            <input value={content.logoLine2} onChange={(e) => set("logoLine2", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Bannière d'accueil (hero)</h2>
        <div className="form-field">
          <label>Titre (H1 de la page d'accueil)</label>
          <textarea rows={2} value={content.homeHeroTitle} onChange={(e) => set("homeHeroTitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Sous-titre</label>
          <textarea rows={3} value={content.homeHeroSubtitle} onChange={(e) => set("homeHeroSubtitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Texte du bouton</label>
          <input value={content.homeHeroButton} onChange={(e) => set("homeHeroButton", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Photo du hero (à droite du texte — ex : une caméra de chasse)</label>
          <SingleImageField
            value={content.heroImage}
            onChange={(img) => set("heroImage", img)}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
        <div className="form-field">
          <label>Photo terrain plein écran (fond du hero — ex : caméra posée sur un arbre en forêt). Si vide : fond anthracite + photo produit ci-dessus.</label>
          <SingleImageField
            value={content.heroBackgroundImage}
            onChange={(img) => set("heroBackgroundImage", img)}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
        <div className="form-field">
          <label>Badge au-dessus du titre (ex : Marque française — vide pour masquer)</label>
          <input value={content.homeBadge} onChange={(e) => set("homeBadge", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Surtitre (petite ligne au-dessus du titre)</label>
          <input value={content.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label>Bouton secondaire — texte (vide pour masquer)</label>
            <input value={content.heroSecondaryText} onChange={(e) => set("heroSecondaryText", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Bouton secondaire — lien</label>
            <input value={content.heroSecondaryHref} onChange={(e) => set("heroSecondaryHref", e.target.value)} />
          </div>
        </div>
        <p className="form-hint">
          Astuce : dans le titre, la partie après « : » s'affiche en vert lime sur une nouvelle ligne.
        </p>
      </div>

      <div className="admin-card">
        <h2>Bande sous le hero (4 points forts)</h2>
        <IconTextList field="homeFeatures" />
      </div>

      <div className="admin-card">
        <h2>Section "Meilleures ventes"</h2>
        <div className="form-grid">
          <div className="form-field">
            <label>Surtitre</label>
            <input value={content.homeBestEyebrow} onChange={(e) => set("homeBestEyebrow", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Titre de la section</label>
            <input value={content.homeBestTitle} onChange={(e) => set("homeBestTitle", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Guide de choix "Quelle caméra pour votre terrain ?"</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Trois cartes qui orientent le visiteur selon son terrain. La photo de fond reprend celle de la catégorie
          vers laquelle pointe le lien (Catalogue → Catégories). Le bouton secondaire du hero pointe ici avec le
          lien « #choisir ».
        </p>
        <div className="form-grid">
          <div className="form-field">
            <label>Surtitre</label>
            <input value={content.homeUsageEyebrow} onChange={(e) => set("homeUsageEyebrow", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Titre</label>
            <input value={content.homeUsageTitle} onChange={(e) => set("homeUsageTitle", e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label>Chapô</label>
          <textarea rows={2} value={content.homeUsageSubtitle} onChange={(e) => set("homeUsageSubtitle", e.target.value)} />
        </div>
        {(content.homeUsageItems || []).map((item, i) => (
          <div className="admin-card" key={i} style={{ background: "var(--green-50)", marginTop: 12 }}>
            <div className="repeatable-row" style={{ alignItems: "flex-start" }}>
              <IconPicker value={item.icon} onChange={(icon) => updateListItem("homeUsageItems", i, { ...item, icon })} />
              <div className="form-field" style={{ flex: 1 }}>
                <div className="form-grid">
                  <input placeholder="Étiquette (ex : Réseau 4G)" value={item.tag} onChange={(e) => updateListItem("homeUsageItems", i, { ...item, tag: e.target.value })} />
                  <input placeholder="Titre" value={item.title} onChange={(e) => updateListItem("homeUsageItems", i, { ...item, title: e.target.value })} />
                </div>
                <textarea rows={2} placeholder="Texte" value={item.text} onChange={(e) => updateListItem("homeUsageItems", i, { ...item, text: e.target.value })} style={{ marginTop: 6 }} />
                <div className="form-grid" style={{ marginTop: 6 }}>
                  <input placeholder="Modèles conseillés (ex : WildTrail C40 · H40)" value={item.models} onChange={(e) => updateListItem("homeUsageItems", i, { ...item, models: e.target.value })} />
                  <input placeholder="Lien (ex : /produits/camera-de-chasse-solaire)" value={item.href} onChange={(e) => updateListItem("homeUsageItems", i, { ...item, href: e.target.value })} />
                </div>
              </div>
              <button type="button" className="icon-btn" onClick={() => removeListItem("homeUsageItems", i)}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="add-row-btn"
          onClick={() => addListItem("homeUsageItems", { icon: "camera", tag: "", title: "", text: "", models: "", href: "" })}
        >
          + Ajouter une carte
        </button>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="form-field">
            <label>Lien sous les cartes — texte (vide pour masquer)</label>
            <input value={content.homeUsageAccessoriesText} onChange={(e) => set("homeUsageAccessoriesText", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Lien sous les cartes — adresse</label>
            <input value={content.homeUsageAccessoriesHref} onChange={(e) => set("homeUsageAccessoriesHref", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Bande "Notre histoire"</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Le fondateur et les engagements de la marque. N'affichez que des faits que vous pouvez justifier.
        </p>
        <div className="form-grid">
          <div className="form-field">
            <label>Surtitre</label>
            <input value={content.homeStoryEyebrow} onChange={(e) => set("homeStoryEyebrow", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Titre</label>
            <input value={content.homeStoryTitle} onChange={(e) => set("homeStoryTitle", e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label>Texte (citation du fondateur)</label>
          <textarea rows={4} value={content.homeStoryText} onChange={(e) => set("homeStoryText", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Signature</label>
          <input value={content.homeStorySignature} onChange={(e) => set("homeStorySignature", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Photo (ex : Julien sur le terrain, une caméra posée en forêt). Si vide : la photo terrain du hero.</label>
          <SingleImageField
            value={content.homeStoryImage}
            onChange={(img) => set("homeStoryImage", img)}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
        <label style={{ display: "block", fontWeight: 600, margin: "12px 0 6px" }}>Engagements</label>
        <IconTextList field="homeStoryPoints" />
        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="form-field">
            <label>Bouton — texte</label>
            <input value={content.homeStoryCta} onChange={(e) => set("homeStoryCta", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Bouton — lien</label>
            <input value={content.homeStoryHref} onChange={(e) => set("homeStoryHref", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Bandeau de réassurance (livraison, garantie...)</h2>
        <IconTextList field="trustBadges" />
      </div>

      <div className="admin-card">
        <h2>Section "Ils nous ont fait confiance" (témoignages)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Affichée sur la page d'accueil sous forme de carrousel. La section reste masquée tant
          qu'aucun témoignage n'a été ajouté — n'ajoutez que des avis réels de vos clients.
        </p>
        <div className="form-grid">
          <div className="form-field">
            <label>Titre de la section</label>
            <input value={content.testimonialsTitle} onChange={(e) => set("testimonialsTitle", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Note moyenne affichée (sur 5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={content.testimonialsRating}
              onChange={(e) => set("testimonialsRating", Number(e.target.value))}
            />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <TestimonialsEditor testimonials={content.testimonials} onChange={(testimonials) => set("testimonials", testimonials)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Panier latéral</h2>
        <div className="form-field">
          <label>Bandeau promotionnel (laisser vide pour le masquer)</label>
          <input
            placeholder='ex : "Bonus nouveaux clients : Économisez 10% avec le code : START"'
            value={content.cartBannerText}
            onChange={(e) => set("cartBannerText", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Seuil de livraison gratuite en euros (0 pour masquer la barre de progression)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={content.freeShippingThreshold}
            onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
          />
          <span className="form-hint">
            Affiche "Plus que X € pour profiter de la livraison gratuite" avec une barre de progression. Le même
            seuil doit être réglé dans Shopify (Paramètres → Expédition → tarif gratuit à partir de X €).
          </span>
        </div>
        <div className="form-field">
          <label>Logos de paiement affichés sous le bouton (cochez uniquement ceux acceptés au paiement)</label>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              ["cb", "Carte Bancaire"],
              ["visa", "Visa"],
              ["mastercard", "Mastercard"],
              ["paypal", "PayPal"],
            ].map(([key, label]) => {
              const list = content.paymentMethods || [];
              return (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={list.includes(key)}
                    onChange={(e) =>
                      set(
                        "paymentMethods",
                        e.target.checked ? [...list, key] : list.filter((k) => k !== key)
                      )
                    }
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Popup de bienvenue (code promo)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          S'affiche une seule fois par visiteur (mémorisé dans son navigateur), avec un bouton pour recevoir un
          code de réduction par e-mail — l'adresse est ajoutée à la liste d'inscrits.
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={content.promoPopupEnabled}
            onChange={(e) => set("promoPopupEnabled", e.target.checked)}
          />
          Activer la popup
        </label>
        <div className="form-field">
          <label>Code promo envoyé par e-mail</label>
          <input value={content.promoPopupCode} onChange={(e) => set("promoPopupCode", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Montant de la réduction en euros (affiché dans le panier quand le client a le code)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={content.promoCodeValue ?? 5}
            onChange={(e) => set("promoCodeValue", Number(e.target.value))}
          />
          <span className="form-hint">
            Ce code doit exister comme vraie réduction dans Shopify (Réductions) pour s'appliquer au paiement —
            créez-le à l'identique là-bas.
          </span>
        </div>
      </div>

      <div className="admin-card">
        <h2>Fiche produit — textes communs</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Ces textes s'affichent sur toutes les fiches produit. Laisser un titre vide masque l'élément. Dans les
          textes, {"{prix}"}, {"{produit}"} et {"{email}"} sont remplacés automatiquement.
        </p>
        {PDP_TEXT_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: "0.95rem", margin: "6px 0 10px" }}>{group.title}</h3>
            <div className="form-grid">
              {group.fields.map(([key, label, long]) => (
                <div className={`form-field${long ? " full" : ""}`} key={key}>
                  <label>{label}</label>
                  {long ? (
                    <textarea rows={3} value={pdpTexts[key] || ""} onChange={(e) => setPdp(key, e.target.value)} />
                  ) : (
                    <input value={pdpTexts[key] || ""} onChange={(e) => setPdp(key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <h3 style={{ fontSize: "0.95rem", margin: "6px 0 10px" }}>Petites mentions sous le bouton d&apos;achat</h3>
        {(pdpTexts.microTrust || []).map((m, i) => (
          <div className="repeatable-row" key={i}>
            <div className="form-field">
              <input
                value={m}
                onChange={(e) => setPdp("microTrust", pdpTexts.microTrust.map((x, j) => (j === i ? e.target.value : x)))}
              />
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setPdp("microTrust", pdpTexts.microTrust.filter((_, j) => j !== i))}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={() => setPdp("microTrust", [...(pdpTexts.microTrust || []), ""])}>
          + Ajouter une mention
        </button>
      </div>

      <div className="admin-card">
        <h2>Encart « -5 € » sous le bouton d'achat (fiches produit)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Le visiteur laisse son e-mail, reçoit le code ci-dessus et le code est appliqué automatiquement au
          paiement Shopify.
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={content.promoInlineEnabled !== false}
            onChange={(e) => set("promoInlineEnabled", e.target.checked)}
          />
          Afficher l'encart
        </label>
        <div className="form-grid">
          <div className="form-field">
            <label>Étiquette (ex : -5 €)</label>
            <input value={content.promoInlineAmountLabel} onChange={(e) => set("promoInlineAmountLabel", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Titre</label>
            <input value={content.promoInlineTitle} onChange={(e) => set("promoInlineTitle", e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label>Texte</label>
          <input value={content.promoInlineText} onChange={(e) => set("promoInlineText", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Packs de quantité (1, 2, 3 caméras)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          <strong>Important :</strong> chaque remise doit être créée à l'identique dans Shopify (Remises → remise
          automatique, « Montant sur les produits », quantité minimale 2 ou 3, en %). Sans ça, le client voit le
          prix remisé sur le site mais paie le prix plein.
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={content.qtyTiersEnabled !== false}
            onChange={(e) => set("qtyTiersEnabled", e.target.checked)}
          />
          Afficher les packs sur les fiches produit
        </label>
        {(content.qtyTiers || []).map((tier, i) => (
          <div className="repeatable-row" key={i}>
            <div className="form-field">
              <input
                type="number"
                min="1"
                placeholder="Quantité"
                value={tier.qty}
                onChange={(e) => updateListItem("qtyTiers", i, { ...tier, qty: Number(e.target.value) })}
              />
            </div>
            <div className="form-field">
              <input
                type="number"
                min="0"
                max="90"
                placeholder="Remise %"
                value={tier.discountPct}
                onChange={(e) => updateListItem("qtyTiers", i, { ...tier, discountPct: Number(e.target.value) })}
              />
            </div>
            <div className="form-field">
              <input
                placeholder="Badge (ex : Le plus choisi)"
                value={tier.badge}
                onChange={(e) => updateListItem("qtyTiers", i, { ...tier, badge: e.target.value })}
              />
            </div>
            <div className="form-field">
              <input
                placeholder="Petite ligne (palier 1, ex : Pour un poste)"
                value={tier.label || ""}
                onChange={(e) => updateListItem("qtyTiers", i, { ...tier, label: e.target.value })}
              />
            </div>
            <button type="button" className="icon-btn" onClick={() => removeListItem("qtyTiers", i)}>
              <TrashIcon />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-row-btn"
          onClick={() => addListItem("qtyTiers", { qty: (content.qtyTiers?.length || 0) + 1, discountPct: 0, badge: "", label: "" })}
        >
          + Ajouter un palier
        </button>
      </div>

      <div className="admin-card">
        <h2>Pied de page</h2>
        <div className="form-field">
          <label>Description sous le logo</label>
          <textarea rows={2} value={content.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Titre du bloc newsletter</label>
          <input value={content.newsletterTitle} onChange={(e) => set("newsletterTitle", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Colonnes de liens du pied de page</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          La colonne "Légal" (Mentions légales / CGV) est ajoutée automatiquement et ne se modifie pas ici.
        </p>
        <FooterColumnsEditor columns={content.footerColumns} onChange={(footerColumns) => set("footerColumns", footerColumns)} />
      </div>

      <div className="admin-card">
        <h2>Contenu bas de page d'accueil</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Texte long (guide, législation, FAQ) sous les avis clients. Masqué par défaut : le contenu reste enregistré
          ici et peut être réaffiché à tout moment.
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={content.homeBlocksVisible === true}
            onChange={(e) => set("homeBlocksVisible", e.target.checked)}
          />
          Afficher ce contenu sur la page d&apos;accueil
        </label>
        <ContentBlocksEditor blocks={content.homeBlocks} onChange={(blocks) => set("homeBlocks", blocks)} />
      </div>

      <div className="admin-card">
        <h2>Page "Livraison"</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Visible sur /livraison. Les textes entre [crochets] sont des exemples : remplacez-les par vos vraies
          informations avant publication.
        </p>
        <ContentBlocksEditor blocks={content.livraisonBlocks} onChange={(blocks) => set("livraisonBlocks", blocks)} />
      </div>

      <div className="admin-card">
        <h2>Page "Notre histoire"</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Visible sur /notre-histoire. Les textes entre [crochets] sont des exemples : remplacez-les par vos vraies
          informations avant publication.
        </p>
        <ContentBlocksEditor blocks={content.histoireBlocks} onChange={(blocks) => set("histoireBlocks", blocks)} />
      </div>

      <div className="admin-card">
        <h2>Page "Blog"</h2>
        <div className="form-field">
          <label>Titre du bandeau</label>
          <input value={content.blogPageTitle} onChange={(e) => set("blogPageTitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Sous-titre du bandeau</label>
          <textarea rows={2} value={content.blogPageSubtitle} onChange={(e) => set("blogPageSubtitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Chapô (texte d'intro affiché sous le bandeau, hors recherche)</label>
          <textarea rows={4} value={content.blogPageIntro} onChange={(e) => set("blogPageIntro", e.target.value)} />
        </div>
        <p className="form-hint">
          La catégorie de chaque article (affichée en badge et listée avec son nombre d'articles dans la barre
          latérale) se règle sur chaque article, dans Blog → modifier l'article.
        </p>
        <div className="form-field">
          <label>Encart "à propos" (barre latérale d'un article) — titre</label>
          <input value={content.blogAboutTitle} onChange={(e) => set("blogAboutTitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Encart "à propos" — texte</label>
          <textarea rows={2} value={content.blogAboutText} onChange={(e) => set("blogAboutText", e.target.value)} />
        </div>
        <p className="form-hint">Cet encart renvoie vers la page "Notre histoire".</p>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
