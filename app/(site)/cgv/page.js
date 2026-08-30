import { getSettings } from "@/lib/settings";
import LegalField from "@/components/LegalField";

export const metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente du site.",
};

export default async function CgvPage() {
  const legal = await getSettings("legal");
  const returnAddress = legal.returnAddress || legal.address;

  return (
    <main className="container">
      <h1 className="page-title">Conditions Générales de Vente</h1>
      <div className="legal-content">
        <section>
          <h2>Article 1 — Objet et champ d'application</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes réalisées sur ce site par{" "}
            <LegalField value={legal.companyName} placeholder="nom / raison sociale" />
            {legal.siret ? (
              <>
                {" "}
                (SIRET <LegalField value={legal.siret} placeholder="SIRET" />)
              </>
            ) : null}
            , dont le siège est situé <LegalField value={legal.address} placeholder="adresse du siège" />. Toute
            commande passée sur le site implique l'acceptation sans réserve des présentes CGV par le client.
          </p>
        </section>

        <section>
          <h2>Article 2 — Produits et prix</h2>
          <p>
            Les produits proposés sont ceux figurant sur le site au jour de la consultation, dans la limite des
            stocks disponibles. Les prix sont indiqués en euros, toutes taxes comprises (TTC). Le vendeur se réserve
            le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui affiché au
            moment de la commande.
          </p>
        </section>

        <section>
          <h2>Article 3 — Commande</h2>
          <p>
            Le client sélectionne les produits souhaités, les ajoute à son panier puis valide sa commande en
            renseignant ses coordonnées de livraison. Un récapitulatif de la commande (produits, quantités, prix,
            frais de livraison) est présenté avant validation définitive.
          </p>
        </section>

        <section>
          <h2>Article 4 — Paiement</h2>
          <p>
            Au jour de la rédaction des présentes CGV, le règlement des commandes s'effectue à réception ou par
            virement bancaire, les coordonnées étant communiquées au client après validation de sa commande. Un
            moyen de paiement en ligne pourra être proposé ultérieurement.
          </p>
        </section>

        <section>
          <h2>Article 5 — Livraison</h2>
          <p>
            Les produits sont livrés à l'adresse indiquée par le client lors de la commande, dans les délais
            précisés sur la fiche produit ou communiqués lors de la confirmation de commande. En cas de retard
            important, le client en est informé dans les meilleurs délais.
          </p>
        </section>

        <section>
          <h2>Article 6 — Droit de rétractation</h2>
          <p>
            Conformément aux articles L221-18 et suivants du Code de la consommation, le client dispose d'un délai
            de <strong>14 jours</strong> à compter de la réception du produit pour exercer son droit de
            rétractation, sans avoir à justifier de motif ni à payer de pénalité, à l'exception des frais de retour
            qui restent à sa charge.
          </p>
          <p>
            Pour exercer ce droit, le client notifie sa décision par écrit à{" "}
            <LegalField value={legal.email} placeholder="e-mail de contact" /> puis retourne le produit, dans son
            état d'origine, à l'adresse suivante : <LegalField value={returnAddress} placeholder="adresse de retour" />
            . Le remboursement intervient dans un délai de 14 jours suivant la réception du produit retourné.
          </p>
        </section>

        <section>
          <h2>Article 7 — Garanties légales</h2>
          <p>
            Tout produit vendu bénéficie de la garantie légale de conformité (articles L217-3 et suivants du Code
            de la consommation) et de la garantie légale contre les vices cachés (articles 1641 et suivants du Code
            civil). À ce titre, le client peut décider de mettre en œuvre la garantie contre les défauts de
            conformité et adresser une réclamation au vendeur, sans avoir à démontrer l'existence du défaut de
            conformité pendant les 24 mois suivant la délivrance du bien.
          </p>
        </section>

        <section>
          <h2>Article 8 — Responsabilité</h2>
          <p>
            Le vendeur ne saurait être tenu responsable de l'inexécution du contrat en cas de force majeure, de
            perturbation ou grève des services postaux ou de transport, ou en cas de faute du client.
          </p>
        </section>

        <section>
          <h2>Article 9 — Médiation et litiges</h2>
          <p>
            En cas de litige, le client est invité à contacter en priorité le vendeur à{" "}
            <LegalField value={legal.email} placeholder="e-mail de contact" /> afin de rechercher une solution
            amiable. À défaut d'accord, conformément à l'article L616-1 du Code de la consommation, le client peut
            recourir gratuitement à un service de médiation de la consommation, dont les coordonnées lui seront
            communiquées sur demande. Les présentes CGV sont soumises au droit français.
          </p>
        </section>

        {legal.cgvExtra ? (
          <section>
            <p style={{ whiteSpace: "pre-wrap" }}>{legal.cgvExtra}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
