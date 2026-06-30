export default function Page() {
      return (
            <div className="min-h-screen bg-[#070D18] px-6 py-16">
                  <div className="mx-auto max-w-3xl">
                        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
                        <div className="space-y-4 text-slate-400 leading-relaxed">
                              <p>
                                    By creating an account on BloodBridge, you agree to use this platform responsibly to
                                    request, offer, or coordinate blood donations. Donation requests should be created in
                                    good faith with accurate information.
                              </p>
                              <p>
                                    Misuse of the platform — including fraudulent requests, harassment of donors, or
                                    sharing of contact information for purposes outside blood donation coordination — may
                                    result in account suspension.
                              </p>
                              <p>
                                    BloodBridge facilitates connections between donors and recipients but does not provide
                                    medical advice or guarantee donor availability. Always consult a medical professional
                                    for guidance on blood donation eligibility and safety.
                              </p>
                        </div>
                  </div>
            </div>
      );
}