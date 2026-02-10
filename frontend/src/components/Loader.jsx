import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_center,_#1d4ed8_0%,_#0b3aa6_35%,_#081f4d_65%,_#030712_100%)]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <span className="w-3 h-12 bg-[#FE9D1B]/70 rounded-md animate-pulse [animation-delay:0s]" />
          <span className="w-3 h-12 bg-[#FE9D1B]/80 rounded-md animate-pulse [animation-delay:0.15s]" />
          <span className="w-3 h-12 bg-[#FE9D1B]/90 rounded-md animate-pulse [animation-delay:0.3s]" />
          <span className="w-3 h-12 bg-[#FE9D1B]/100 rounded-md animate-pulse [animation-delay:0.45s]" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
