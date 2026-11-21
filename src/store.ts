import { MongoClient, type Collection, type Db } from "mongodb";
import { menuItems as seedMenuItems, restaurants as seedRestaurants } from "./data";
import type { MenuItem, Order, Payment, Reservation, Restaurant } from "./types";

export interface FoodStore {
  listRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | null>;
  listMenu(restaurantId: string): Promise<MenuItem[]>;
  getMenuItems(ids: string[]): Promise<MenuItem[]>;
  createOrder(order: Order): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  updateOrder(order: Order): Promise<Order>;
  createPayment(payment: Payment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | null>;
  updatePayment(payment: Payment): Promise<Payment>;
  createReservation(reservation: Reservation): Promise<Reservation>;
  getReservation(id: string): Promise<Reservation | null>;
}

export class MemoryFoodStore implements FoodStore {
  private readonly restaurantData = structuredClone(seedRestaurants);
  private readonly menuData = structuredClone(seedMenuItems);
  private readonly orders = new Map<string, Order>();
  private readonly payments = new Map<string, Payment>();
  private readonly reservations = new Map<string, Reservation>();

  async listRestaurants() { return this.restaurantData; }
  async getRestaurant(id: string) { return this.restaurantData.find((item) => item.id === id) ?? null; }
  async listMenu(restaurantId: string) { return this.menuData.filter((item) => item.restaurantId === restaurantId); }
  async getMenuItems(ids: string[]) { return this.menuData.filter((item) => ids.includes(item.id)); }
  async createOrder(order: Order) { this.orders.set(order.id, order); return order; }
  async getOrder(id: string) { return this.orders.get(id) ?? null; }
  async updateOrder(order: Order) { this.orders.set(order.id, order); return order; }
  async createPayment(payment: Payment) { this.payments.set(payment.id, payment); return payment; }
  async getPayment(id: string) { return this.payments.get(id) ?? null; }
  async updatePayment(payment: Payment) { this.payments.set(payment.id, payment); return payment; }
  async createReservation(reservation: Reservation) { this.reservations.set(reservation.id, reservation); return reservation; }
  async getReservation(id: string) { return this.reservations.get(id) ?? null; }
}

export class MongoFoodStore implements FoodStore {
  private readonly restaurants: Collection<Restaurant>;
  private readonly menuItems: Collection<MenuItem>;
  private readonly orders: Collection<Order>;
  private readonly payments: Collection<Payment>;
  private readonly reservations: Collection<Reservation>;

  constructor(db: Db) {
    this.restaurants = db.collection<Restaurant>("restaurants");
    this.menuItems = db.collection<MenuItem>("menu_items");
    this.orders = db.collection<Order>("orders");
    this.payments = db.collection<Payment>("payments");
    this.reservations = db.collection<Reservation>("reservations");
  }

  async seed() {
    if ((await this.restaurants.countDocuments()) === 0) await this.restaurants.insertMany(seedRestaurants);
    if ((await this.menuItems.countDocuments()) === 0) await this.menuItems.insertMany(seedMenuItems);
  }

  async listRestaurants() { return this.restaurants.find({}, { projection: { _id: 0 } }).toArray(); }
  async getRestaurant(id: string) { return this.restaurants.findOne({ id }, { projection: { _id: 0 } }); }
  async listMenu(restaurantId: string) { return this.menuItems.find({ restaurantId }, { projection: { _id: 0 } }).toArray(); }
  async getMenuItems(ids: string[]) { return this.menuItems.find({ id: { $in: ids } }, { projection: { _id: 0 } }).toArray(); }
  async createOrder(order: Order) { await this.orders.insertOne(order); return order; }
  async getOrder(id: string) { return this.orders.findOne({ id }, { projection: { _id: 0 } }); }
  async updateOrder(order: Order) { await this.orders.replaceOne({ id: order.id }, order); return order; }
  async createPayment(payment: Payment) { await this.payments.insertOne(payment); return payment; }
  async getPayment(id: string) { return this.payments.findOne({ id }, { projection: { _id: 0 } }); }
  async updatePayment(payment: Payment) { await this.payments.replaceOne({ id: payment.id }, payment); return payment; }
  async createReservation(reservation: Reservation) { await this.reservations.insertOne(reservation); return reservation; }
  async getReservation(id: string) { return this.reservations.findOne({ id }, { projection: { _id: 0 } }); }
}

let client: MongoClient | undefined;

export async function createDefaultStore(): Promise<FoodStore> {
  if (process.env.USE_IN_MEMORY_DB === "true") return new MemoryFoodStore();

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");

  client = new MongoClient(uri);
  await client.connect();
  const store = new MongoFoodStore(client.db(process.env.MONGODB_DATABASE ?? "food_platform"));
  await store.seed();
  return store;
}

export async function closeDatabase() {
  await client?.close();
}
