import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# List of packages to install
packages = [
    "numpy",
    "pillow",
    "pytesseract",
    "ultralytics"
]

for package in packages:
    try:
        install(package)
        print(f"{package} installed successfully.")
    except Exception as e:
        print(f"An error occurred while installing {package}: {e}")
