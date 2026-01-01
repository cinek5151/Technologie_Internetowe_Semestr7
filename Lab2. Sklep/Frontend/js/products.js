const getAllProducts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Błąd podczas pobierania produktów:", error);
    return [];
  }
};

const addNewProduct = async (product) => {
  const response = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...product }),
  });

  return await response.json();
};
const renderProducts = async () => {
  const products = await getAllProducts();
  const productsTable = document.getElementById("products_table_body");
  productsTable.innerHTML = "";

  products.forEach((product) => {
    const tableRow = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;
    tableRow.appendChild(nameCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = product.price;
    tableRow.appendChild(priceCell);

    const addToCartCell = document.createElement("td");
    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Dodaj do koszyka";
    addToCartButton.classList.add("btn", "btn-primary");
    addToCartButton.addEventListener("click", async () => {
      const addedItem = await addToCart(product.id);
      if (addedItem.error) {
        alert(addedItem.error);
        return;
      }
      alert("Produkt dodany do koszyka!");
    });
    addToCartCell.appendChild(addToCartButton);
    tableRow.appendChild(addToCartCell);

    productsTable.appendChild(tableRow);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  renderProducts();
});

document
  .getElementById("addProductButton")
  .addEventListener("click", async () => {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;

    const newProduct = { name, price };

    const addedProduct = await addNewProduct(newProduct);
    if (addedProduct.error) {
      alert(addedProduct.error);
      return;
    }

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";

    renderProducts();
    document.getElementById("closeProductModal").click();
  });
