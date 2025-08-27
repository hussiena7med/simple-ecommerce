import request from "supertest";
import App from "../src/app";
import sequelize from "../src/config/sequelize";

describe("Category CRUD Tests", () => {
  let app: any;

  beforeAll(() => {
    // Simple app initialization
    const appInstance = new App();
    app = appInstance.app;
  });

  afterAll(async () => {
    // Close database connection to prevent Jest warning
    await sequelize.close();
  });

  // Test 1: Health check first
  describe("API Health Check", () => {
    it("should return 200 for health endpoint", async () => {
      const response = await request(app).get("/api/v1/health").expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // Test 2: Create category
  describe("POST /api/v1/categories", () => {
    it("should create a category successfully", async () => {
      const categoryData = {
        name: `Test Electronics ${Date.now()}`, // Unique name
      };

      const response = await request(app)
        .post("/api/v1/categories")
        .send(categoryData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: "Category created successfully",
        data: expect.objectContaining({
          id: expect.any(Number),
          name: categoryData.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      });
    });

    it("should return 400 for empty category name", async () => {
      const invalidData = {
        name: "", // Empty name
      };

      const response = await request(app)
        .post("/api/v1/categories")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 3: Get categories
  describe("GET /api/v1/categories", () => {
    it("should get categories successfully", async () => {
      const response = await request(app).get("/api/v1/categories").expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: "Categories retrieved successfully",
        data: expect.objectContaining({
          data: expect.any(Array),
          pagination: expect.any(Object),
        }),
      });
    });
  });

  // Test 4: Get single category
  describe("GET /api/v1/categories/:id", () => {
    let categoryId: number;

    beforeAll(async () => {
      // Create a category for testing
      const response = await request(app)
        .post("/api/v1/categories")
        .send({ name: `Test Category ${Date.now()}` });

      categoryId = response.body.data.id;
    });

    it("should get category by id", async () => {
      const response = await request(app)
        .get(`/api/v1/categories/${categoryId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: categoryId,
          name: expect.any(String),
        }),
      });
    });

    it("should return 404 for non-existent category", async () => {
      const response = await request(app)
        .get("/api/v1/categories/99999")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 5: Update category
  describe("PUT /api/v1/categories/:id", () => {
    let categoryId: number;

    beforeAll(async () => {
      // Create a category for testing
      const response = await request(app)
        .post("/api/v1/categories")
        .send({ name: `Update Test ${Date.now()}` });

      categoryId = response.body.data.id;
    });

    it("should update category successfully", async () => {
      const updateData = {
        name: `Updated Category ${Date.now()}`,
      };

      const response = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: categoryId,
          name: updateData.name,
        }),
      });
    });
  });

  // Test 6: Delete category
  describe("DELETE /api/v1/categories/:id", () => {
    let categoryId: number;

    beforeAll(async () => {
      // Create a category for testing
      const response = await request(app)
        .post("/api/v1/categories")
        .send({ name: `Delete Test ${Date.now()}` });

      categoryId = response.body.data.id;
    });

    it("should delete category successfully", async () => {
      const response = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
