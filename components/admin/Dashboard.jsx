"use client";
import React from "react";
import Link from "next/link";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
} from "recharts";
import { FileText, Globe, Video, PartyPopper, Palette, RefreshCw, AlertCircle } from "lucide-react";
import { Card, Badge, PageHeader, Skeleton, EmptyState, secondaryBtn, friendlyError } from "./ui";
import { useDashboard } from "./hooks";

/* Chart tokens (light surface). Series use the first three categorical slots in fixed order;
   that trio is validated for colorblind separation. */
const SERIES = [
    { key: "blogs", label: "Blogs", color: "#2a78d6" },
    { key: "portfolio", label: "Portfolio", color: "#eb6834" },
    { key: "reviews", label: "Video reviews", color: "#1baf7a" },
];
const INK_MUTED = "#898781";
const GRID = "#e1e0d9";
const SURFACE = "#ffffff";
const TICK = { fill: INK_MUTED, fontSize: 11 };

const monthDate = (key) => new Date(`${key}-01T00:00:00.000Z`);
const monthShort = (key) => monthDate(key).toLocaleString("en-US", { month: "short", timeZone: "UTC" });
const monthLong = (key) => monthDate(key).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const formatDateTime = (value) =>
    new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/* ---------- Pieces ---------- */

const ChartCard = ({ title, description, legend, children, className = "" }) => (
    <Card className={`p-4 sm:p-5 min-w-0 ${className}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="min-w-0">
                <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
                {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
            </div>
            {legend}
        </div>
        {children}
    </Card>
);

const Legend = () => (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-600">
        {SERIES.map((s) => (
            <li key={s.key} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: s.color }} aria-hidden="true" />
                {s.label}
            </li>
        ))}
    </ul>
);

const TooltipBox = ({ title, rows }) => (
    <div className="rounded-md border border-stone-200 bg-white px-3 py-2 shadow-lg text-xs min-w-36">
        <p className="font-medium text-stone-900 mb-1.5">{title}</p>
        <ul className="space-y-1">
            {rows.map(({ label, value, color }) => (
                <li key={label} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-stone-600">
                        {color && <span className="size-2 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />}
                        {label}
                    </span>
                    <span className="font-medium text-stone-900 tabular-nums">{value}</span>
                </li>
            ))}
        </ul>
    </div>
);

const MonthlyTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    const added = SERIES.reduce((sum, s) => sum + row[s.key], 0);
    return (
        <TooltipBox
            title={monthLong(label)}
            rows={[
                ...SERIES.map((s) => ({ label: s.label, value: row[s.key], color: s.color })),
                { label: "Total added", value: added },
            ]}
        />
    );
};

const GrowthTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return <TooltipBox title={monthLong(label)} rows={[{ label: "Total items", value: payload[0].value, color: SERIES[0].color }]} />;
};

const CategoryTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    return <TooltipBox title={row.name} rows={[{ label: "Posts", value: row.count, color: SERIES[0].color }]} />;
};

const StatTile = ({ icon: Icon, label, value, note, href }) => (
    <Link
        href={href}
        className="group block bg-white border border-stone-200 rounded-lg shadow-xs p-4 hover:border-stone-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
    >
        <div className="flex items-center justify-between gap-2 text-stone-500">
            <span className="text-xs font-medium">{label}</span>
            <Icon size={15} className="shrink-0 group-hover:text-stone-900 transition-colors" />
        </div>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{value}</p>
        {note && <p className="mt-1 text-xs text-stone-500 truncate">{note}</p>}
    </Link>
);

const addedNote = (n) => (n > 0 ? `+${n} in the last 30 days` : "Nothing new in 30 days");

const DashboardSkeleton = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[104px]" />
            ))}
        </div>
        <Skeleton className="h-[340px]" />
        <div className="grid lg:grid-cols-2 gap-4">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
        </div>
    </div>
);

/* ---------- Page ---------- */

const Dashboard = () => {
    const { data, error, isLoading, isValidating, mutate } = useDashboard();

    const refreshButton = (
        <button type="button" onClick={() => mutate()} disabled={isValidating} className={secondaryBtn}>
            <RefreshCw size={15} className={isValidating ? "animate-spin" : ""} />
            Refresh
        </button>
    );

    const header = (
        <PageHeader
            title="Dashboard"
            description={data ? `Live numbers from the database · updated ${formatDateTime(data.generatedAt)}` : "Live numbers from the database"}
            actions={refreshButton}
        />
    );

    if (isLoading) {
        return (
            <>
                {header}
                <DashboardSkeleton />
            </>
        );
    }

    if (!data) {
        return (
            <>
                {header}
                <EmptyState
                    icon={AlertCircle}
                    title="Couldn't load the dashboard"
                    description={friendlyError(error, "The dashboard data could not be loaded.")}
                    action={refreshButton}
                />
            </>
        );
    }

    const { totals, last30, monthly, categories, reviewSources, activeEvent, recent } = data;
    const addedInWindow = monthly.reduce((sum, m) => sum + m.blogs + m.portfolio + m.reviews, 0);

    return (
        <>
            {header}

            {error && (
                <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    Showing the last loaded numbers. {friendlyError(error)}
                </p>
            )}

            {/* Totals */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                <StatTile icon={FileText} label="Blog posts" value={totals.blogs} note={addedNote(last30.blogs)} href="/admin" />
                <StatTile icon={Globe} label="Portfolio sites" value={totals.portfolio} note={addedNote(last30.portfolio)} href="/admin/portfolio" />
                <StatTile icon={Video} label="Video reviews" value={totals.reviews} note={addedNote(last30.reviews)} href="/admin/video-reviews" />
                <StatTile
                    icon={PartyPopper}
                    label="Events"
                    value={totals.events}
                    note={activeEvent ? `Live: ${activeEvent.name}` : "No event live"}
                    href="/admin/events"
                />
                <StatTile icon={Palette} label="Color palettes" value={totals.palettes} note="Saved announcement presets" href="/admin/events" />
            </div>

            {/* Monthly additions */}
            <ChartCard
                title="Content added per month"
                description={`Last 12 months · ${addedInWindow} item${addedInWindow === 1 ? "" : "s"} added`}
                legend={<Legend />}
                className="mb-4"
            >
                <ResponsiveContainer width="100%" height={260} initialDimension={{ width: 800, height: 260 }}>
                    <BarChart data={monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke={GRID} />
                        <XAxis dataKey="month" tickFormatter={monthShort} tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} interval="preserveStartEnd" minTickGap={8} />
                        <YAxis allowDecimals={false} tick={TICK} tickLine={false} axisLine={false} width={44} />
                        <Tooltip content={<MonthlyTooltip />} cursor={{ fill: "#f5f5f4" }} />
                        {SERIES.map((s, i) => (
                            <Bar
                                key={s.key}
                                dataKey={s.key}
                                name={s.label}
                                stackId="added"
                                fill={s.color}
                                stroke={SURFACE}
                                strokeWidth={2}
                                maxBarSize={36}
                                radius={i === SERIES.length - 1 ? [4, 4, 0, 0] : 0}
                                isAnimationActive={false}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>

                <details className="mt-3 text-xs">
                    <summary className="cursor-pointer text-stone-500 hover:text-stone-900 w-fit">Show as table</summary>
                    <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-left tabular-nums">
                            <thead className="text-stone-500">
                                <tr className="border-b border-stone-200">
                                    <th className="py-1.5 pr-3 font-medium">Month</th>
                                    {SERIES.map((s) => (
                                        <th key={s.key} className="py-1.5 pr-3 font-medium text-right">{s.label}</th>
                                    ))}
                                    <th className="py-1.5 font-medium text-right">Running total</th>
                                </tr>
                            </thead>
                            <tbody className="text-stone-700">
                                {monthly.map((m) => (
                                    <tr key={m.month} className="border-b border-stone-100 last:border-0">
                                        <td className="py-1.5 pr-3">{monthLong(m.month)}</td>
                                        {SERIES.map((s) => (
                                            <td key={s.key} className="py-1.5 pr-3 text-right">{m[s.key]}</td>
                                        ))}
                                        <td className="py-1.5 text-right">{m.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            </ChartCard>

            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                {/* Running total */}
                <ChartCard title="Total content over time" description="Blogs, portfolio sites and video reviews combined">
                    <ResponsiveContainer width="100%" height={220} initialDimension={{ width: 500, height: 220 }}>
                        <LineChart data={monthly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke={GRID} />
                            <XAxis dataKey="month" tickFormatter={monthShort} tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} interval="preserveStartEnd" minTickGap={8} />
                            <YAxis allowDecimals={false} tick={TICK} tickLine={false} axisLine={false} width={44} />
                            <Tooltip content={<GrowthTooltip />} cursor={{ stroke: INK_MUTED, strokeDasharray: "3 3" }} />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke={SERIES[0].color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, stroke: SURFACE, strokeWidth: 2 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Blog categories */}
                <ChartCard title="Blog posts by category" description={`${totals.blogs} post${totals.blogs === 1 ? "" : "s"} in total`}>
                    {categories.length ? (
                        <ResponsiveContainer
                            width="100%"
                            height={Math.max(120, categories.length * 34)}
                            initialDimension={{ width: 500, height: Math.max(120, categories.length * 34) }}
                        >
                            <BarChart data={categories} layout="vertical" margin={{ top: 0, right: 32, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide allowDecimals={false} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={110}
                                    tick={{ ...TICK, fill: "#57534e" }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => (v.length > 16 ? `${v.slice(0, 15)}…` : v)}
                                />
                                <Tooltip content={<CategoryTooltip />} cursor={{ fill: "#f5f5f4" }} />
                                <Bar dataKey="count" fill={SERIES[0].color} radius={[0, 4, 4, 0]} maxBarSize={18} isAnimationActive={false}>
                                    <LabelList dataKey="count" position="right" style={{ fill: "#57534e", fontSize: 11 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-stone-500 py-10 text-center">No blog posts yet.</p>
                    )}
                </ChartCard>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                {/* Recent activity */}
                <Card className="lg:col-span-2 min-w-0">
                    <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
                        <h2 className="text-sm font-semibold text-stone-900">Recently added</h2>
                        <p className="text-xs text-stone-500 mt-0.5">Latest items across all content types</p>
                    </div>
                    {recent.length ? (
                        <ul className="divide-y divide-stone-100">
                            {recent.map((item, i) => {
                                const external = item.href.startsWith("http");
                                return (
                                    <li key={`${item.type}-${item.href}-${i}`}>
                                        <Link
                                            href={item.href}
                                            target={external || item.type === "Blog" ? "_blank" : undefined}
                                            rel={external ? "noopener noreferrer" : undefined}
                                            className="flex items-center gap-3 px-4 sm:px-5 py-2.5 hover:bg-stone-50 transition-colors"
                                        >
                                            <Badge className="w-[92px] justify-center">{item.type}</Badge>
                                            <span className="flex-1 min-w-0 truncate text-sm text-stone-900">{item.title}</span>
                                            <span className="shrink-0 text-xs text-stone-500 tabular-nums">{formatDate(item.createdAt)}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="px-5 pb-6 text-sm text-stone-500">Nothing added yet.</p>
                    )}
                </Card>

                <div className="space-y-4 min-w-0">
                    {/* Live event */}
                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold text-stone-900">Live event</h2>
                            {activeEvent ? <Badge variant="success">Live</Badge> : <Badge>Off</Badge>}
                        </div>
                        {activeEvent ? (
                            <dl className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between gap-3">
                                    <dt className="text-stone-500">Name</dt>
                                    <dd className="text-stone-900 font-medium text-right truncate">{activeEvent.name}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-stone-500">Offer</dt>
                                    <dd className="text-stone-900 text-right">{activeEvent.offer || "None"}</dd>
                                </div>
                                {activeEvent.discountPercent > 0 && (
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-stone-500">Price discount</dt>
                                        <dd className="text-stone-900 text-right">{activeEvent.discountPercent}%</dd>
                                    </div>
                                )}
                                <div className="flex justify-between gap-3">
                                    <dt className="text-stone-500">Announcement</dt>
                                    <dd className="text-stone-900 text-right">{activeEvent.announcement ? "On" : "Off"}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-stone-500">Last edited</dt>
                                    <dd className="text-stone-900 text-right">{formatDate(activeEvent.updatedAt)}</dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="mt-2 text-sm text-stone-500">The default hero is showing on the site.</p>
                        )}
                        <Link href="/admin/events" className="mt-4 inline-block text-xs font-medium text-stone-900 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-900">
                            Manage events
                        </Link>
                    </Card>

                    {/* Review videos */}
                    <Card className="p-4 sm:p-5">
                        <h2 className="text-sm font-semibold text-stone-900">Video reviews</h2>
                        <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between gap-3">
                                <dt className="text-stone-500">YouTube links</dt>
                                <dd className="text-stone-900 font-medium tabular-nums">{reviewSources.youtube}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-stone-500">Uploaded videos</dt>
                                <dd className="text-stone-900 font-medium tabular-nums">{reviewSources.uploaded}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-stone-500">With a poster image</dt>
                                <dd className="text-stone-900 font-medium tabular-nums">
                                    {reviewSources.withPoster} of {totals.reviews}
                                </dd>
                            </div>
                        </dl>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
