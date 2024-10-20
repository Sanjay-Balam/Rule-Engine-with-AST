const { Rule } = require('../models/Rule'); // Import Rule model
const { parseRuleString, combineRules, evaluateRule } = require('../services/ruleService');


// logic for the validation of the string 
const validateRuleString = (ruleString) => {
    const validPattern = /^(\(|\)|\s|AND|OR|>|<|=|'[^']*'|\d+|age|department|salary|experience)+$/;
    if (!validPattern.test(ruleString)) {
        throw new Error('Invalid rule string format.');
    }
};

// Create a new rule and return the corresponding AST
exports.createRule = async (req, res) => {
    console.log(req.body); // Log the request body for debugging
    try {
        const { name, rule_string } = req.body; // Ensure you're extracting both fields

        // Validate rule string format
        if (!name || !rule_string) {
            return res.status(400).json({ error: 'Name and rule_string are required.' });
        }

        // Parse the rule string to get the AST
        const ast = parseRuleString(rule_string);
        
        // Create a new Rule document
        const rule = new Rule({ name, rootNode: ast }); // Ensure you're using the Rule constructor

        await rule.save(); // Save the rule to the database

        // Return the AST Node object
        res.status(200).json({ success: true, ast }); // Return the AST
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Combine rules
exports.combineRules = async (req, res) => {
    try {
        const { rule_strings } = req.body;
        const combinedAST = combineRules(rule_strings);
        res.json(combinedAST);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Evaluate the combined rule against user data
exports.evaluateRule = async (req, res) => {
    try {
        const { ast, userData } = req.body; // Expecting the AST and user data

        if (!ast || !userData) {
            return res.status(400).json({ error: 'Both ast and userData are required.' });
        }

        const result = evaluateRule(ast, userData); // Evaluate the rule
        res.status(200).json({ eligible: result }); // Return the result
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
