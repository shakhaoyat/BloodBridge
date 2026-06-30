"use client";

import Link from "next/link";

const HomePage = () => {
      return (
            <main className="bg-[#070D18]-to-br text-white from-red-50 via-white to-rose-100">
                  {/* Hero Section */}
                  <section className="container mx-auto flex min-h-[90vh] items-center px-6 py-16">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                              {/* Left Content */}
                              <div>
                                    <span className="inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
                                          ❤️ Donate Blood, Save Lives
                                    </span>

                                    <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
                                          Become a Hero.
                                          <br />
                                          <span className="text-red-600">Donate Blood Today.</span>
                                    </h1>

                                    <p className="mt-6 max-w-lg text-lg text-gray-600">
                                          Join our blood donor community and help save lives. Find blood
                                          donors instantly or register yourself as a donor to support
                                          patients in need.
                                    </p>

                                    <div className="mt-10 flex flex-wrap gap-4">
                                          <Link
                                                href="/register"
                                                className="rounded-lg bg-red-600 px-7 py-3 font-semibold text-white shadow-lg transition duration-300 hover:bg-red-700"
                                          >
                                                Join as a Donor
                                          </Link>

                                          <Link
                                                href="/search-donor"
                                                className="rounded-lg border-2 border-red-600 px-7 py-3 font-semibold text-red-600 transition duration-300 hover:bg-red-600 hover:text-white"
                                          >
                                                Search Donors
                                          </Link>
                                    </div>
                              </div>

                              {/* Right Content */}
                              <div className="flex justify-center">
                                    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                                          <div className="flex justify-center">
                                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-5xl">
                                                      🩸
                                                </div>
                                          </div>

                                          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                                                Every Drop Matters
                                          </h2>

                                          <p className="mt-4 text-center text-gray-600">
                                                One blood donation can save up to three lives. Be someone's
                                                hero by becoming a blood donor today.
                                          </p>

                                          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                                                <div className="rounded-xl bg-red-50 p-4">
                                                      <h3 className="text-2xl font-bold text-red-600">24/7</h3>
                                                      <p className="text-sm text-gray-500">Support</p>
                                                </div>

                                                <div className="rounded-xl bg-red-50 p-4">
                                                      <h3 className="text-2xl font-bold text-red-600">100%</h3>
                                                      <p className="text-sm text-gray-500">Free</p>
                                                </div>

                                                <div className="rounded-xl bg-red-50 p-4">
                                                      <h3 className="text-2xl font-bold text-red-600">❤️</h3>
                                                      <p className="text-sm text-gray-500">Care</p>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>
            </main>
      );
};

export default HomePage;