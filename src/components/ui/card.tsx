import type * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
      data-slot="card"
			className={cn(
				"rounded-base shadow-shadow border-2 border-border bg-main text-main-foreground font-base",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
      data-slot="card-header"
			className={cn("flex flex-col space-y-1.5 p-6 px-3", className)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading leading-none", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm font-base", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0 px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0 px-3 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
};
