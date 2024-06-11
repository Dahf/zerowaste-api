import { PythonShell } from 'python-shell';

export const getPrediction = async (req, res) => {
    const imgBuffer = req.body;
    try {
        // Senden Sie den Bildpuffer an den Python-Container
        const response = await axios.post('http://python-predictor:5000/predict', imgBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        // Rückgabe der Vorhersagen
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to get prediction from Python container');
    }
};
