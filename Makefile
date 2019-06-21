main: dev
build: build-binary
dev: run-autoreload

PROJECT=phoomparin
IMAGE=asia.gcr.io/${PROJECT}/thaksin
TAG=latest

remote: build-remote deploy
local: build-local deploy

run-autoreload:
	@gin --all run main.go

build-binary:
	env CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

deploy:
	@echo --- Deploying Image: ${IMAGE} ---
	gcloud beta run deploy thaksin --image ${IMAGE} --project ${PROJECT}

build-remote:
	@echo --- Building Image Remotely: ${IMAGE} ---
	gcloud builds submit --config cloudbuild.yml .

build-local:
	@echo --- Building Image Locally: ${IMAGE} ---
	docker build -t ${IMAGE}:${TAG} .
	docker push ${IMAGE}:${TAG}
