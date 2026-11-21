import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import type { FoodStore } from "./store";
import type { Order, Payment, Reservation } from "./types";

const orderSchema = z.object({
  customerName: z.string().min(2),
  email: z.email(),
  address: z.string().min(8),
  items: z.array(z.object({ menuItemId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1)
});

const paymentSchema = z.object({ orderId: z.string().min(1) });

const reservationSchema = z.object({
  restaurantId: z.string().min(1),
  name: z.string().min(2),
  phone: z.string().min(8),
  guests: z.number().int().min(1).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/)
});

export function createApp(store: FoodStore) {
  const app = new Hono();

  app.use("*", logger());
  app.use("/api/*", cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));

  app.get("/health", (c) => c.json({ status: "ok", service: "food-backend" }));

  app.get("/api/restaurants", async (c) => c.json({ data: await store.listRestaurants() }));

  app.get("/api/restaurants/:id", async (c) => {
    const restaurant = await store.getRestaurant(c.req.param("id"));
    return restaurant ? c.json({ data: restaurant }) : c.json({ error: "Restaurant not found" }, 404);
  });

  app.get("/api/restaurants/:id/menu", async (c) => {
    const restaurant = await store.getRestaurant(c.req.param("id"));
    if (!restaurant) return c.json({ error: "Restaurant not found" }, 404);
    return c.json({ data: await store.listMenu(restaurant.id) });
  });

  app.post("/api/orders", async (c) => {
    const parsed = orderSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "Invalid order", details: parsed.error.flatten() }, 400);

    const menu = await store.getMenuItems(parsed.data.items.map((item) => item.menuItemId));
    if (menu.length !== new Set(parsed.data.items.map((item) => item.menuItemId)).size) {
      return c.json({ error: "One or more menu items do not exist" }, 400);
    }

    const items = parsed.data.items.map((requested) => {
      const item = menu.find((candidate) => candidate.id === requested.menuItemId)!;
      return { menuItemId: item.id, name: item.name, quantity: requested.quantity, unitPrice: item.price };
    });
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = subtotal >= 499 ? 0 : 49;
    const order: Order = {
      id: crypto.randomUUID(),
      customerName: parsed.data.customerName,
      email: parsed.data.email,
      address: parsed.data.address,
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: "payment_pending",
      createdAt: new Date().toISOString()
    };
    await store.createOrder(order);
    return c.json({ data: order }, 201);
  });

  app.get("/api/orders/:id", async (c) => {
    const order = await store.getOrder(c.req.param("id"));
    return order ? c.json({ data: order }) : c.json({ error: "Order not found" }, 404);
  });

  app.post("/api/payments", async (c) => {
    const parsed = paymentSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "Invalid payment request" }, 400);
    const order = await store.getOrder(parsed.data.orderId);
    if (!order) return c.json({ error: "Order not found" }, 404);

    const payment: Payment = {
      id: crypto.randomUUID(),
      orderId: order.id,
      amount: order.total,
      method: "dummy-card",
      status: "created",
      createdAt: new Date().toISOString()
    };
    await store.createPayment(payment);
    return c.json({ data: payment, message: "Dummy payment created; no money will be charged" }, 201);
  });

  app.post("/api/payments/:id/confirm", async (c) => {
    const payment = await store.getPayment(c.req.param("id"));
    if (!payment) return c.json({ error: "Payment not found" }, 404);
    const paidPayment: Payment = { ...payment, status: "paid" };
    await store.updatePayment(paidPayment);
    const order = await store.getOrder(payment.orderId);
    if (order) await store.updateOrder({ ...order, status: "confirmed" });
    return c.json({ data: paidPayment, message: "Dummy payment successful" });
  });

  app.get("/api/dineout/restaurants", async (c) => {
    const restaurants = (await store.listRestaurants()).filter((restaurant) => restaurant.dineout);
    return c.json({ data: restaurants });
  });

  app.post("/api/dineout/reservations", async (c) => {
    const parsed = reservationSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "Invalid reservation", details: parsed.error.flatten() }, 400);
    const restaurant = await store.getRestaurant(parsed.data.restaurantId);
    if (!restaurant?.dineout) return c.json({ error: "Restaurant is not available for Dineout" }, 400);

    const reservation: Reservation = {
      id: crypto.randomUUID(),
      ...parsed.data,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    await store.createReservation(reservation);
    return c.json({ data: reservation }, 201);
  });

  app.get("/api/dineout/reservations/:id", async (c) => {
    const reservation = await store.getReservation(c.req.param("id"));
    return reservation ? c.json({ data: reservation }) : c.json({ error: "Reservation not found" }, 404);
  });

  app.notFound((c) => c.json({ error: "Route not found" }, 404));
  app.onError((error, c) => {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  });

  return app;
}
