// app/api/screenshot/route.ts (Next.js 14 App Router)
import { NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";

export const dynamic = "force-dynamic"; // Ensure the route is dynamic

const IS_DEV = process.env.NODE_ENV !== "production";

export async function GET() {
	try {
		// Launch a browser instance
		const executablePath = IS_DEV
			? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
			: await chromiumBinary.executablePath();

		// launch browser with external Chromium
		const browser = await chromium.launch({
			args: chromiumBinary.args,
			executablePath: executablePath,
			headless: true,
		});

		// Create a new page with mobile viewport
		const context = await browser.newContext({
			viewport: { width: 375, height: 667 }, // iPhone SE dimensions (example)
			deviceScaleFactor: 2, // High DPI for better quality
			isMobile: true,
		});
		const page = await context.newPage();

		try {
			// Navigate to the page, wait for network idle
			await page.goto(
				IS_DEV ? "http://localhost:3000" : "https://dolary.vercel.app",
				{ waitUntil: "networkidle" },
			);

			// Take a screenshot of the full page
			const screenshotBuffer = await page.screenshot({ fullPage: true });

			// Set response headers
			const headers = new Headers();
			headers.set("Content-Type", "image/png");
			headers.set("Content-Disposition", 'inline; filename="dolary.png"');

			// Close the browser
			await browser.close();

			// Return the screenshot
			return new NextResponse(screenshotBuffer, {
				status: 200,
				headers: headers,
			});
		} catch (pageError) {
			console.error("Error during page navigation/screenshot:", pageError);
			await browser.close(); // Ensure browser is closed on error
			return NextResponse.json(
				{ error: "Failed to capture screenshot on the page" },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Error launching browser:", error);
		return NextResponse.json(
			{ error: "Failed to launch browser" },
			{ status: 500 },
		);
	}
}
