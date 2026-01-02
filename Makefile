include .env
export

.PHONY: build up down run clean

# Start Infrastructure (Hasura, Postgres, MinIO, Temporal)
up:
	sudo docker compose up -d

# Stop Infrastructure
down:
	sudo docker compose down

# Build SAM Application
build:
	cd serverless-api/ && sam build --use-container 

# Run API Locally with Parameter Overrides
run:
	cd serverless-api/ && sam local start-api \
		-t .aws-sam/build/template.yaml \
		--parameter-overrides \
			ParameterKey=Minio_Endpoint,ParameterValue=$(MINIO_URL) ParameterKey=Minio_Port,ParameterValue=$(MINIO_PORT) ParameterKey=MinioPublic,ParameterValue=$(MINIO_USR) ParameterKey=MinioPrivate,ParameterValue=$(MINIO_PWD) ParameterKey=GraphQL_Endpoint,ParameterValue=$(HASURA_URL_AWS) ParameterKey=HasuraSecret,ParameterValue=$(HASURA_ADMIN_SECRET) ParameterKey=Temporal_Endpoint,ParameterValue=$(TEMPORAL_URL) ParameterKey=JWTSecret,ParameterValue=$(JWT_SECRET)

# Run API Locally with Parameter Overrides after building
run-build: build
	cd serverless-api/ && sam local start-api \
		-t .aws-sam/build/template.yaml \
		--parameter-overrides \
			ParameterKey=Minio_Endpoint,ParameterValue=$(MINIO_URL) ParameterKey=Minio_Port,ParameterValue=$(MINIO_PORT) ParameterKey=MinioPublic,ParameterValue=$(MINIO_USR) ParameterKey=MinioPrivate,ParameterValue=$(MINIO_PWD) ParameterKey=GraphQL_Endpoint,ParameterValue=$(HASURA_URL_AWS) ParameterKey=HasuraSecret,ParameterValue=$(HASURA_ADMIN_SECRET) ParameterKey=Temporal_Endpoint,ParameterValue=$(TEMPORAL_URL) ParameterKey=JWTSecret,ParameterValue=$(JWT_SECRET)

# Clean build artifacts
clean:
	rm -rf serverless-api/.aws-sam 

rest-run:
	cd api/ && nodemon

temporal:
	temporal server start-dev --ip 0.0.0.0 --ui-port 7777

pworker:
	cd python-worker && source venv/bin/activate && python3 -m src.worker

tworker:
	cd ts-worker && ts-node worker.ts

run-f:
	cd frontend/ && npm run dev
