# Rule Engine with Abstract Syntax Tree (AST)

## Introduction
This project implements a simple 3-tier rule engine application designed to determine user eligibility based on various attributes such as age, department, income, and spending. The system utilizes an Abstract Syntax Tree (AST) to represent conditional rules, allowing for dynamic creation, combination, and modification of these rules. 

## Features Implemented

### Data Structure
- **Node Representation**: A data structure was defined to represent the AST, consisting of:
  - `type`: A string indicating the node type ("operator" for AND/OR, "operand" for conditions).
  - `left`: A reference to another Node (left child).
  - `right`: A reference to another Node (right child for operators).
  - `value`: An optional value for operand nodes (e.g., number for comparisons).

### Data Storage
- **Database Choice**: MongoDB database was chosen for storing rules and application metadata.
- **Schema Definition**: Created a Rule Schema

### Sample Rules
- **Rule Examples**:
  - `rule1`: "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
  - `rule2`: "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"

### API Design
1. **create_rule(rule_string)**: This function takes a string representing a rule and returns a Node object representing the corresponding AST.
2. **combine_rules(rules)**: This function takes a list of rule strings and combines them into a single AST, optimizing for efficiency and minimizing redundant checks.
3. **evaluate_rule(JSON data)**: This function evaluates the combined rule's AST against provided attribute data, returning `True` if the user meets the criteria, and `False` otherwise.



## Project Structure
You can find the **frontend** and **backend** folders where I have implemented the core logic of this project. 

### Instructions to Test the Project
1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/Sanjay-Balam/Rule-Engine-with-AST.git
   ```

2. **Set Up the Backend**:
   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Install the required dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm start
     ```
## Running the Backend Locally Using Docker


- To run the Rule Engine project locally using Docker, you need to execute a Docker command that will start the application and expose it on your local machine. This will allow you to interact with the API endpoints, such as creating rules.

## Docker Command

To run the project, use the following command:

```js
    docker run -d -p 5002:5002 sanjaybalam2003/ruleast:v1.0.2
```
3. **Set Up the Frontend**:
   - Navigate to the frontend folder:
     ```bash
     cd ../frontend2
     ```
   - Install the required dependencies:
     ```bash
     npm install
     ```
   - Start the frontend application:
     ```bash
     npm run dev
     ```



4. **Testing the API**:
   - Use tools like Postman or cURL to test the API endpoints:
     - `POST /create_rule` to create a new rule.
     - `POST /combine_rules` to combine multiple rules.
     - `POST /evaluate_rule` to evaluate a rule against user data.

# Rule Engine API Documentation

## API Endpoints

### 1. Create Rule
- **URL**: `http://localhost:5002/api/rules/create`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: 
  Choose raw and enter the JSON data for the request.
  
  **Example Request**:
  ```json
  {
      "name": "Age Rule",
      "rule_string": "age > 30 AND department = 'HR'"
  }
  ```

### 2. Combine Rules
- **URL**: `http://localhost:5002/api/rules/combine`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: 
  Choose raw and enter the JSON data for the request.
  
  **Example Request**:
  ```json
  {
      "rule_strings": [
          "age > 30",
          "salary < 50000 OR experience > 5"
      ]
  }
  ```

### 3. Evaluate Rule
- **URL**: `http://localhost:5002/api/rules/evaluate`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: 
  Choose raw and enter the JSON data for the request.
  
  **Example Request**:
  ```json
  {
      "ast": {
          "type": "operator",
          "left": {
              "type": "operand",
              "value": {
                  "field": "age",
                  "operator": ">",
                  "value": "30"
              }
          },
          "right": {
              "type": "operand",
              "value": {
                  "field": "department",
                  "operator": "=",
                  "value": "HR"
              }
          },
          "value": "AND"
      },
      "userData": {
          "age": 35,
          "department": "HR"
      }
  }
  ```


## Conclusion
This rule engine application provides a robust framework for evaluating user eligibility based on dynamic rules. The use of an AST allows for efficient rule management and evaluation, making it a versatile tool for various applications.