import { PythonShell } from 'python-shell';

export const getPrediction = async (req, res) => {
    const imgBuffer = req.body;

    // Optionen für PythonShell
    let options = {
        mode: 'binary',
        pythonOptions: ['-u'], // Unbuffered stdout
        scriptPath: '', // Optional, falls das Skript in einem anderen Verzeichnis liegt
        args: [] // Keine Argumente erforderlich
    };

    let pyshell = new PythonShell('predict.py', options);

    let scriptOutput = '';

    pyshell.stdout.on('data', (data) => {
        scriptOutput += data.toString();
    });

    pyshell.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pyshell.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send(`Python script exited with code ${code}`);
        }

        try {
            const result = JSON.parse(scriptOutput);
            if(result)
              res.json(result);
            else {
              res.json("no result");
            }
        } catch (error) {
            res.status(500).send('Failed to parse predictions');
        }
    });

    // Senden Sie den Bildpuffer an das Python-Skript
    pyshell.send(imgBuffer).end();
};
