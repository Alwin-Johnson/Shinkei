const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Shinkei backend running on http://localhost:${PORT}`);
});