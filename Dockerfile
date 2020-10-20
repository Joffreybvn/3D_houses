
FROM python:3.8

COPY . /opt/app
WORKDIR /opt/app

RUN apt-get install -y libgl1-mesa-dev
RUN pip install --upgrade pip
RUN pip install --upgrade pipenv

RUN pip install -r requirements.txt

ENTRYPOINT [ "python" ]
CMD [ "main.py" ]