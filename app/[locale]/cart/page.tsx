import CartPageContent from "@/components/cart/cart-page-content";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  return <CartPageContent locale={locale} currencyLabel="MMK" />;
}