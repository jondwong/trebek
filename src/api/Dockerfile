FROM python:3.7

RUN mkdir -p /usr/apps/trebek-api
COPY . /usr/apps/trebek-api
WORKDIR /usr/apps/trebek-api
EXPOSE 5000

RUN pip install -r requirements.txt

ENTRYPOINT ["python"]
CMD ["app.py"]