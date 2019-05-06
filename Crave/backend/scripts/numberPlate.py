import sys
import base64
import json
import requests

# Sample image file is available at http://plates.openalpr.com/ea7the.jpg
# http://plates.openalpr.com/ea7the.jpg

IMAGE_PATH = './cars/'+sys.argv[1]
SECRET_KEY = 'sk_1543ee3c80b07778b2553e16'

with open(IMAGE_PATH, 'rb') as image_file:
   img_base64 = base64.b64encode(image_file.read())

url = 'https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=us&secret_key=%s' % (SECRET_KEY)
r = requests.post(url, data = img_base64)

result = json.dumps(r.json(), indent=2)
result = json.loads(result)
print(result["results"][0]["plate"])