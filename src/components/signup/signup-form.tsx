import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PlanId } from "@/lib/api";

const schema = z.object({
  companyName: z.string().trim().min(2, "Company name is required").max(100),
  email: z.string().trim().email("Enter a valid work email").max(255),
  password: z.string().min(8, "At least 8 characters").max(200),
  plan: z.enum(["starter", "growth", "enterprise"]),
});

export type SignupFormValues = z.infer<typeof schema>;

const plans: { id: PlanId; label: string; price: string }[] = [
  { id: "starter", label: "Starter", price: "€49/mo" },
  { id: "growth", label: "Growth", price: "€149/mo" },
  { id: "enterprise", label: "Enterprise", price: "€449/mo" },
];

export function SignupForm({
  defaultPlan = "growth",
  submitting,
  onSubmit,
}: {
  defaultPlan?: PlanId;
  submitting: boolean;
  onSubmit: (v: SignupFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { plan: defaultPlan, companyName: "", email: "", password: "" },
  });

  const plan = watch("plan");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input id="companyName" placeholder="Acme GmbH" {...register("companyName")} />
        {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@acme.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Create a password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          aria-describedby="signup-password-help"
          {...register("password")}
        />
        <p id="signup-password-help" className="text-xs text-muted-foreground">
          Use this password to sign in after your workspace is ready.
        </p>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Plan</Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {plans.map((p) => {
            const active = plan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setValue("plan", p.id, { shouldValidate: true })}
                className={`rounded-lg border p-3 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border bg-surface hover:border-primary/40"
                }`}
              >
                <div className="text-sm font-medium text-foreground">{p.label}</div>
                <div className="text-xs text-muted-foreground">{p.price}</div>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-accent text-primary-foreground shadow-glow"
        size="lg"
      >
        {submitting ? "Creating your workspace…" : "Start free trial"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account, you agree to our Terms and Privacy Policy.
      </p>
    </form>
  );
}
