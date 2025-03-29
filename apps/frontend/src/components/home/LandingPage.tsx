import { MoveRight, PhoneCall } from "lucide-react";
import BlurText from "../ui/blur-text";
import { Button } from "../ui/button";
import { HeroGeometric } from "../ui/shape-landing-hero";

const LandingPage = () => {
  return (
    <>
      <HeroGeometric
        badge="Get Product Delivery Directy at you Dorms"
        title1="BID - Buy, Interact and Deal"
        title2="Community Marketplace"
      />
      <div className="bg-black flex flex-row justify-center gap-3 text-black">
        <Button size="lg" className="gap-4" variant="outline">
          Jump on a call <PhoneCall className="w-4 h-4" />
        </Button>
        <Button size="lg" className="gap-4">
          Sign up here <MoveRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="bg-black text-white flex justify-center align-middle text-center min-h-screen items-center font-bold">
        <BlurText
          text="Isn't this so cool?!"
          delay={150}
          animateBy="words"
          direction="top"
          // onAnimationComplete={handleAnimationComplete}
          className="text-[8rem] mb-8"
        />
      </div>
    </>
  );
};

export default LandingPage;
