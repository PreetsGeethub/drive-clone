const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Server is running on port ${PORT}`);
});