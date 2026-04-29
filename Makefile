.env:
	@cp .env.example .env

.PHONY: up down rebuild logs ps clean

up: .env
	docker-compose up -d

down:
	docker-compose down

rebuild: down
	docker-compose build --no-cache
	docker-compose up -d

logs:
	docker-compose logs -f

ps:
	docker-compose ps

clean:
	docker-compose down -v

init-db:
	docker-compose exec backend npm run db:migrate

dev:
	docker-compose up -d backend frontend
	docker-compose logs -f backend