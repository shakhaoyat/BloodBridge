export default function Page() {
  return (
    <div className="min-h-screen bg-[#070D18] px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-slate-400 leading-relaxed">
          <p>
            BloodBridge collects the information you provide during registration — name, email,
            blood group, location, and avatar — to operate the donation request and donor search
            features of the platform.
          </p>
          <p>
            When you confirm a donation or create a donation request, your name and email may be
            shared with the other party involved (donor ↔ requester) so they can coordinate
            directly. This information is not shared with anyone else.
          </p>
          <p>
            Your password is stored securely and is never visible to BloodBridge staff. You can
            update or remove your profile information at any time from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}