import { spawn } from "child_process";

export const getPrediction = async (req, res) => {
    const imgBuffer = req.body;
  
    const pythonProcess = spawn('python3', ['predict.py']);
  
    let scriptOutput = '';
  
    pythonProcess.stdout.on('data', (data) => {
      scriptOutput += data.toString();
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
  
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).send(`Python script exited with code ${code}`);
      }
  
      // Parse the JSON output from the Python script
      const result = JSON.parse(scriptOutput);
      res.json(result);
    });
  
    // Send the image buffer to the Python script
    pythonProcess.stdin.write(imgBuffer);
    pythonProcess.stdin.end();
  };
  