import CheckoutView from "@/components/CheckoutView";

export const metadata = {
  title: "Finaliser la commande",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
