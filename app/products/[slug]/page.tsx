import Slug from "@/components/Slug";
import {
  fetchProductBySlugs,
  fetchProductSlugs,
} from "@/controller/product.controller";
import SlugInterface from "@/interfaces/slug.interface";

export const generateMetadata = async ({ params }: SlugInterface) => {
  const { slug } = await params;

  const data = await fetchProductBySlugs(slug);

  return {
    title: data ? `Ecom - ${data.title}` : "Ecom",
    description: data ? `Ecom - ${data.description}` : "Ecom",
    keyword: "ecom product",
    openGraph: {
      title: data ? `Ecom - ${data.title}` : "Ecom",
      description: data ? `Ecom - ${data.description}` : "Ecom",
      url: `${process.env.DOMAIN}/product/${slug}`,
      siteName: "Ecom",
      images: [
        {
          url: data ? data.image : "/images/logo.png",
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
};

const SlugRouter = async ({ params }: SlugInterface) => {
  const { slug } = await params;

  const data = await fetchProductBySlugs(slug);

  return <Slug data={data} />;
};

export default SlugRouter;

export const generateStaticParams = async () => {
  const sluglist = await fetchProductSlugs();

  return sluglist.map((slug: string) => ({
    slug: slug,
  }));
};
