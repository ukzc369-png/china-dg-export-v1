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
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
  }

  async function addProduct() {
    await supabase.from("products").insert([form]);

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
    if (!confirm("Delete product?")) return;

    await supabase.from("products").delete().eq("id", id);

    loadProducts();
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Products Management</h1>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <h3>Add Product</h3>

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <br />
        <br />

        <input
          placeholder="CAS Number"
          value={form.cas}
          onChange={(e) =>
            setForm({ ...form, cas: e.target.value })
          }
        />

        <br />
        <br />

        <input
          placeholder="UN Number"
          value={form.un_number}
          onChange={(e) =>
            setForm({
              ...form,
              un_number: e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        />

        <br />
        <br />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <br />
        <br />

        <button onClick={addProduct}>
          Add Product
        </button>
      </div>

      <table
        border={1}
        cellPadding={10}
        width="100%"
      >
        <thead>
          <tr>
            <th>ID</th>
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
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.cas}</td>
              <td>{item.un_number}</td>
              <td>{item.category}</td>
              <td>{item.status}</td>

              <td>
                <button
                  onClick={() =>
                    deleteProduct(item.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}