FROM python
ENV PYTHONUNBUFFERED 1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install --upgrade pip
COPY . . 
RUN pip install -r requirements.txt --no-cache-dir
