const { NodeSchema } = require('../models/Rule'); // Import NodeSchema
const mongoose = require('mongoose');

// Function to create a new AST Node
const createNode = (type, left = null, right = null, value = null) => {
    return { type, left, right, value }; // Create a plain object instead of a Mongoose model
};

// Parse a rule string and convert it to AST
const parseRuleString = (ruleString) => {
    try {
        const tokens = ruleString.match(/\(|\)|\w+|'.+?'|[><=]+/g);
        const nodeStack = [];
        const operatorStack = [];
        const precedence = { 'AND': 1, 'OR': 0 };

        const applyOperator = () => {
            const operator = operatorStack.pop();
            const right = nodeStack.pop();
            const left = nodeStack.pop();
            nodeStack.push(createNode('operator', left, right, operator));
        };

        tokens.forEach(token => {
            if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack[operatorStack.length - 1] !== '(') {
                    applyOperator();
                }
                operatorStack.pop();
            } else if (token === 'AND' || token === 'OR') {
                while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                    applyOperator();
                }
                operatorStack.push(token);
            } else {
                const parts = token.split(/([><=]+)/);
                const field = parts[0];
                const operator = parts[1];
                const value = parts[2] ? parts[2].replace(/'/g, '') : null;

                nodeStack.push(createNode('operand', null, null, { field, operator, value }));
            }
        });

        while (operatorStack.length) {
            applyOperator();
        }

        return nodeStack.pop();
    } catch (error) {
        throw new Error('Failed to parse rule string: ' + error.message);
    }
};

// Combine rules
const combineRules = (ruleStrings) => {
    try {
        const astNodes = ruleStrings.map(ruleString => parseRuleString(ruleString));

        let andCount = 0;
        let orCount = 0;

        astNodes.forEach(node => {
            if (node.type === 'operator') {
                if (node.value === 'AND') {
                    andCount++;
                } else if (node.value === 'OR') {
                    orCount++;
                }
            }
        });

        const mainOperator = andCount >= orCount ? 'AND' : 'OR';
        let root = astNodes[0];

        for (let i = 1; i < astNodes.length; i++) {
            root = createNode('operator', root, astNodes[i], mainOperator);
        }

        return root;
    } catch (error) {
        throw new Error('Failed to combine rules: ' + error.message);
    }
};

// Evaluate the combined rule against user data
const evaluateRule = (ast, userData) => {
    try {
        const evaluateNode = (node) => {
            if (node.type === 'operand') {
                const { field, operator, value } = node.value;
                const userValue = userData[field];

                switch (operator) {
                    case '>': return userValue > value;
                    case '<': return userValue < value;
                    case '=': return userValue == value;
                    default: throw new Error(`Unknown operator: ${operator}`);
                }
            } else if (node.type === 'operator') {
                const leftResult = evaluateNode(node.left);
                const rightResult = evaluateNode(node.right);

                if (node.value === 'AND') {
                    return leftResult && rightResult;
                } else if (node.value === 'OR') {
                    return leftResult || rightResult;
                }
            }
        };

        return evaluateNode(ast);
    } catch (error) {
        throw new Error('Failed to evaluate rule: ' + error.message);
    }
};

// Export all functions
module.exports = {
    parseRuleString,
    combineRules,
    evaluateRule
};