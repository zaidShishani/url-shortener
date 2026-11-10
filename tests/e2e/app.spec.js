import { test, expect } from "@playwright/test";

const username = "e2e-user";
const password = "password123";

async function fill(page, user, pass) {
    await page.getByPlaceholder("username").fill(user);
    await page.getByPlaceholder("password").fill(pass);
    await page.getByRole("button", { name: "submit" }).click();
}

test("unauthorized visit to the url page redirects to 404", async ({ page }) => {
    await page.goto("/urls");
    await expect(page).toHaveURL(/\/404$/);
    await expect(page.getByRole("heading", { name: /404/ })).toBeVisible();
});

test("unknown route shows 404", async ({ page }) => {
    await page.goto("/nope");
    await expect(page.getByRole("heading", { name: /404/ })).toBeVisible();
});

test("root goes to login and login links to register and back", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await page.getByRole("link", { name: "register" }).click();
    await expect(page).toHaveURL(/\/register$/);
    await page.getByRole("link", { name: "login" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.screenshot({ path: "test-results/login.png" });
});

test("register sends the credentials and lands on the url page", async ({ page, request }) => {
    const { data } = await (await request.post("/api/auth/login", { data: { username, password } })).json();
    let body;
    await page.route("**/api/auth/register", (route) => {
        body = route.request().postDataJSON();
        route.fulfill({ status: 201, json: { data } });
    });
    await page.goto("/register");
    await fill(page, "someone-new", password);
    await expect(page).toHaveURL(/\/urls$/);
    expect(body).toEqual({ username: "someone-new", password });
    await page.screenshot({ path: "test-results/register-to-urls.png" });
});

test("login, reach urls, logout, urls is blocked again", async ({ page }) => {
    await page.goto("/login");
    await fill(page, username, password);
    await expect(page).toHaveURL(/\/urls$/);
    await expect(page.getByPlaceholder(/short code/i)).toBeVisible();
    await expect(page.getByText(/failed to load/i)).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeTruthy();
    await page.screenshot({ path: "test-results/urls.png" });

    await page.getByRole("button", { name: "log out" }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
    await page.goto("/urls");
    await expect(page).toHaveURL(/\/404$/);
});

test("wrong password shows an error and stays on login", async ({ page }) => {
    await page.goto("/login");
    await fill(page, username, "wrongpassword");
    await expect(page.getByRole("alert")).toHaveText(/invalid username or password/);
    await expect(page).toHaveURL(/\/login$/);
});

test("logged in user is kept off login and register", async ({ page }) => {
    await page.goto("/login");
    await fill(page, username, password);
    await expect(page).toHaveURL(/\/urls$/);
    await page.goto("/register");
    await expect(page).toHaveURL(/\/urls$/);
});

test("expired token clears and redirects to 404", async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => localStorage.setItem("token", "bad"));
    await page.goto("/urls");
    await expect(page).toHaveURL(/\/404$/);
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
});
