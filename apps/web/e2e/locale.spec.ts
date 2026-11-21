import { expect, type Page, test } from "@playwright/test";

/** Unprefixed URLs follow the browser's language until the reader picks
 * one with the switcher; the pick has to hold on the next visit. Only a
 * browser that asks for German gets German. */

const GERMAN_HOME = /:\d+\/$/;
const ENGLISH_HOME = /\/en$/;
const ENGLISH_IMPRINT = /\/en\/imprint$/;

const chooseGerman = (page: Page) =>
	page
		.locator("#lang-desktop")
		.getByRole("button", { name: "Deutsch" })
		.click();

test.describe("English browser", () => {
	test.use({ locale: "en-US" });

	test("lands on /en from the home page", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveURL(ENGLISH_HOME);
	});

	test("lands on the English name of a German page", async ({ page }) => {
		await page.goto("/impressum");
		await expect(page).toHaveURL(ENGLISH_IMPRINT);
	});

	test("stays on German after choosing it", async ({ page }) => {
		await page.goto("/");
		await chooseGerman(page);
		await expect(page).toHaveURL(GERMAN_HOME);
		await expect(page.locator("html")).toHaveAttribute("lang", "de");

		await page.goto("/");
		await expect(page).toHaveURL(GERMAN_HOME);
	});
});

test.describe("French browser", () => {
	test.use({ locale: "fr-FR" });

	test("lands on /en, not the German fallback", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveURL(ENGLISH_HOME);
	});
});

test.describe("German browser", () => {
	test("stays on the unprefixed home page", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveURL(GERMAN_HOME);
		await expect(page.locator("html")).toHaveAttribute("lang", "de");
	});

	test("goes back to German after a visit to /en", async ({ page }) => {
		await page.goto("/en");
		await chooseGerman(page);
		await expect(page).toHaveURL(GERMAN_HOME);
		await expect(page.locator("html")).toHaveAttribute("lang", "de");
	});
});
