import easyocr
import numpy as np
from PIL import Image

reader = easyocr.Reader(["en"])

# extract text from image using ocr
def extract_image_text(file_path):
    image = Image.open(file_path).convert("RGB")
    image = np.array(image)
    results = reader.readtext(image)
    text = "\n".join(result[1].strip() for result in results if result[1].strip())
    return text
    
