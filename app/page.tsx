import { fetchProduct } from "@/controller/product.controller";
import Products from "../components/Products";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: `Ecom - ${process.env.DOMAIN}`,
  description: "India's best and affordable ecommerce website",
  keyword: "ecom, ecom.com",
  openGraph: {
    title: `Ecom - ${process.env.DOMAIN}`,
    description: "India's best and affordable ecommerce website",
    url: process.env.DOMAIN,
    siteName: "Ecom",
    images: [
      {
        url: "/images/logo.png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const HomeRouter = async () => {
  const data = await fetchProduct();
  return <Products data={data} />;
};

export default HomeRouter;
