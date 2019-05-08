import urllib.request  as urllib2
import json
# import requests

response = urllib2.urlopen('http://api.openweathermap.org/data/2.5/weather?zip=95192,us&units=imperial&type=accurate&mode=json&APPID=8001adaa93926e626ad7416364742046')
data = json.load(response)


if 65  <= data['main']['temp'] <= 73:
  # print('Pleasant day! You can drink hot or cold!')
  print(data['main']['temp'])

if data['main']['temp'] < 65:
  # print('This is a cold day!')
  print(data['main']['temp'])

if data['main']['temp'] > 73:
  # print('This is a hot day!')
  print(data['main']['temp'])