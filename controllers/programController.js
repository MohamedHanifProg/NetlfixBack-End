// controllers/programController.js
const Program = require('../models/Program');

const createProgram = async (req, res, next) => {
  try {
    const { externalId, title, mediaType, posterPath, backdropPath, releaseDate, overview, genres } = req.body;
    const program = await Program.create({
      externalId,
      title,
      mediaType,
      posterPath,
      backdropPath,
      releaseDate,
      overview,
      genres,
    });
    res.status(201).json({ program });
  } catch (error) {
    next(error);
  }
};

const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find({});
    res.status(200).json({ programs });
  } catch (error) {
    next(error);
  }
};

  
  // Add getProgram to retrieve a single program by its ID
  const getProgram = async (req, res, next) => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.status(200).json({ program });
    } catch (error) {
      next(error);
    }
  };

const updateProgram = async (req, res, next) => {
  try {
    const programId = req.params.id;
    const updatedData = req.body;
    const program = await Program.findByIdAndUpdate(programId, updatedData, { new: true });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.status(200).json({ program });
  } catch (error) {
    next(error);
  }
};

const deleteProgram = async (req, res, next) => {
  try {
    const programId = req.params.id;
    const program = await Program.findByIdAndDelete(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProgram, getPrograms, getProgram, updateProgram, deleteProgram };
