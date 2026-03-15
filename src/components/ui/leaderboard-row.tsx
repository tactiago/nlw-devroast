import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const leaderboardRow = tv({
	base: "flex flex-col gap-0 border-b border-border-primary pt-4 pb-0",
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
			className={`w-12 font-mono text-xs ${highlight ? "text-accent-amber" : "text-text-tertiary"} ${className ?? ""}`}
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
			className={`w-16 font-mono text-xs font-bold text-accent-red ${className ?? ""}`}
			{...props}
		/>
	);
}

type LeaderboardRowMetaProps = ComponentProps<"div">;

function LeaderboardRowMeta({ className, ...props }: LeaderboardRowMetaProps) {
	return (
		<div
			className={`flex items-center gap-6 px-5 mb-2 ${className ?? ""}`}
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
			className={`ml-auto w-24 text-right font-mono text-xs text-text-secondary ${className ?? ""}`}
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
