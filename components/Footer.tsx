import Link from "next/link";

import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="py-6 w-full bg-neutral-800 text-white">
      <div className="container">
        <Link href="/">
          <Logo />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
