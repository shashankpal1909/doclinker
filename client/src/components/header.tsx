import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AppDispatch } from "@/app/store";

import ModeToggle from "@/components/mode-toggle";

import { userReducer } from "@/features/auth/slice";
import { signOut } from "@/features/auth/thunks";

import { Button } from "./ui/button";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(userReducer);

  return (
    <header className="bg-opacity-20 backdrop-filter backdrop-blur-lg border-b border-gray-300 dark:border-gray-700">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-4">
        <div className="flex items-center flex-shrink-0 mr-6">
          <Link to={"/"}>
            <h1 className="text-2xl font-semibold">DocLinker</h1>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          {user && (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                dispatch(signOut());
              }}
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
