# Use the official PyTorch image as a base to avoid dependency issues
FROM pytorch/pytorch:latest

# Set the working directory in the container
WORKDIR /usr/src/app

RUN pip install flask

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 5000

# Set the command to run the application
CMD ["python", "app.py"]
