import { getSettings } from "@/lib/settings";
import LegalField from "@/components/LegalField";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site.",
};

export default async function MentionsLegalesPage() {
  const legal = await getSettings("legal");

  return (
    <main className="container">
      <h1 className="page-title">Mentions légales</h1>
      <div className="legal-content">
        <section>
          <h2>Éditeur du site</h2>
          <p>
            Le présent site est édité par{" "}
            <LegalField value={legal.companyName} placeholder="nom / raison sociale" />
            {legal.legalForm ? `, ${legal.legalForm}` : ""}
            {legal.siret ? (
              <>
                , immatriculé(e) sous le numéro SIRET <LegalField value={legal.siret} placeholder="SIRET" />
              </>
            ) : null}
            {legal.rcs ? ` (${legal.rcs})` : ""}.
          </p>
          <p>
            Siège social : <LegalField value={legal.address} placeholder="adresse du siège" />
            <br />
            E-mail : <LegalField value={legal.email} placeholder="e-mail de contact" />
            {legal.phone ? (
              <>
                <br />
                Téléphone : {legal.phone}
              </>
            ) : null}
          </p>
          <p>
            Directeur de la publication :{" "}
            <LegalField value={legal.publicationDirector || legal.companyName} placeholder="directeur de la publication" />
          </p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p>
            Ce site est hébergé par <LegalField value={legal.hostName} placeholder="nom de l'hébergeur" />
            {legal.hostAddress ? `, ${legal.hostAddress}` : ""}.
          </p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos, structure) est protégé par le droit de la
            propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation
            préalable, est interdite et constituerait une contrefaçon sanctionnée par le Code de la propriété
            intellectuelle.
          </p>
        </section>

        <section>
          <h2>Données personnelles</h2>
          <p>
            Les informations collectées via ce site (formulaire de commande, création de compte) sont nécessaires
            au traitement de votre commande et ne sont ni vendues ni transmises à des tiers en dehors de ce qui est
            strictement nécessaire à la livraison et au paiement. Conformément au Règlement Général sur la
            Protection des Données (RGPD) et à la loi « Informatique et Libertés », vous disposez d'un droit
            d'accès, de rectification, d'effacement et d'opposition sur vos données, exerçable en écrivant à{" "}
            <LegalField value={legal.email} placeholder="e-mail de contact" />.
          </p>
        </section>

        {legal.mentionsExtra ? (
          <section>
            <p style={{ whiteSpace: "pre-wrap" }}>{legal.mentionsExtra}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
