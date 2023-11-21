FROM python:3.10

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip

COPY ./server/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./server/* /app/

EXPOSE 80

CMD ["gunicorn", "--bind", "0.0.0.0:80", "--workers", "4", "--threads", "4", "--timeout", "120", "main:app"]
