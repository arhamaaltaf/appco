import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Search, Users, DollarSign, TrendingUp, UserPlus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ADMIN_TOKEN_KEY,
  getAdminStats,
  getAdminSubscribers,
  type PlanId,
  type Subscriber,
} from "@/lib/admin-api";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Forge ERP" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      navigate({ to: "/admin/login" });
      return;
    }
    setAuthed(true);
  }, [navigate]);

  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
    enabled: authed === true,
  });
  const subsQuery = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: getAdminSubscribers,
    enabled: authed === true,
  });

  const [q, setQ] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | PlanId>("all");

  const filtered = useMemo(() => {
    const list = subsQuery.data ?? [];
    return list.filter((s) => {
      if (planFilter !== "all" && s.plan !== planFilter) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return s.companyName.toLowerCase().includes(needle) || s.email.toLowerCase().includes(needle);
    });
  }, [subsQuery.data, q, planFilter]);

  function signOut() {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate({ to: "/admin/login" });
  }

  if (authed !== true) return null;

  const stats = statsQuery.data;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Internal</p>
          <h1 className="font-display text-3xl font-semibold">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscribers, plans, and revenue at a glance.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total subscribers"
          value={stats ? stats.totalSubscribers.toString() : "—"}
          hint={stats ? `${stats.activeSubscribers} active` : ""}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="MRR"
          value={stats ? formatCurrency(stats.mrr) : "—"}
          hint="Monthly recurring"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="ARR"
          value={stats ? formatCurrency(stats.arr) : "—"}
          hint="Annualized"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="New this month"
          value={stats ? stats.newThisMonth.toString() : "—"}
          hint={stats ? `${(stats.churnRate * 100).toFixed(1)}% churn` : ""}
          icon={<UserPlus className="h-4 w-4" />}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Revenue (last 12 months)</h2>
            <span className="text-xs text-muted-foreground">USD</span>
          </div>
          {stats ? <RevenueChart data={stats.revenueByMonth} /> : <ChartSkeleton />}
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Plan breakdown</h2>
          {stats ? (
            <div className="space-y-4">
              {stats.planBreakdown.map((b) => {
                const total = stats.planBreakdown.reduce((s, x) => s + x.mrr, 0) || 1;
                const pct = (b.mrr / total) * 100;
                return (
                  <div key={b.plan}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-foreground">{b.plan}</span>
                      <span className="text-muted-foreground">
                        {b.count} · {formatCurrency(b.mrr)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-gradient-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-6">
          <div>
            <h2 className="font-display text-lg font-semibold">Subscribers</h2>
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {subsQuery.data?.length ?? 0}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search company or email"
                className="w-64 pl-8"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as typeof planFilter)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="all">All plans</option>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Seats</TableHead>
                <TableHead className="text-right">MRR</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Instance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subsQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Loading subscribers...
                  </TableCell>
                </TableRow>
              )}
              {!subsQuery.isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No subscribers match your filters.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((s) => (
                <SubscriberRow key={s.id} s={s} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function SubscriberRow({ s }: { s: Subscriber }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{s.companyName}</TableCell>
      <TableCell className="text-muted-foreground">{s.email}</TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-xs capitalize">
          {s.plan}
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge status={s.status} />
      </TableCell>
      <TableCell className="text-right tabular-nums">{s.seats}</TableCell>
      <TableCell className="text-right tabular-nums">{formatCurrency(s.mrr)}</TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(s.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <a
          href={s.siteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      </TableCell>
    </TableRow>
  );
}

function StatusBadge({ status }: { status: Subscriber["status"] }) {
  const cls: Record<Subscriber["status"], string> = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    provisioning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    past_due: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    canceled: "bg-muted text-muted-foreground border-border",
  };
  const label = status === "past_due" ? "Past due" : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls[status]}`}>
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface">{icon}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex h-56 items-end gap-2">
      {data.map((d) => {
        const h = (d.revenue / max) * 100;
        return (
          <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-accent transition-all group-hover:opacity-80"
                style={{ height: `${h}%` }}
                title={formatCurrency(d.revenue)}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-56 animate-pulse rounded bg-muted" />;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
