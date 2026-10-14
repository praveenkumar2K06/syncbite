import { C } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { RestaurantAuthForm } from "@/components/login/LoginForm";

export interface LoginScreenProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function LoginScreen({ onSubmit }: LoginScreenProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-7">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.green} 0%, #166534 100%)`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: C.white,
              marginBottom: 12,
              boxShadow: "0 2px 12px rgba(21,128,61,.4)",
            }}
          >
            S
          </div>
          <p className="text-lg font-semibold text-surface mb-1">SyncBite</p>
          <p className="text-sm text-white/45 mb-0">Restaurant Portal</p>
        </div>
        <Card className="bg-card border-border shadow-2xl">
          <CardContent className="p-6">
            <RestaurantAuthForm onSubmit={onSubmit} />
          </CardContent>
        </Card>
        <p className="text-center mt-4 text-sm text-white/30">Registered restaurant owners only.</p>
      </div>
    </div>
  );
}
