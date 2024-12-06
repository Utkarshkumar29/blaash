const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    layout: { type: Array, required: true },  // Stores the layout (e.g., order of playlists)
    updatedAt: { type: Date, default: Date.now },  // Track when the layout was last updated
});

const Layout = mongoose.model('Layout', layoutSchema);

module.exports = Layout;
