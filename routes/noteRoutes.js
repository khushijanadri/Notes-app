const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes below
router.use(authMiddleware);

// CREATE NOTE
router.post("/", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const note = await Note.create({
            title,
            content,
            user: req.user.id
        });

        res.status(201).json({
            message: "Note created successfully",
            note
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL NOTES
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Notes fetched successfully",
            notes
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET SINGLE NOTE
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json(note);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE NOTE
router.put("/:id", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                title,
                content
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note updated successfully",
            note
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE NOTE
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;