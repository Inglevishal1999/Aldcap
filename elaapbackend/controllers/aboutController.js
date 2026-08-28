import About from "../models/About.js";

// GET About details
export const getAbout = async (req, res) => {
  try {
    const aboutData = await About.findOne();
    res.status(200).json({ success: true, data: aboutData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching About data", error: error.message });
  }
};

// CREATE or UPDATE About section
export const updateAbout = async (req, res) => {
  try {
    const { title, subtitle, description, imageUrl } = req.body;

    let about = await About.findOne();

    if (about) {
      about = await About.findByIdAndUpdate(
        about._id,
        { title, subtitle, description, imageUrl },
        { new: true, runValidators: true }
      );
    } else {
      about = await About.create({ title, subtitle, description, imageUrl });
    }

    res.status(200).json({ success: true, message: "About section updated successfully", data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating About section", error: error.message });
  }
};