import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    cas: "",
    un_number: "",
    category: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setProducts(data || []);
  }

  async function addProduct() {
    if (!form.name) {
      alert("Please enter product name");
      return;
    }

    const { error } = await supabase.from("products").insert([form]);

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      name: "",
      cas: "",
      un_number: "",
      category: "",
      description: "",
      status: "active",
    });

    loadProducts();
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadProducts();
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Products Management</h1>

      <div style={{ background: "#fff", padding: 24, borderRadius: 12, marginBottom: 24 }}>
        <h3>Add Product</h3>

        {["name", "cas", "un_number", "category", "description"].map((key) => (
          <input
            key={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            style={{
              display: "block",
              width: "100%",
              padding: 12,
              margin: "10px 0",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
        ))}

        <button onClick={addProduct} style={{ padding: "12px 24px", background: "#1683ff", color: "#fff", border: 0, borderRadius: 8 }}>
          Add Product
        </button>
      </div>

      <table cellPadding={12} style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>CAS</th>
            <th>UN</th>
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.cas}</td>
              <td>{item.un_number}</td>
              <td>{item.category}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => deleteProduct(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}