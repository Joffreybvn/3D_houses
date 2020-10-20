
FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y libgl1-mesa-glx libgomp1

COPY . /opt/app
WORKDIR /opt/app

RUN pip install -r requirements.txt

ENTRYPOINT [ "python" ]
CMD [ "main.py" ]