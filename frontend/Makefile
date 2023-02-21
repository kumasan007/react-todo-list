build:
	docker compose build --build-arg UID=`id -u` --build-arg GID=`id -g` --no-cache
	docker compose up -d
	cp src/.env.example src/.env
