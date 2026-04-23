import { SignIn } from "@clerk/nextjs";
import { Flame } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-amber-900 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3 mb-8 text-white">
        <Flame className="w-8 h-8 text-amber-300" />
        <div>
          <div className="text-xl font-bold">Chimney Inspection Pro</div>
          <div className="text-xs text-amber-300">NFPA 211 · CSIA Standards</div>
        </div>
      </div>
      <SignIn />
    </div>
  );
}
