// server.js (Node.js backend using Express)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware to handle CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());  // Parse incoming JSON

// Define the path to your Maple script and `cmaple.exe`
const mapleScriptPath = path.join(__dirname, 'solver.mpl');

// Define a POST route to handle the text input from frontend
app.post('/api/solve', (req, res) => {
    const { giaThuyet, mucTieu } = req.body;  // Destructure text from the incoming request body
    // Example backend processing (you can replace this with your logic)
//     const solution = `This is the solution for Giả thuyết: ${giaThuyet} and Mục tiêu: ${mucTieu}`;

//   // Send the solution back to the frontend
//     res.json({ solution });
    // Tách các phần tử bằng dấu phẩy
    const parts = giaThuyet.split(", ");

    // Lấy danh sách biến và giá trị
    const variables = [];
    const values = [];

    parts.forEach(part => {
        const [variable, value] = part.split(" = ");
        variables.push(variable.trim());
        values.push(Number(value.trim()));
    });

    // Kết hợp thành danh sách
    const result = [variables, values]
    
    const mapleCode = `
    restart;
    read("C:/Users/mt200/OneDrive/Desktop/KnowledgeBase/Maple/newcode/MangTinhToan.m"):
    with(MangTinhToan):
    DetailSolution("C:/Users/mt200/OneDrive/Desktop/KnowledgeBase/Maple/newcode/TAM_GIAC.txt",[${result[0]}],{${mucTieu}}, [${result[1]}]);
    `;

    fs.writeFileSync(mapleScriptPath, mapleCode);

    const mapleCommand = `cmaple -q ${mapleScriptPath}`;
    exec(mapleCommand, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error}`);
            res.status(500).json({ error: 'Maple execution failed' });
        } else {
            // console.log(stdout);
            res.json({
                solution: stdout,  
            });
        }
    });


});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});