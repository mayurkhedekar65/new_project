import React from "react";

const SignIn = () => {
  return (
    <>
      <main className="bg-gradient-to-br from-primary via-blue-600 to-accent grid place-items-center h-screen border">
        <div className=" bg-white text-center  pt-20 pb-20 pr-10 pl-10 rounded-2xl">
          <h3 className="capitalize text-[32px] mb-10 text-black font-bold">
            login
          </h3>
          <form action="" className="text-center">
            <div>
              <input
                className="border w-100 h-14 mb-10 rounded-xl pl-5 placeholder:capitalize"
                type="text"
                placeholder="username"
              />
            </div>
            <div>
              <input
                className="border w-100 h-14 mb-10 rounded-xl pl-5 placeholder:capitalize"
                type="text"
                placeholder="password"
              />
            </div>
            <div>
              <button className="bg-accent bg-cyan-500 text-white font-semibold capitalize border pt-3 pb-3 pr-40 pl-40 rounded-xl text-lg">
                submit
              </button>
            </div>
            <div className="flex justify-center items-center gap-2 capitalize mt-3">
              <div>
                <p>don't have an account ?</p>
              </div>
              <div>
                <button className="capitalize">signup</button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};
export default SignIn;
