import CartView from "@/components/CartView";

export const metadata = {
  title: "Votre panier",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
