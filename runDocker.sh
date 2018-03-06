#! /bin/bash
echo Launch server on http://locahost:4200
docker run -d --rm --name ou-sont-mes-affaires-angular --publish 4200:80 --ip 192.168.100.15 --network=bridge-ou-sont-mes-affaires ou-sont-mes-affaires-web
