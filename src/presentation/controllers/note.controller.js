export default class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
    }

    createNote = async (req, res) => {
        const data = req.body;
        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
        data.userId = req.user.id;

        try {
            const note = await this.noteService.createNote(data);
            res.status(201).json({
                success: true,
                message: "Note created successfully",
                data: note
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    getNotesByUserId = async (req, res) => {
        const userId = req.user.id;

        try {
            const notes = await this.noteService.getNotesByUserId(userId);
            res.status(200).json({
                success: true,
                message: "Notes retrieved successfully",
                data: notes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    updateNote = async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const userId = req.user.id;

        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;

        try {
            const note = await this.noteService.updateNote(id, data, userId);
            res.status(200).json({
                success: true,
                message: "Note updated successfully",
                data: note
            });
        } catch (error) {
            const statusCode = error.message === "Unauthorized" ? 403 : 404;

            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    deleteNote = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const result = await this.noteService.deleteNote(id, userId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            const statusCode = error.message === "Unauthorized" ? 403 : 404;

            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    shareNote = async (req, res) => {
        const { id } = req.params;
        const { email } = req.body;
        const currentUserId = req.user.id;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Target email is required"
            });
        }

        try {
            const result = await this.noteService.shareNoteByEmail(id, email, currentUserId);
            res.status(200).json({
                success: true,
                message: "Note shared successfully",
                data: result
            });
        } catch (error) {
            const statusCode = error.message.includes("Unauthorized") ? 403 : 400;

            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }
}