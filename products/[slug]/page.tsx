import Slug from "@/components/Slug";
import SlugInterface from "@/interfaces/slug.interface";

export const generateMetadata = async ({ params }: SlugInterface) => {
  const { slug } = await params;

  const slugRes = await fetch(`${process.env.SERVER}/api/product/${slug}`);

  const data = slugRes.ok ? await slugRes.json() : null;

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

  const slugRes = await fetch(`${process.env.SERVER}/api/product/${slug}`);

  const data = slugRes.ok ? await slugRes.json() : null;

  return <Slug data={data} />;
};

export default SlugRouter;

export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.SERVER}/product?slug=true`);

  const sluglist = await res.json();

  return sluglist.map((slug: string) => ({
    slug: slug,
  }));
};
