FROM pypy:3
WORKDIR /usr/src/app
COPY requirements.txt /usr/src/app
RUN pip install --upgrade pip
COPY . . 
RUN pip install -r requirements.txt --no-cache-dir
