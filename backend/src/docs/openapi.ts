export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "TravelGo API",
    version: "1.0.0",
    description: "OpenAPI spec for TravelGo backend",
  },
  servers: [{ url: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : "http://localhost:4000", description: "Backend server" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer" },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/health": {
      get: { summary: "Health check", responses: { "200": { description: "OK" } } },
    },
    "/api/auth/login": {
      post: {
        summary: "Login",
        requestBody: { required: true },
        responses: { "200": { description: "User + token" }, "401": { description: "Invalid" } },
      },
    },
    "/api/auth/register": {
      post: { summary: "Register", requestBody: { required: true }, responses: { "200": { description: "User + token" } } },
    },
    "/api/tours": {
      get: { summary: "List tours", parameters: [{ name: "page", in: "query" }, { name: "pageSize", in: "query" }, { name: "sort", in: "query" }], responses: { "200": { description: "Paged tours" } } },
      post: { summary: "Create tour", responses: { "201": { description: "Created" }, "401": { description: "Unauthorized" } } },
    },
    "/api/tours/{id}": {
      get: { summary: "Get tour", parameters: [{ name: "id", in: "path", required: true }], responses: { "200": { description: "Tour" }, "404": { description: "Not found" } } },
      put: { summary: "Update tour", parameters: [{ name: "id", in: "path", required: true }], responses: { "200": { description: "Updated" } } },
      delete: { summary: "Delete tour", parameters: [{ name: "id", in: "path", required: true }], responses: { "200": { description: "Deleted" } } },
    },
    "/api/bookings": {
      get: { summary: "My bookings", responses: { "200": { description: "List" } } },
      post: { summary: "Create booking", responses: { "201": { description: "Created" } } },
    },
    "/api/payments/checkout": {
      post: { summary: "Stripe checkout", responses: { "200": { description: "Redirect URL" }, "401": { description: "Unauthorized" } } },
    },
    "/api/payments/vnpay/checkout": {
      post: { summary: "VNPay checkout (mock)", responses: { "200": { description: "Redirect URL" } } },
    },
    "/api/payments/momo/checkout": {
      post: { summary: "MoMo checkout (mock)", responses: { "200": { description: "Redirect URL" } } },
    },
    "/api/payments/paypal/checkout": {
      post: { summary: "PayPal checkout (mock)", responses: { "200": { description: "Redirect URL" } } },
    },
    "/api/reports/revenue.pdf": {
      get: { summary: "Revenue PDF", parameters: [{ name: "startDate", in: "query" }, { name: "endDate", in: "query" }], responses: { "200": { description: "PDF" } } },
    },
    "/api/reports/invoice/{id}.pdf": {
      get: { summary: "Invoice PDF", parameters: [{ name: "id", in: "path", required: true }], responses: { "200": { description: "PDF" }, "404": { description: "Not found" } } },
    },
  },
};