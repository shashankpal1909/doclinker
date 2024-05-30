import { Link } from "react-router-dom";

import ModeToggle from "@/components/mode-toggle";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="bg-opacity-20 backdrop-filter backdrop-blur-lg border-b border-gray-300 dark:border-gray-700">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-4">
        <div className="flex items-center flex-shrink-0 mr-6">
          <Link to={"/"}>
            <h1 className="text-2xl font-semibold">DocLinker</h1>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
