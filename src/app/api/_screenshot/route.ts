// app/api/screenshot/route.ts (Next.js 14 App Router)
import { NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // Ensure the route is dynamic

const IS_DEV = process.env.NODE_ENV !== "production";
const SCREENSHOT_DIR = path.join(process.cwd(), "public", "screenshots");
const LIGHT_SCREENSHOT_PATH = path.join(SCREENSHOT_DIR, "light.png");
const DARK_SCREENSHOT_PATH = path.join(SCREENSHOT_DIR, "dark.png");

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
	fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Function to generate and save screenshot - non-blocking
export async function generateScreenshot(
	theme: "light" | "dark",
): Promise<void> {
	// Run in background without awaiting
	(async () => {
		try {
			console.log(`Starting ${theme} mode screenshot generation in background`);

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
			// Using iPhone SE dimensions for a more compact phone screenshot
			const context = await browser.newContext({
				viewport: { width: 375, height: 667 }, // iPhone SE dimensions
				deviceScaleFactor: 3, // High DPI for better quality
				isMobile: true,
			});
			const page = await context.newPage();

			try {
				// Set the theme before navigation
				await context.addInitScript(`
					window.localStorage.setItem('theme', '${theme}');
				`);

				// Navigate to the page, wait for network idle
				await page.goto(
					IS_DEV ? "http://localhost:3000" : "https://dolary.vercel.app",
					{ waitUntil: "networkidle" },
				);

				// Wait for theme to be applied
				await page.waitForTimeout(1000);

				// Take a screenshot of the full page
				const screenshotBuffer = await page.screenshot({ fullPage: true });

				// Save the screenshot to the public directory
				const targetPath =
					theme === "light" ? LIGHT_SCREENSHOT_PATH : DARK_SCREENSHOT_PATH;
				fs.writeFileSync(targetPath, screenshotBuffer);
				console.log(`${theme} mode screenshot saved successfully`);

				// Close the browser
				await browser.close();
			} catch (pageError) {
				console.error(
					`Error during ${theme} mode page navigation/screenshot:`,
					pageError,
				);
				await browser.close(); // Ensure browser is closed on error
			}
		} catch (error) {
			console.error(
				`Error in background ${theme} mode screenshot generation:`,
				error,
			);
		}
	})();
}

// GET endpoint to serve the cached screenshot
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const theme = (searchParams.get("theme") as "light" | "dark") || "dark";
		const forceUpdate = searchParams.get("update") === "true";

		const screenshotPath =
			theme === "light" ? LIGHT_SCREENSHOT_PATH : DARK_SCREENSHOT_PATH;

		// Check if either screenshot is missing or if we need to force an update
		const lightExists = fs.existsSync(LIGHT_SCREENSHOT_PATH);
		const darkExists = fs.existsSync(DARK_SCREENSHOT_PATH);

		console.log("lightExists", lightExists);
		console.log("darkExists", darkExists);

		if (!lightExists || !darkExists || forceUpdate) {
			// Generate only the missing screenshots or all if force update
			if (!lightExists || forceUpdate) {
				generateScreenshot("light");
			}
			if (!darkExists || forceUpdate) {
				generateScreenshot("dark");
			}

			// Return a placeholder or error response
			return NextResponse.json(
				{
					message:
						"Screenshots are being generated. Please try again in a few seconds.",
				},
				{ status: 202 },
			);
		}

		// Read and return the requested screenshot
		const screenshotBuffer = fs.readFileSync(screenshotPath);
		return new NextResponse(screenshotBuffer, {
			status: 200,
			headers: {
				"Content-Type": "image/png",
				"Content-Disposition": `inline; filename="dolary-${theme}.png"`,
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
