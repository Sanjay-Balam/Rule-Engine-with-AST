const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define NodeSchema using a function to avoid reference issues
const NodeSchema = new Schema({
    type: { type: String, required: true }, // "operator" or "operand"
    left: { type: Schema.Types.Mixed, required: false }, // Use Mixed type for self-reference
    right: { type: Schema.Types.Mixed, required: false }, // Use Mixed type for self-reference
    value: { type: String } // For operand nodes, the condition, e.g., "age > 30"
});

// Define RuleSchema
const RuleSchema = new Schema({
    name: { type: String, required: true },
    rootNode: NodeSchema,
    created_at: { type: Date, default: Date.now }
});

// Export both schemas
module.exports = {
    Rule: mongoose.model('Rule', RuleSchema),
    NodeSchema // Export NodeSchema separately
};
