import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MerchantFormFields, type MerchantFormData } from "./MerchantFormFields";

interface MerchantOnboardingFormProps {
  form: MerchantFormData;
  onChange: (fields: Partial<MerchantFormData>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}

export function MerchantOnboardingForm({
  form,
  onChange,
  onSubmit,
  submitting,
}: MerchantOnboardingFormProps) {
  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs">
            Step 1 of 1
          </Badge>
          <CardTitle className="text-base font-bold">Submit Merchant Application</CardTitle>
        </div>
        <CardDescription className="text-xs">
          To start receiving orders and accepting payments, submit your restaurant business profile
          for approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <MerchantFormFields form={form} onChange={onChange} />
          <Separator />
          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={submitting} className="font-bold text-xs px-6 h-9">
              {submitting ? "Submitting Application…" : "Submit Application for Approval"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
