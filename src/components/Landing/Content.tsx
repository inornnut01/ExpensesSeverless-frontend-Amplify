import { Button } from "../ui/button";

const Content = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-start">
        <div className="flex flex-col items-center justify-center gap-4 p-20">
          <h1 className="text-4xl font-bold text-blue-500 tracking-wide">
            Expense Tracker Serverless
          </h1>
          <p className="text-blue-400">Easily track anything, anytime!</p>
        </div>
      </div>
      <div className="flex items-center justify-start">
        <div className="flex gap-4">
          <Button>Get Started</Button>
          <Button variant={"outline"}>Learn More</Button>
        </div>
      </div>

      <div className="py-20">
        <img
          className="w-full h-full object-cover"
          src="https://lh5.googleusercontent.com/proxy/dmyk5NXFVUv-s5cnP5bfLeGpBmZmGRPi-cRTYQuisWd8waWlavJ5CEaUQ8flvt8nA0rl6fLSNIPgbfLpSwQRDMwOYpotw8DK-HGw4RjjHrRbFDWvtQ8HCeOYA82qQmU"
          alt="Content"
        />
        {/* TODO: after finish dashborad, add the image here */}
      </div>
    </div>
  );
};

export default Content;
