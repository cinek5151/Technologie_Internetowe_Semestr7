const addToCart = async (productId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/cart/add`, {
      method: "POST",
      body: JSON.stringify({ productId, qty: 1 }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("Błąd podczas dodawania produktu do koszyka:", error);
  }
};

const getAllCartItems = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      credentials: "include",
    });
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Błąd podczas pobierania produktów:", error);
    return [];
  }
};

const removeFromCart = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/cart/item/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Błąd podczas usuwania produktu z koszyka:", error);
  }
};

const doCheckout = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/checkout`, {
      method: "POST",
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("Błąd podczas składania zamówienia:", error);
  }
};

const updateQtyInCart = async (productId, qty) => {
  try {
    const response = await fetch(`http://localhost:3000/api/cart/item`, {
      method: "PATCH",
      body: JSON.stringify({ productId, qty }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error(
      "Błąd podczas aktualizacji ilości produktu w koszyku:",
      error
    );
  }
};

const renderCartItems = async () => {
  const cartItems = await getAllCartItems();

  const cartItemsBody = document.getElementById("cart_table_body");
  cartItemsBody.innerHTML = "";

  cartItems.forEach((cartItem) => {
    const tableRow = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = cartItem.name;
    tableRow.appendChild(nameCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = cartItem.price;
    tableRow.appendChild(priceCell);

    const qtyCell = document.createElement("td");
    qtyCell.textContent = cartItem.qty;
    tableRow.appendChild(qtyCell);

    const totalPriceCell = document.createElement("td");
    totalPriceCell.textContent = cartItem.total_item_price;
    tableRow.appendChild(totalPriceCell);

    const updateQtyCell = document.createElement("td");
    const updateQtyInput = document.createElement("input");
    updateQtyInput.type = "number";
    updateQtyInput.min = "1";
    updateQtyInput.value = cartItem.qty;
    updateQtyInput.classList.add(
      "form-control",
      "d-inline-block",
      "w-auto",
      "me-2"
    );

    const updateQtyButton = document.createElement("button");
    updateQtyButton.textContent = "Zaktualizuj";
    updateQtyButton.classList.add("btn", "btn-secondary");

    updateQtyButton.addEventListener("click", async () => {
      const result = await updateQtyInCart(
        cartItem.product_id,
        parseInt(updateQtyInput.value)
      );
      if (result.error) {
        alert(result.error);
        return;
      }
      renderCartItems();
    });

    updateQtyCell.appendChild(updateQtyInput);
    updateQtyCell.appendChild(updateQtyButton);
    tableRow.appendChild(updateQtyCell);

    const removeFromCartCell = document.createElement("td");
    const removeFromCartButton = document.createElement("button");
    removeFromCartButton.textContent = "Usuń z koszyka";
    removeFromCartButton.classList.add("btn", "btn-danger");
    removeFromCartButton.addEventListener("click", async () => {
      await removeFromCart(cartItem.product_id);
      renderCartItems();
    });
    removeFromCartCell.appendChild(removeFromCartButton);
    tableRow.appendChild(removeFromCartCell);

    cartItemsBody.appendChild(tableRow);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("cart_table_body")) {
    renderCartItems();
  }
});

if (document.getElementById("checkoutButton")) {
  document
    .getElementById("checkoutButton")
    .addEventListener("click", async () => {
      const checkoutResult = await doCheckout();

      renderCartItems();

      if (checkoutResult.error) {
        alert(checkoutResult.error);
        return;
      }

      alert(
        `Zamówienie zostało złożone pomyślnie! ID zamówienia: ${checkoutResult.orderId}, łączna kwota: ${checkoutResult.total}`
      );
    });
}
