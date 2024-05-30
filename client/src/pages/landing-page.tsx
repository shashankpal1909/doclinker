import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

function LandingPage() {
  return (
    <div className="flex flex-grow justify-center items-center">
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            Welcome to <span className="text-primary">DocLinker</span>
          </h1>
          <div className="text-justify my-8">
            The ultimate platform that revolutionizes the way patients connect
            with doctors. Our website seamlessly bridges the gap between
            healthcare providers and patients, offering a user-friendly
            interface for effortless appointment booking. Say goodbye to long
            waiting times and tedious scheduling processes. With DocLinker,
            patients can quickly find and book appointments with their preferred
            doctors, ensuring timely and efficient healthcare access. Experience
            the convenience of modern healthcare with DocLinker, where your
            health is just a click away.
          </div>
          <div className="flex gap-4 justify-center mb-8">
            <Button asChild className="rounded-full">
              <Link to={"/sign-up"}>Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
