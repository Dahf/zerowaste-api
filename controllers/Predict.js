import { PythonShell } from 'python-shell';

export const getPrediction = async (req, res) => {
    const imgBuffer = req.body;

    // Save the image buffer to a temporary file
    const tempImagePath = 'temp_image.jpg';
    require('fs').writeFileSync(tempImagePath, imgBuffer);

    // Options for PythonShell
    let options = {
        args: [tempImagePath]
    };

    PythonShell.run('predict.py', options, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while running the Python script');
        }

        // Results is an array of strings. Parse the JSON string to an object.
        try {
            const predictions = JSON.parse(results[0]);
            res.json(predictions);
        } catch (error) {
            res.status(500).send('Failed to parse predictions');
        }

        // Clean up the temporary file
        require('fs').unlinkSync(tempImagePath);
    });
};
