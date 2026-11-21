import { beforeEach, describe, expect, test } from "bun:test";
import { createApp } from "../src/app";
import { MemoryFoodStore } from "../src/store";

describe("food backend API", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp(new MemoryFoodStore());
  });

  test("reports service health and lists seeded restaurants", async () => {
    const health = await app.request("/health");
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ status: "ok", service: "food-backend" });

    const response = await app.request("/api/restaurants");
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBeGreaterThanOrEqual(4);
  });

  test("creates an order and completes a dummy payment", async () => {
    const orderResponse = await app.request("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: "Test Customer",
        email: "customer@example.com",
        address: "100 Test Street, Bengaluru",
        items: [{ menuItemId: "butter-chicken", quantity: 2 }]
      })
    });
    const orderBody = await orderResponse.json();
    expect(orderResponse.status).toBe(201);
    expect(orderBody.data.total).toBe(680);

    const paymentResponse = await app.request("/api/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId: orderBody.data.id })
    });
    const paymentBody = await paymentResponse.json();
    expect(paymentResponse.status).toBe(201);
    expect(paymentBody.data.status).toBe("created");

    const confirmResponse = await app.request(`/api/payments/${paymentBody.data.id}/confirm`, { method: "POST" });
    expect((await confirmResponse.json()).data.status).toBe("paid");
  });

  test("creates a Dineout reservation and validates unsupported restaurants", async () => {
    const payload = { restaurantId: "spice-route", name: "Guest User", phone: "9999999999", guests: 4, date: "2026-12-01", time: "20:00" };
    const response = await app.request("/api/dineout/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    expect(response.status).toBe(201);
    expect((await response.json()).data.status).toBe("confirmed");

    const invalid = await app.request("/api/dineout/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, restaurantId: "green-bowl" })
    });
    expect(invalid.status).toBe(400);
  });
});
