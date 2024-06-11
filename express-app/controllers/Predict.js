import { PythonShell } from 'python-shell';

export const getPrediction = async (req, res) => {
    const imgBuffer = req.body;
    try {
        const response = await fetch('http://python-predictor:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: imgBuffer
        });

        if (!response.ok) {
            throw new Error('Failed to get prediction from Python container');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to get prediction from Python container');
    }
};
