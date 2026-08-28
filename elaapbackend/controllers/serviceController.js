import Service from "../models/Service.js";

// GET all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching services", error: error.message });
  }
};

// GET single service
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching service", error: error.message });
  }
};

// POST create service
export const createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const service = await Service.create({ title, description, icon });
    res.status(201).json({ success: true, message: "Service created successfully", data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating service", error: error.message });
  }
};

// PUT update service
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service updated successfully", data: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating service", error: error.message });
  }
};

// DELETE service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting service", error: error.message });
  }
};