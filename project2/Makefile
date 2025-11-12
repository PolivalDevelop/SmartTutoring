run:
	docker compose up -d;

stop:
	docker compose down;

update-api:
	cd backend && \
	docker build . --no-cache -t smart-tutoring-api;

update-frontend:
	cd frontend && \
	docker build . --no-cache -t smart-tutoring-frontend;