import Category from "../models/categogyModel.js";

// Lấy tất cả category (có thể build tree)
export const getCategories = async (req, res) => {
  try {
    const { tree } = req.query;

    if (tree === "true") {
      // Hàm đệ quy build cây category
      const buildTree = async (parentId = null) => {
        const categories = await Category.find({ parentId });
        return Promise.all(
          categories.map(async (cat) => ({
            ...cat.toObject(),
            children: await buildTree(cat._id),
          }))
        );
      };
      const result = await buildTree();
      return res.json(result);
    }

    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm mới category
export const createCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const category = new Category({ name, parentId });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật category
export const updateCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, parentId },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
