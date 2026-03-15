import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const leaderboardRow = tv({
	base: "flex flex-col overflow-hidden border-b border-border-primary",
});

type LeaderboardRowRootProps = ComponentProps<"div">;

function LeaderboardRowRoot({ className, ...props }: LeaderboardRowRootProps) {
	return <div className={leaderboardRow({ className })} {...props} />;
}

type LeaderboardRowRankProps = ComponentProps<"span"> & {
	highlight?: boolean;
};

function LeaderboardRowRank({
	highlight,
	className,
	...props
}: LeaderboardRowRankProps) {
	return (
		<span
			className={`font-mono text-sm font-bold ${highlight ? "text-accent-amber" : "text-text-tertiary"} ${className ?? ""}`}
			{...props}
		/>
	);
}

type LeaderboardRowScoreProps = ComponentProps<"span">;

function LeaderboardRowScore({
	className,
	...props
}: LeaderboardRowScoreProps) {
	return (
		<span
			className={`font-mono text-sm font-bold text-accent-red ${className ?? ""}`}
			{...props}
		/>
	);
}

type LeaderboardRowMetaProps = ComponentProps<"div">;

function LeaderboardRowMeta({ className, ...props }: LeaderboardRowMetaProps) {
	return (
		<div
			className={`flex h-12 items-center justify-between border-b border-border-primary px-5 ${className ?? ""}`}
			{...props}
		/>
	);
}

type LeaderboardRowCodeProps = ComponentProps<"div">;

function LeaderboardRowCode({ className, ...props }: LeaderboardRowCodeProps) {
	return (
		<div
			className={`w-full min-w-0 ${className ?? ""}`}
			{...props}
		/>
	);
}

type LeaderboardRowCodeLineProps = ComponentProps<"span"> & {
	comment?: boolean;
};

function LeaderboardRowCodeLine({
	comment,
	className,
	...props
}: LeaderboardRowCodeLineProps) {
	return (
		<span
			className={`font-mono text-xs ${comment ? "text-text-muted" : "text-text-primary"} ${className ?? ""}`}
			{...props}
		/>
	);
}

type LeaderboardRowLanguageProps = ComponentProps<"span">;

function LeaderboardRowLanguage({
	className,
	...props
}: LeaderboardRowLanguageProps) {
	return (
		<span
			className={`font-mono text-xs text-text-secondary ${className ?? ""}`}
			{...props}
		/>
	);
}

const LeaderboardRow = Object.assign(LeaderboardRowRoot, {
	Meta: LeaderboardRowMeta,
	Rank: LeaderboardRowRank,
	Score: LeaderboardRowScore,
	Code: LeaderboardRowCode,
	CodeLine: LeaderboardRowCodeLine,
	Language: LeaderboardRowLanguage,
});

export {
	LeaderboardRow,
	leaderboardRow,
	type LeaderboardRowRootProps,
	type LeaderboardRowMetaProps,
	type LeaderboardRowRankProps,
	type LeaderboardRowScoreProps,
	type LeaderboardRowCodeProps,
	type LeaderboardRowCodeLineProps,
	type LeaderboardRowLanguageProps,
};
