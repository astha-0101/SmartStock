# SmartStock React

## Run it
```
npm install
npm run dev
```
Then open the URL shown (usually http://localhost:5173).

## Full-stack demo (with the Spring Boot backend)

The Products page and the Dashboard's summary cards now fetch their product
data from the `smartstock-backend` project (`src/api.js`,
`src/hooks/useProducts.js`).

1. Start the backend first (see `smartstock-backend/README.md`):
   ```
   cd ../smartstock-backend
   mvn spring-boot:run
   ```
   It runs on http://localhost:8080.
2. Then start this frontend as above. It runs on http://localhost:5173.
3. Open the Dashboard or Products page — you'll see "(live from backend)"
   under the heading, and the 8 sample products from `data.sql` in the
   Products table.

If the backend isn't running, the frontend still works on its own: it
quietly falls back to the original static sample data and shows "(backend
offline — showing sample data)" instead, so you can demo the UI even
without the backend started.
