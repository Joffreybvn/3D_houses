
FROM python:3.8-alpine

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN apk --update add python py-pip openssl ca-certificates py-openssl wget bash linux-headers
RUN apk --update add --virtual build-dependencies libffi-dev openssl-dev python-dev py-pip build-base libgl1-mesa-dev \
    && pip install --upgrade pip \
    && pip install --upgrade pipenv\
    && pip install --upgrade -r /app/requirements.txt\
    && apk del build-dependencies

COPY . /app

ENTRYPOINT [ "python" ]

CMD [ "main.py" ]