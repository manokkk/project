import React, { useState } from "react";
import "./AdminCategory.css";

const AdminCategory = () => {
  const [categories, setCategories] = useState([
    { id: 1, category: "Smartphones", description: "Mobile devices" },
    { id: 2, category: "Laptops", description: "Portable computers" },
    { id: 3, category: "Wearables", description: "Smartwatches and fitness trackers" },
    { id: 4, category: "Cameras", description: "Digital and action cameras" },
  ]);
  
  const [newCategory, setNewCategory] = useState({
    category: "",
    description: "",
  });
  
  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { ...newCategory, id: categories.length + 1 },
    ]);
    setNewCategory({ category: "", description: "" });
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleEditCategory = (id) => {
    const categoryToEdit = categories.find((category) => category.id === id);
    setNewCategory(categoryToEdit);
    handleDeleteCategory(id);
  };

  return (
    <div className="admin-category-container">
      <h1>Admin Categories</h1>
      
      <div className="form-container">
        <input
          type="text"
          placeholder="Category"
          value={newCategory.category}
          onChange={(e) =>
            setNewCategory({ ...newCategory, category: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.category}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEditCategory(category.id)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteCategory(category.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategory;
