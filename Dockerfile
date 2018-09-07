FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
ADD css /usr/share/nginx/html/css
ADD img /usr/share/nginx/html/img
ADD js /usr/share/nginx/html/js
ADD tags /usr/share/nginx/html/tags
ADD fonts /usr/share/nginx/html/fonts
ADD dataformaters /usr/share/nginx/html/dataformaters