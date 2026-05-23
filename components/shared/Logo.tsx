import Image from "next/image";

const Logo = () => {
  return (
    <div className="py-2">
      <Image
        src="/images/logo.png"
        width={70}
        height={30}
        alt="logo"
        className="h-auto w-auto"
        loading="eager"
      />
    </div>
  );
};

export default Logo;
