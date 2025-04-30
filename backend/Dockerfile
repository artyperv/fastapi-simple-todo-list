FROM python:3.12-slim

WORKDIR /app/

COPY ./requirements.txt /app/
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./gunicorn_conf.py /app/

COPY ./start-reload.sh /
RUN ["chmod", "+x", "/start-reload.sh"]

COPY ./start.sh /
RUN ["chmod", "+x", "/start.sh"]

COPY ./app /app/app

COPY ./config.yaml /app/config.yaml
