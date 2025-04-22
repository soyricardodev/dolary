// app/api/screenshot/route.ts (Next.js 14 App Router)
import { NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // Ensure the route is dynamic

const IS_DEV = process.env.NODE_ENV !== "production";
const SCREENSHOT_PATH = path.join(process.cwd(), "public", "screenshot.png");

// Function to generate and save screenshot - non-blocking
export async function generateScreenshot(): Promise<void> {
	// Run in background without awaiting
	(async () => {
		try {
			console.log("Starting screenshot generation in background");

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
			// Using iPhone 14 Pro dimensions for a more modern phone screenshot
			const context = await browser.newContext({
				viewport: { width: 393, height: 852 }, // iPhone 14 Pro dimensions
				deviceScaleFactor: 3, // High DPI for better quality
				isMobile: true,
			});
			const page = await context.newPage();

			try {
				// Navigate to the page, wait for network idle
				await page.goto(
					IS_DEV ? "http://localhost:3000" : "https://dolary.vercel.app",
					{ waitUntil: "domcontentloaded" },
				);

				// Take a screenshot of the full page
				const screenshotBuffer = await page.screenshot({ fullPage: true });

				// Save the screenshot to the public directory
				fs.writeFileSync(SCREENSHOT_PATH, screenshotBuffer);
				console.log("Screenshot saved successfully");

				// Close the browser
				await browser.close();
			} catch (pageError) {
				console.error("Error during page navigation/screenshot:", pageError);
				await browser.close(); // Ensure browser is closed on error
			}
		} catch (error) {
			console.error("Error in background screenshot generation:", error);
		}
	})();
}

// GET endpoint to serve the cached screenshot
export async function GET() {
	try {
		// Check if the screenshot exists
		if (!fs.existsSync(SCREENSHOT_PATH)) {
			// If it doesn't exist, generate it in the background
			generateScreenshot();

			// Return a placeholder or error response
			return NextResponse.json(
				{
					message:
						"Screenshot is being generated. Please try again in a few seconds.",
				},
				{ status: 202 },
			);
		}

		// Read and return the cached screenshot
		const screenshotBuffer = fs.readFileSync(SCREENSHOT_PATH);
		return new NextResponse(screenshotBuffer, {
			status: 200,
			headers: {
				"Content-Type": "image/png",
				"Content-Disposition": 'inline; filename="dolary.png"',
			},
		});
	} catch (error) {
		console.error("Error serving screenshot:", error);
		return NextResponse.json(
			{ error: "Failed to serve screenshot" },
			{ status: 500 },
		);
	}
}
