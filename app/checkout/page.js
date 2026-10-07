import CheckoutFlow from "@/components/checkout/CheckoutFlow";

export const metadata = {
  title: "Checkout | Centinel",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-[70vh] bg-paper pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-page">
        <CheckoutFlow />
      </div>
    </main>
  );
}
