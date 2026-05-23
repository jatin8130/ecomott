import Signup from "@/components/Signup";

export const metadata = {
  title: "Signup - Ecom",
  description: "Signup or register with your ecom account",
  keyword:
    "ecom login, ecom signin, ecom account login, ecom signup, ecom register, ecom new account",
  openGraph: {
    title: "Signup - Ecom",
    description: "Signup or register with your ecom account",
    url: `${process.env.DOMAIN}/signup`,
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

const SignupRouter = () => {
  return <Signup />;
};

export default SignupRouter;
