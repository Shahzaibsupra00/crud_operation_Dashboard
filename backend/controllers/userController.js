const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Password is automatically excluded because of `select: false` in schema
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, contact, cnic, address, password, role, status } =
      req.body;

    const userExists = await User.findOne({ $or: [{ email }, { cnic }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this Email or CNIC already exists" });
    }

    // Check if a file was uploaded. If yes, save the path. If no, the schema's default gravatar is used.
    const imgPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newUser = new User({
      name,
      email,
      contact,
      cnic,
      address,
      password,
      role,
      status,
      ...(imgPath && { img: imgPath }), // Only add img if a file was uploaded
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If a new image was uploaded, update the image path
    if (req.file) {
      updateData.img = `/uploads/${req.file.filename}`;
    }

    // If password was left blank during update, remove it so we don't overwrite with empty string
    if (!updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    // 1. Find the user first
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "N";
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deactivating user", error: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
