import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickManagementLinksCardProps {
  isMerchantOwner: boolean;
}

export function QuickManagementLinksCard({ isMerchantOwner }: QuickManagementLinksCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60">
        <CardTitle className="text-sm font-semibold text-foreground">
          {isMerchantOwner ? "Business & Subscription Management" : "Organization Navigation"}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {isMerchantOwner
            ? "Access regulatory compliance, invoices, and organization settings"
            : "Quick links to your branch outlet and brands"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 flex flex-col gap-2">
        {isMerchantOwner ? (
          <>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate("/merchant")}
              className="justify-between text-xs h-9"
            >
              <span>Merchant Legal Profile & FSSAI</span>
              <span className="text-muted-foreground text-[11px]">→</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate("/subscription")}
              className="justify-between text-xs h-9"
            >
              <span>Subscription Plan & Invoices</span>
              <span className="text-muted-foreground text-[11px]">→</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate("/branches")}
              className="justify-between text-xs h-9"
            >
              <span>Branch Outlets & Locations</span>
              <span className="text-muted-foreground text-[11px]">→</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate("/brands")}
              className="justify-between text-xs h-9"
            >
              <span>Brand Identities & Cuisines</span>
              <span className="text-muted-foreground text-[11px]">→</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate("/finances")}
              className="justify-between text-xs h-9"
            >
              <span>Commission Ledger & Settlements</span>
              <span className="text-muted-foreground text-[11px]">→</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate("/branches")}
              className="justify-between text-xs h-9"
            >
              <span>My Assigned Outlet Profile</span>
              <span className="text-muted-foreground text-[11px]">→</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate("/brands")}
              className="justify-between text-xs h-9"
            >
              <span>Assigned Outlet Brand Profile</span>
              <span className="text-muted-foreground text-[11px]">→</span>
            </Button>
            <p className="text-[11px] text-muted-foreground pt-1 m-0">
              Merchant entity registration, subscription tiers, and financial bank payouts are
              configured by your Merchant Owner.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
