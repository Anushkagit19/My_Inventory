const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProduct(form) {
  const errors = {};
  if (!form.name?.trim()) errors.name = "Product name is required";
  if (!form.sku?.trim()) errors.sku = "SKU is required";
  const price = parseFloat(form.price);
  if (form.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be greater than 0";
  }
  const qty = parseInt(form.quantity_in_stock, 10);
  if (
    form.quantity_in_stock === "" ||
    Number.isNaN(qty) ||
    qty < 0
  ) {
    errors.quantity_in_stock = "Stock must be 0 or greater";
  }
  return errors;
}

export function validateCustomer(form) {
  const errors = {};
  if (!form.full_name?.trim()) errors.full_name = "Full name is required";
  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!form.phone?.trim()) errors.phone = "Phone number is required";
  return errors;
}

export function validateOrder(customerId, lines, products) {
  const errors = {};
  if (!customerId) errors.customer = "Please select a customer";

  const lineErrors = [];
  let hasLine = false;

  lines.forEach((line, idx) => {
    const row = {};
    if (!line.product_id) {
      row.product = "Select a product";
    } else {
      hasLine = true;
      const product = products.find((p) => String(p.id) === String(line.product_id));
      const qty = parseInt(line.quantity, 10);
      if (!line.quantity || Number.isNaN(qty) || qty < 1) {
        row.quantity = "Quantity must be at least 1";
      } else if (product && qty > product.quantity_in_stock) {
        row.quantity = `Only ${product.quantity_in_stock} units available`;
      }
    }
    if (Object.keys(row).length) lineErrors[idx] = row;
  });

  if (!hasLine) errors.items = "Add at least one product line";
  if (lineErrors.length) errors.lineErrors = lineErrors;

  return errors;
}

export function hasErrors(errors) {
  if (!errors) return false;
  if (errors.lineErrors?.some((r) => r && Object.values(r).some(Boolean))) return true;
  return Object.entries(errors).some(([k, v]) => k !== "lineErrors" && Boolean(v));
}
